-- Trek page "Pro tips and important notes" (2026-11-02): the trek editor's "Tips for eating on the trail" and
-- "Teahouse notes" no longer stop at 10 each. Each list must still be a JSON array; each point keeps its length limits.

alter table public.trek_translations
  drop constraint trek_translations_meal_trail_tips_check,
  drop constraint trek_translations_meal_teahouse_notes_check,
  add constraint trek_translations_meal_trail_tips_check check (jsonb_typeof(meal_trail_tips) = 'array'),
  add constraint trek_translations_meal_teahouse_notes_check check (jsonb_typeof(meal_teahouse_notes) = 'array');
