## Installation and Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/Joana2712/store-manager.git
cd store-manager
npm install
```

Create a .env.local file in the root of the project and add the following variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Supabase Setup:

Create a Supabase project
Open the SQL Editor
Run the following files in this order:

lib/supabase/migrations/001_init.sql
lib/supabase/seed.sql

## Running the project
Start the development server:

```bash
npm run dev
```

Then open the app in your browser:

http://localhost:3000
