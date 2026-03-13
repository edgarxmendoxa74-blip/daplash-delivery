import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('id');

      if (error) throw error;

      // Transform the data into a more usable format
      const settings: SiteSettings = {
        site_name: data.find(s => s.id === 'site_name')?.value || 'Daplash Delivery',
        site_logo: data.find(s => s.id === 'site_logo')?.value || '',
        site_description: data.find(s => s.id === 'site_description')?.value || '',
        site_tagline: data.find(s => s.id === 'site_tagline')?.value || '',
        address: data.find(s => s.id === 'address')?.value || 'Calinan, Davao City',
        facebook_url: data.find(s => s.id === 'facebook_url')?.value || '',
        facebook_handle: data.find(s => s.id === 'facebook_handle')?.value || '',
        currency: data.find(s => s.id === 'currency')?.value || '₱',
        currency_code: data.find(s => s.id === 'currency_code')?.value || 'PHP',
        messenger_id: data.find(s => s.id === 'messenger_id')?.value || '61558704207383',
        starting_point_lat: parseFloat(data.find(s => s.id === 'starting_point_lat')?.value || '7.201558576842343'),
        starting_point_lng: parseFloat(data.find(s => s.id === 'starting_point_lng')?.value || '125.45844856673499'),
        starting_point_enabled: data.find(s => s.id === 'starting_point_enabled')?.value === 'true',
        convenience_fee: parseFloat(data.find(s => s.id === 'convenience_fee')?.value || '0'),
        convenience_fee_enabled: data.find(s => s.id === 'convenience_fee_enabled')?.value === 'true',
        additional_store_fee: parseFloat(data.find(s => s.id === 'additional_store_fee')?.value || '0'),
        base_delivery_fee: parseFloat(data.find(s => s.id === 'base_delivery_fee')?.value || '49'),
        base_delivery_distance: parseFloat(data.find(s => s.id === 'base_delivery_distance')?.value || '2'),
        extra_delivery_fee_per_km: parseFloat(data.find(s => s.id === 'extra_delivery_fee_per_km')?.value || '10'),
        max_delivery_distance: parseFloat(data.find(s => s.id === 'max_delivery_distance')?.value || '15'),
        night_shift_surcharge: parseFloat(data.find(s => s.id === 'night_shift_surcharge')?.value || '20'),
        night_shift_start: data.find(s => s.id === 'night_shift_start')?.value || '22:00',
        night_shift_end: data.find(s => s.id === 'night_shift_end')?.value || '05:00',
        night_shift_enabled: data.find(s => s.id === 'night_shift_enabled')?.value === 'true'
      };

      setSiteSettings(settings);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSetting = async (id: string, value: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('id', id);

      if (error) throw error;

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site setting:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site setting');
      throw err;
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      setError(null);

      const updatePromises = Object.entries(updates).map(([key, value]) =>
        supabase
          .from('site_settings')
          .upsert({ id: key, value, updated_at: new Date().toISOString() })
      );

      const results = await Promise.all(updatePromises);

      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Some updates failed');
      }

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return {
    siteSettings,
    loading,
    error,
    updateSiteSetting,
    updateSiteSettings,
    refetch: fetchSiteSettings
  };
};
