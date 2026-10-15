-- Testnet-only collaboration. No anonymous/authenticated table access.
begin;
create table public.landed_chat_auth (id text primary key, kind text not null check(kind in ('challenge','session')), data jsonb not null, expires bigint not null);
create table public.landed_chat_limits (id text primary key, count integer not null, expires bigint not null);
create table public.landed_chat_messages (id bigint generated always as identity primary key, chain integer not null check(chain in (43113,11230)), job bigint not null check(job>=0), sender text not null, kind text not null check(kind in ('message','feedback')), stage integer, version text, body text not null check(length(body) between 1 and 2000), created bigint not null, client_id text not null, unique(chain,job,sender,client_id));
create index on public.landed_chat_messages(chain,job,id);
create index on public.landed_chat_messages(sender,created);
create table public.landed_chat_reads (chain integer,job bigint,wallet text,last_id bigint not null,primary key(chain,job,wallet));
alter table public.landed_chat_auth enable row level security;
alter table public.landed_chat_limits enable row level security;
alter table public.landed_chat_messages enable row level security;
alter table public.landed_chat_reads enable row level security;
revoke all on public.landed_chat_auth,public.landed_chat_limits,public.landed_chat_messages,public.landed_chat_reads from public,anon,authenticated;
grant all on public.landed_chat_auth,public.landed_chat_limits,public.landed_chat_messages,public.landed_chat_reads to service_role;
grant usage,select on sequence public.landed_chat_messages_id_seq to service_role;
create function public.landed_chat_rate(k text, max_count integer) returns boolean language plpgsql set search_path='' as $$
declare t bigint := floor(extract(epoch from clock_timestamp())*1000); n integer;
begin
 delete from public.landed_chat_auth where expires<t;
 delete from public.landed_chat_limits where expires<t;
 insert into public.landed_chat_limits values(k,1,t+60000) on conflict(id) do update set count=public.landed_chat_limits.count+1 returning count into n;
 return n<=max_count;
end $$;
create function public.landed_chat_send(c integer,j bigint,w text,k text,s integer,v text,b text,cid text) returns public.landed_chat_messages language plpgsql set search_path='' as $$
declare m public.landed_chat_messages; t bigint := floor(extract(epoch from clock_timestamp())*1000);
begin
 perform pg_advisory_xact_lock(hashtextextended(w,0));
 select * into m from public.landed_chat_messages where chain=c and job=j and sender=w and client_id=cid;
 if found then return m; end if;
 if (select count(*) from public.landed_chat_messages where sender=w and created>t-60000)>=20 then raise exception 'RATE_LIMIT'; end if;
 insert into public.landed_chat_messages(chain,job,sender,kind,stage,version,body,created,client_id) values(c,j,w,k,s,v,b,t,cid) returning * into m;
 return m;
end $$;
create function public.landed_chat_read(c integer,j bigint,w text,i bigint) returns boolean language plpgsql set search_path='' as $$
begin
 if not exists(select 1 from public.landed_chat_messages where id=i and chain=c and job=j) then return false; end if;
 insert into public.landed_chat_reads values(c,j,w,i) on conflict(chain,job,wallet) do update set last_id=greatest(public.landed_chat_reads.last_id,excluded.last_id);
 return true;
end $$;
revoke all on function public.landed_chat_rate(text,integer),public.landed_chat_send(integer,bigint,text,text,integer,text,text,text),public.landed_chat_read(integer,bigint,text,bigint) from public,anon,authenticated;
grant execute on function public.landed_chat_rate(text,integer),public.landed_chat_send(integer,bigint,text,text,integer,text,text,text),public.landed_chat_read(integer,bigint,text,bigint) to service_role;
commit;
