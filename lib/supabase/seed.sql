insert into public.stores (
    merchant_id, name, street, city, state, zip_code, phone_number, timezone, active
) values
      (
          '1e3ce814-784d-48c1-b4d1-188ee301e4f8',
          'Store Test 1',
          'Street Test 1',
          'Lisbon',
          'Lisbon',
          '1111-111',
          '+351910000001',
          'Europe/Lisbon',
          true
      ),
      (
          '1e3ce814-784d-48c1-b4d1-188ee301e4f8',
          'Store Test 2',
          'Street Test 2',
          'Porto',
          'Porto',
          '2222-222',
          '+351910000002',
          'Europe/Lisbon',
          true
      ),
      (
          '789675b1-49ab-4a77-ac64-8c31a443a541',
          'Store Test 3',
          'Street Test 3',
          'Braga',
          'Braga',
          '3333-333',
          '+351910000003',
          'Europe/Lisbon',
          true
      );


insert into public.products (
    store_id, name, description, price, available
) values
      (
          '775fd405-42da-44c5-9d2a-e9b295f18efa',
          'Item 1',
          'Item 1 Desc',
          7.50,
          true
      ),
      (
          '775fd405-42da-44c5-9d2a-e9b295f18efa',
          'Item 2',
          'Item 2 Desc',
          8.90,
          true
      ),
      (
          'a15b901d-3516-4b0f-adda-97956cffbf37',
          'Item 3',
          'Item 3 Desc',
          10.50,
          true
      ),
      (
          'a15b901d-3516-4b0f-adda-97956cffbf37',
          'Item 4',
          'Item 4 Desc',
          12.90,
          true
      ),
      (
          'c4e07272-b59e-4eda-9413-e4cde8905faf',
          'Item 5',
          'Item 5 Desc',
          11.90,
          true
      ),
      (
          'c4e07272-b59e-4eda-9413-e4cde8905faf',
          'Item 6',
          'Item 6 Desc',
          9.90,
          false
      );

