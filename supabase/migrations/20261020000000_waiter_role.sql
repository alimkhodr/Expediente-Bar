-- Login de garçom: só chama senha (insere em public.senhas).
-- O papel fica em auth.users.raw_app_meta_data ->> 'role' = 'garcom' e chega no JWT como app_metadata.role.
-- app_metadata só é alterável com a service role (o próprio usuário não consegue se promover).
--
-- Para transformar um login em garçom (rodar no SQL Editor depois de criar o usuário em Authentication → Users):
--   update auth.users
--     set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "garcom"}'
--     where email = 'garcom@expedientebar.com.br';
-- O papel vale a partir do próximo login (ou da próxima renovação do token).

create or replace function public.is_staff()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'garcom'
$$;

comment on function public.is_staff() is 'true para a equipe da gerência; false para logins de garçom (app_metadata.role = garcom).';

-- Conteúdo do site: só a gerência edita (leitura pública continua igual)
drop policy if exists "conteudo: escrita autenticada" on public.conteudo;
create policy "conteudo: escrita autenticada"
  on public.conteudo for all
  to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- Placa de avaliação: garçom não vê o painel nem confirma avaliações
drop policy if exists "review_requests: staff reads" on public.review_requests;
create policy "review_requests: staff reads"
  on public.review_requests for select
  to authenticated
  using ((select public.is_staff()));

drop policy if exists "review_requests: staff confirms" on public.review_requests;
create policy "review_requests: staff confirms"
  on public.review_requests for update
  to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- Avisos (tabela antiga, sem uso no site): escrita só da gerência
drop policy if exists "avisos_insert_auth" on public.avisos;
create policy "avisos_insert_auth"
  on public.avisos for insert
  to authenticated
  with check ((select public.is_staff()));

drop policy if exists "avisos_update_auth" on public.avisos;
create policy "avisos_update_auth"
  on public.avisos for update
  to authenticated
  using ((select public.is_staff()));

drop policy if exists "avisos_delete_auth" on public.avisos;
create policy "avisos_delete_auth"
  on public.avisos for delete
  to authenticated
  using ((select public.is_staff()));

-- Senhas: qualquer login (gerência ou garçom) continua podendo chamar ("insercao autenticada" não muda)
