-- Conteúdo editável do site (CMS em /admin/cms).
-- Uma linha por bloco: links, destaques, agenda, faq. O valor é o JSON completo do bloco.
create table if not exists public.conteudo (
  chave text primary key,
  valor jsonb not null,
  atualizado_em timestamptz not null default now(),
  atualizado_por uuid references auth.users (id)
);

comment on table public.conteudo is 'Blocos de conteúdo do site editados pelo CMS (/admin/cms).';

alter table public.conteudo enable row level security;

-- Leitura pública (o site lê com a chave anônima)
drop policy if exists "conteudo: leitura publica" on public.conteudo;
create policy "conteudo: leitura publica"
  on public.conteudo for select
  to anon, authenticated
  using (true);

-- Escrita só para usuários autenticados (equipe do bar)
drop policy if exists "conteudo: escrita autenticada" on public.conteudo;
create policy "conteudo: escrita autenticada"
  on public.conteudo for all
  to authenticated
  using (true)
  with check (true);

-- Mantém atualizado_em em dia
create or replace function public.conteudo_marcar_atualizacao()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  new.atualizado_por := auth.uid();
  return new;
end $$;

drop trigger if exists conteudo_atualizacao on public.conteudo;
create trigger conteudo_atualizacao
  before insert or update on public.conteudo
  for each row execute function public.conteudo_marcar_atualizacao();

-- Avisos (toasts) foram descontinuados no site v3.
-- Para remover a tabela antiga, execute manualmente quando tiver certeza:
-- drop table if exists public.avisos;

-- Permissões de tabela (RLS já restringe as linhas; sem GRANT o PostgREST devolve 42501)
grant usage on schema public to anon, authenticated;
grant select on public.conteudo to anon, authenticated;
grant insert, update, delete on public.conteudo to authenticated;
