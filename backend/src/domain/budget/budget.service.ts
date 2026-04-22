import { supabase } from '../../infrastructure/db/supabase.client';

// -------------------------------------------------------
// Registra un gasto automáticamente cuando una propuesta
// cambia de estado a 'aprobada'
// -------------------------------------------------------
export const registrarGastoDesdeProuesta = async (proposalId: number) => {
  // 1. Traer la propuesta completa
  const { data: propuesta, error: propError } = await supabase
    .from('propuestas')
    .select('*')
    .eq('id_propuesta', proposalId)
    .single();

  if (propError || !propuesta) {
    throw new Error(`Budget Service: propuesta ${proposalId} no encontrada`);
  }

  // 2. Obtener el id_viaje a partir del grupo
  const { data: grupo, error: grupoError } = await supabase
    .from('grupos')
    .select('viaje_id')
    .eq('id', propuesta.grupo_id)
    .single();

  if (grupoError || !grupo) {
    throw new Error(`Budget Service: grupo ${propuesta.grupo_id} no encontrado`);
  }

  const id_viaje = grupo.viaje_id;

  // 3. Determinar monto y categoría según el tipo de propuesta
  let monto: number = 0;
  let moneda: string = 'MXN';
  let categoria: 'transporte' | 'hospedaje' = 'transporte';

  if (propuesta.tipo_item === 'vuelo') {
    const { data: vuelo, error: vueloError } = await supabase
      .from('vuelos')
      .select('precio, moneda')
      .eq('propuesta_id', proposalId)
      .single();

    if (vueloError || !vuelo) {
      throw new Error(`Budget Service: vuelo de propuesta ${proposalId} no encontrado`);
    }

    monto    = vuelo.precio;
    moneda   = vuelo.moneda ?? 'MXN';
    categoria = 'transporte';
  }

  if (propuesta.tipo_item === 'hospedaje') {
    const { data: hospedaje, error: hospError } = await supabase
      .from('hospedajes')
      .select('precio_total, moneda')
      .eq('propuesta_id', proposalId)
      .single();

    if (hospError || !hospedaje) {
      throw new Error(`Budget Service: hospedaje de propuesta ${proposalId} no encontrado`);
    }

    monto    = hospedaje.precio_total ?? 0;
    moneda   = hospedaje.moneda ?? 'MXN';
    categoria = 'hospedaje';
  }

  // Si no hay monto no registramos el gasto
  if (monto <= 0) {
    console.warn(`[Budget] Propuesta ${proposalId} aprobada sin monto — no se registra gasto`);
    return null;
  }

  // 4. Insertar en gastos
  const { data: gasto, error: gastoError } = await supabase
    .from('gastos')
    .insert({
      id_viaje,
      id_propuesta:  proposalId,
      descripcion:   propuesta.titulo,
      monto,
      moneda,
      categoria,
      id_pagador:    propuesta.creado_por,   // quien propuso es el responsable inicial
      tipo_division: 'equitativa',
      fecha_gasto:   new Date().toISOString().split('T')[0],  // fecha actual YYYY-MM-DD
    })
    .select()
    .single();

  if (gastoError) {
    throw new Error(`Budget Service: error al registrar gasto — ${gastoError.message}`);
  }

  console.log(`[Budget] Gasto registrado para propuesta ${proposalId}: $${monto} ${moneda}`);
  return gasto;
};

// -------------------------------------------------------
// Consulta el resumen de presupuesto de un viaje
// Usa la vista v_resumen_presupuesto creada en el DDL v3
// -------------------------------------------------------
export const getResumenPresupuesto = async (viajeId: number) => {
  const { data, error } = await supabase
    .from('v_resumen_presupuesto')
    .select('*')
    .eq('id_viaje', viajeId)
    .single();

  if (error) throw new Error(`Budget Service: error al obtener resumen — ${error.message}`);
  return data;
};