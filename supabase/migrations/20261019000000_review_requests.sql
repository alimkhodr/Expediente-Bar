-- Placa de avaliação: cada envio da tela /avaliar (nome do cliente e do garçom) antes de abrir o Google.
-- Painel em /admin/reviews: a equipe confere o nome do cliente nas avaliações do Google e marca como confirmada.

create table if not exists public.review_requests (
  id bigint generated always as identity primary key,
  customer_name text check (customer_name is null or char_length(btrim(customer_name)) between 1 and 80),
  waiter_name text check (waiter_name is null or char_length(btrim(waiter_name)) between 1 and 60),
  source text not null default 'site' check (source in ('nfc', 'qr', 'site')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.review_requests is 'Envios da placa de avaliação (/avaliar): nome do cliente, garçom, origem (nfc/qr/site), horário e conferência no Google.';
comment on column public.review_requests.confirmed_at is 'Quando a equipe achou a avaliação no Google com o nome do cliente; null = ainda não conferida.';

create index if not exists review_requests_created_at_idx on public.review_requests (created_at desc);

alter table public.review_requests enable row level security;

-- Público (cliente na mesa): só insere; não lê nada
drop policy if exists "review_requests: public inserts" on public.review_requests;
create policy "review_requests: public inserts"
  on public.review_requests for insert
  to anon, authenticated
  with check (confirmed_at is null);

-- Equipe logada: lê para o painel
drop policy if exists "review_requests: staff reads" on public.review_requests;
create policy "review_requests: staff reads"
  on public.review_requests for select
  to authenticated
  using (true);

-- Equipe logada: marca/desmarca a conferência (o GRANT abaixo limita à coluna confirmed_at)
drop policy if exists "review_requests: staff confirms" on public.review_requests;
create policy "review_requests: staff confirms"
  on public.review_requests for update
  to authenticated
  using (true)
  with check (true);

-- Permissões de tabela (RLS restringe as linhas; sem GRANT o PostgREST devolve 42501)
grant insert (customer_name, waiter_name, source) on public.review_requests to anon, authenticated;
grant select on public.review_requests to authenticated;
grant update (confirmed_at) on public.review_requests to authenticated;
