-- A trek may have several highlight days (e.g. Annapurna Circuit: Tilicho Lake and Thorong La), not just one.
-- save_trek still clears the old flags before saving the days; with the index gone that is harmless.
drop index if exists public.trek_days_one_high_point_idx;
