-- Sugestões de garçom na tela /avaliar: os nomes mais digitados viram botões para o próximo cliente.
-- O público continua sem ler review_requests (tem nome de cliente); esta função devolve só nomes de garçom.
-- Filtros contra erro de digitação e brincadeira: o nome precisa aparecer em pelo menos 2 envios nos
-- últimos 60 dias (quem sai da casa some sozinho da lista).

create or replace function public.waiter_suggestions()
returns table (name text, uses bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select
    -- grafia mais usada dentro do grupo (ex.: "Gabriel Paulista" ganha de "gabriel paulista")
    mode() within group (order by btrim(r.waiter_name)) as name,
    count(*) as uses
  from public.review_requests r
  where r.waiter_name is not null
    and r.created_at > now() - interval '60 days'
  group by lower(btrim(regexp_replace(r.waiter_name, '\s+', ' ', 'g')))
  having count(*) >= 2
  order by uses desc, name
  limit 30
$$;

comment on function public.waiter_suggestions() is 'Garçons mais citados na placa de avaliação (>= 2 envios em 60 dias). Só nomes de garçom; nada de cliente.';

revoke all on function public.waiter_suggestions() from public;
grant execute on function public.waiter_suggestions() to anon, authenticated;
