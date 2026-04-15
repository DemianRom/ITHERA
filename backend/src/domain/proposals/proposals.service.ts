import { supabase } from '../../infrastructure/db/supabase.client';
import { LockPayload } from './proposals.entity';

// Bloquea una propuesta — la marca como editándose
export const lockPropuesta = async (payload: LockPayload) => {
  const { id_propuesta, id_usuario } = payload;

  // Verificar que no esté ya bloqueada por otro usuario
  const { data: propuesta, error: fetchError } = await supabase
    .from('propuestas')
    .select('is_locked, locked_by')
    .eq('id_propuesta', id_propuesta)
    .single();

  if (fetchError) throw new Error('Propuesta no encontrada');

  if (propuesta.is_locked && propuesta.locked_by !== id_usuario) {
    throw new Error('La propuesta ya está siendo editada por otro usuario');
  }

  return supabase
    .from('propuestas')
    .update({
      is_locked: true,
      locked_by: id_usuario,
      locked_at: new Date().toISOString(),
    })
    .eq('id_propuesta', id_propuesta)
    .select()
    .single();
};

// Libera el bloqueo de una propuesta
export const unlockPropuesta = async (id_propuesta: number, id_usuario: number) => {
  return supabase
    .from('propuestas')
    .update({
      is_locked: false,
      locked_by: null,
      locked_at: null,
    })
    .eq('id_propuesta', id_propuesta)
    .eq('locked_by', id_usuario) // solo el que bloqueó puede liberar
    .select()
    .single();
};

// Libera todos los bloqueos que llevan más de 5 minutos (TTL)
export const liberarBloqueosTTL = async () => {
  const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('propuestas')
    .update({ is_locked: false, locked_by: null, locked_at: null })
    .eq('is_locked', true)
    .lt('locked_at', cincoMinutosAtras)
    .select('id_propuesta, id_viaje');

  if (error) console.error('[TTL] Error liberando bloqueos:', error);
  return data ?? [];
};
