import { supabase } from '../../infrastructure/db/supabase.client';

// ── Types ────────────────────────────────────────────────────────────────

export interface LockResult {
  success: boolean;
  lockedBy?: string;
  lockedByName?: string;
}

export interface ReleasedLock {
  propuestaId: string;
  grupoId: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────

type ServiceError = Error & { statusCode?: number };

const createError = (message: string, statusCode: number): ServiceError => {
  const err = new Error(message) as ServiceError;
  err.statusCode = statusCode;
  return err;
};

// ── Lock Operations ─────────────────────────────────────────────────────

/**
 * Intenta adquirir un bloqueo sobre una propuesta.
 * 
 * Flujo:
 * 1. Si bloqueado_por IS NULL → bloquea y retorna success
 * 2. Si bloqueado_por === userId → idempotente, retorna success
 * 3. Si bloqueado_por !== userId → retorna failure con info del bloqueador
 */
export const acquireLock = async (
  propuestaId: string,
  userId: string,
): Promise<LockResult> => {
  // Consultar estado actual del bloqueo
  const { data: proposal, error } = await supabase
    .from('propuestas')
    .select('id_propuesta, grupo_id, bloqueado_por, fecha_bloqueo')
    .eq('id_propuesta', propuestaId)
    .single();

  if (error || !proposal) {
    throw createError('Propuesta no encontrada', 404);
  }

  const currentLock = proposal.bloqueado_por;

  // Caso 1: Libre → bloquear
  if (currentLock === null || currentLock === undefined) {
    const { error: updateError } = await supabase
      .from('propuestas')
      .update({
        bloqueado_por: userId,
        fecha_bloqueo: new Date().toISOString(),
      })
      .eq('id_propuesta', propuestaId);

    if (updateError) throw createError(updateError.message, 500);

    return { success: true };
  }

  // Caso 2: Ya bloqueado por el mismo usuario (idempotente)
  if (String(currentLock) === String(userId)) {
    return { success: true };
  }

  // Caso 3: Bloqueado por otro usuario → obtener nombre
  const { data: blocker } = await supabase
    .from('usuarios')
    .select('id_usuario, nombre')
    .eq('id_usuario', currentLock)
    .single();

  return {
    success: false,
    lockedBy: String(currentLock),
    lockedByName: blocker?.nombre ?? 'Otro usuario',
  };
};

/**
 * Libera el bloqueo de una propuesta.
 * Solo el usuario que bloqueó puede liberarlo.
 */
export const releaseLock = async (
  propuestaId: string,
  userId: string,
): Promise<boolean> => {
  const { data: proposal, error } = await supabase
    .from('propuestas')
    .select('id_propuesta, bloqueado_por')
    .eq('id_propuesta', propuestaId)
    .single();

  if (error || !proposal) {
    throw createError('Propuesta no encontrada', 404);
  }

  // Solo el usuario que bloqueó puede desbloquear
  if (proposal.bloqueado_por !== null && String(proposal.bloqueado_por) !== String(userId)) {
    throw createError('No puedes desbloquear una propuesta bloqueada por otro usuario', 403);
  }

  const { error: updateError } = await supabase
    .from('propuestas')
    .update({
      bloqueado_por: null,
      fecha_bloqueo: null,
    })
    .eq('id_propuesta', propuestaId);

  if (updateError) throw createError(updateError.message, 500);

  return true;
};

/**
 * Libera TODOS los bloqueos de un usuario específico.
 * Se usa cuando el usuario se desconecta (onDisconnect).
 * Retorna las propuestas liberadas con su grupo_id para notificar a las rooms.
 */
export const releaseAllUserLocks = async (
  userId: string,
): Promise<ReleasedLock[]> => {
  // Buscar todas las propuestas bloqueadas por este usuario
  const { data: locked, error: selectError } = await supabase
    .from('propuestas')
    .select('id_propuesta, grupo_id')
    .eq('bloqueado_por', userId);

  if (selectError) {
    console.error('[lock-service] Error buscando bloqueos del usuario:', selectError.message);
    return [];
  }

  if (!locked || locked.length === 0) return [];

  // Liberar todos
  const { error: updateError } = await supabase
    .from('propuestas')
    .update({ bloqueado_por: null, fecha_bloqueo: null })
    .eq('bloqueado_por', userId);

  if (updateError) {
    console.error('[lock-service] Error liberando bloqueos:', updateError.message);
    return [];
  }

  console.log(`[lock-service] Liberados ${locked.length} bloqueo(s) del usuario ${userId}`);

  return locked.map((p: any) => ({
    propuestaId: String(p.id_propuesta),
    grupoId: String(p.grupo_id),
  }));
};

/**
 * Limpia bloqueos huérfanos (TTL expirado).
 * Bloqueos con fecha_bloqueo más antigua que `ttlMinutes` minutos.
 * Se ejecuta periódicamente por el scheduler.
 */
export const cleanExpiredLocks = async (
  ttlMinutes: number,
): Promise<ReleasedLock[]> => {
  const cutoff = new Date(Date.now() - ttlMinutes * 60 * 1000).toISOString();

  // Buscar bloqueos expirados
  const { data: expired, error: selectError } = await supabase
    .from('propuestas')
    .select('id_propuesta, grupo_id, bloqueado_por')
    .not('bloqueado_por', 'is', null)
    .lt('fecha_bloqueo', cutoff);

  if (selectError) {
    console.error('[lock-service] Error buscando bloqueos expirados:', selectError.message);
    return [];
  }

  if (!expired || expired.length === 0) return [];

  // Liberar los expirados
  const expiredIds = expired.map((p: any) => p.id_propuesta);
  const { error: updateError } = await supabase
    .from('propuestas')
    .update({ bloqueado_por: null, fecha_bloqueo: null })
    .in('id_propuesta', expiredIds);

  if (updateError) {
    console.error('[lock-service] Error limpiando bloqueos expirados:', updateError.message);
    return [];
  }

  console.log(`[lock-service] Limpiados ${expired.length} bloqueo(s) expirado(s) (TTL: ${ttlMinutes}min)`);

  return expired.map((p: any) => ({
    propuestaId: String(p.id_propuesta),
    grupoId: String(p.grupo_id),
  }));
};
