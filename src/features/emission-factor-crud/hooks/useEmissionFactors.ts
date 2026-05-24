'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/shared/lib/supabase';
import type { EmissionFactor, EmissionFactorFormValues } from '@/entities/emission-factor';

export function useEmissionFactors() {
  const [factors, setFactors]   = useState<EmissionFactor[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('emission_factors')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setFactors(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  async function add(values: EmissionFactorFormValues) {
    const { error } = await supabase.from('emission_factors').insert(values);
    if (error) throw new Error(error.message);
    await fetch();
  }

  async function update(id: string, values: EmissionFactorFormValues) {
    const { error } = await supabase
      .from('emission_factors')
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetch();
  }

  async function remove(id: string) {
    const { error } = await supabase.from('emission_factors').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await fetch();
  }

  return { factors, loading, error, add, update, remove, refresh: fetch };
}
