-- Placa de avaliação: cada envio da tela /avaliar (nome do garçom digitado) antes de abrir o Google.
-- Painel em /admin/reviews. Sem dados do cliente (nome do garçom, origem e horário apenas).

create table if not exists public.review_requests (
  id bigint generated always as identity primary key,
  waiter_name text check (waiter_name is null or char_length(btrim(waiter_name)) between 1 and 60),
  source text not null default 'site' check (source in ('nfc', 'qr', 'site')),
  created_at timestamptz not null default now()
);

comment on table public.review_requests is 'Envios da placa de avaliação (/avaliar): nome do garçom, origem (nfc/qr/site) e horário.';

create index if not exists review_requests_created_at_idx on public.review_requests (created_at desc);

alter table public.review_requests enable row level security;

-- Público (cliente na mesa): só insere; não lê nada
drop policy if exists "review_requests: public inserts" on public.review_requests;
create policy "review_requests: public inserts"
  on public.review_requests for insert
  to anon, authenticated
  with check (true);

-- Equipe logada: lê para o painel
drop policy if exists "review_requests: staff reads" on public.review_requests;
create policy "review_requests: staff reads"
  on public.review_requests for select
  to authenticated
  using (true);

-- Permissões de tabela (RLS restringe as linhas; sem GRANT o PostgREST devolve 42501)
grant insert on public.review_requests to anon, authenticated;
grant select on public.review_requests to authenticated;
