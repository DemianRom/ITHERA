export type ProposalItemType = 'vuelo' | 'hospedaje';
export type ProposalStatus = 'guardada' | 'aprobada' | 'rechazada';

export interface SaveFlightProposalPayload {
  grupoId: number;
  fuente: string;
  titulo: string;
  descripcion?: string;
  payload?: Record<string, unknown>;
  vuelo: {
    aerolinea: string;
    numeroVuelo?: string;
    origenCodigo: string;
    origenNombre?: string;
    destinoCodigo: string;
    destinoNombre?: string;
    salida: string;
    llegada: string;
    duracion?: string;
    precio: number;
    moneda: string;
    escalas?: number;
    payload?: Record<string, unknown>;
  };
}

export interface SaveHotelProposalPayload {
  grupoId: number;
  fuente: string;
  titulo: string;
  descripcion?: string;
  payload?: Record<string, unknown>;
  hospedaje: {
    nombre: string;
    proveedor?: string;
    referenciaExterna?: string;
    direccion?: string;
    latitud?: number;
    longitud?: number;
    checkIn?: string;
    checkOut?: string;
    precioTotal?: number;
    moneda?: string;
    calificacion?: number;
    payload?: Record<string, unknown>;
  };
}

export interface UpdateProposalPayload {
  titulo?: string;
  descripcion?: string;
  estado?: ProposalStatus;
  payload?: Record<string, unknown>;
  detalle?: {
    aerolinea?: string;
    numeroVuelo?: string;
    origenCodigo?: string;
    origenNombre?: string;
    destinoCodigo?: string;
    destinoNombre?: string;
    salida?: string;
    llegada?: string;
    duracion?: string;
    precio?: number;
    moneda?: string;
    escalas?: number;
    nombre?: string;
    proveedor?: string;
    referenciaExterna?: string;
    direccion?: string;
    latitud?: number;
    longitud?: number;
    checkIn?: string;
    checkOut?: string;
    precioTotal?: number;
    calificacion?: number;
    payload?: Record<string, unknown>;
  };
}
