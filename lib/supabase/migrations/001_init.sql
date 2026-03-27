create extension if not exists "pgcrypto";


--merchant
create table public.merchants(
                                 id uuid primary key references auth.users(id) on delete cascade,
                                 email text unique,
                                 username text not null,
                                 created_at timestamptz default now()
);

--stores
create table public.stores(
                              id uuid primary key default gen_random_uuid(),
                              merchant_id uuid not null references public.merchants(id) on delete cascade,
                              name text not null,
                              street text not null,
                              city text not null,
                              state text not null,
                              zip_code text not null,
                              phone_number text not null,
                              timezone text not null,
                              active boolean default true,
                              created_at timestamptz default now(),
                              updated_at timestamptz default now()
);

--products
create table public.products(
                                id uuid primary key default gen_random_uuid(),
                                store_id uuid not null references public.stores(id) on delete cascade,
                                name text not null,
                                description text not null,
                                price numeric(10,2) not null,
                                available boolean default true,
                                created_at timestamptz default now(),
                                updated_at timestamptz default now()
);

--update func
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at= now();
return new;
end;
$$ language plpgsql;

--trigger stores
create trigger update_stores
    before update on public.stores
    for each row execute function update_updated_at();

--trigger product 
create trigger update_products
    before update on public.products
    for each row execute function update_updated_at();

-- automatically create merchants
create or replace function public.new_merchant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
insert into public.merchants (id, email, username)
values (
           new.id,
           new.email,
           coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
       );

return new;
end;
$$;

--rls
alter table merchants enable row level security;
alter table stores enable row level security;
alter table products enable row level security;

--merchants policies
create policy "Merchants can only view their own profile"
on merchants for select
                            using (auth.uid() = id);

--stores policies merchant-view
create policy "Merchants can only view their own stores"
on stores for select
                         using (merchant_id = auth.uid());

--stores policies merchant-insert
create policy "Merchants can only insert their own stores"
on stores for insert
with check (merchant_id = auth.uid());

--stores policies merchant-update
create policy "Merchants can only update their own stores"
on stores for update
                                using (merchant_id = auth.uid());

--products policies merchant-view
create policy "Merchants can only view their own products"
on products for select
                           using (
                           exists (
                           select 1 from stores
                           where stores.id = products.store_id
                           and stores.merchant_id = auth.uid()
                           )
                           );

--products policies merchant-insert 
create policy "Merchants can only insert their own products"
on products for insert
with check (
  exists (
    select 1 from stores
    where stores.id = products.store_id
    and stores.merchant_id = auth.uid()
  )
);

--products policies merchant-update
create policy "Merchants can only update their own products"
on products for update
                                  using (
                                  exists (
                                  select 1 from stores
                                  where stores.id = products.store_id
                                  and stores.merchant_id = auth.uid()
                                  )
                                  );

--products policies merchant-delete
create policy "Merchants can only delete their own products"
on products for delete
using (
  exists (
    select 1 from stores
    where stores.id = products.store_id
    and stores.merchant_id = auth.uid()
  )
);