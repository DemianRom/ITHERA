// Representa una propuesta con campos de bloqueo
export interface Propuesta {
  id_propuesta: number;
  id_viaje: number;
  titulo: string;
  descripcion?: string;
  estado: 'abierta' | 'en_votacion' | 'aprobada' | 'bloqueada' | 'descartada' | 'empate';
  creado_por: number;
  is_locked: boolean;
  locked_by?: number | null;
  locked_at?: string | null;
  fecha_creacion?: string;
}

// Lo que el frontend manda para bloquear una propuesta
export interface LockPayload {
  id_propuesta: number;
  id_usuario: number;
}

// Lo que se transmite por WebSocket a todos del grupo
export interface LockEvent {
  id_propuesta: number;
  id_usuario: number | null;
  accion: 'BLOQUEADO' | 'LIBERADO';
  timestamp: string;
}