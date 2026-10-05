-- =============================================================================
-- Harden trigger functions + reset the request reference counter
--
-- 1. Pin search_path on the two trigger helpers (Supabase advisor
--    0011_function_search_path_mutable). With an empty search_path every
--    object must be schema-qualified; both functions already are, and
--    built-ins (now, coalesce, current_setting…) always resolve via pg_catalog.
-- 2. Reset quote_request_number_seq so the first real request is
--    EXP-YYYY-00001 (a rolled-back verification test consumed a value).
--    Guarded: it only resets while no quote requests exist.
-- =============================================================================

alter function public.set_updated_at() set search_path = '';
alter function public.log_lead_status() set search_path = '';

select setval('public.quote_request_number_seq', 1, false)
where not exists (select 1 from public.quote_requests);
