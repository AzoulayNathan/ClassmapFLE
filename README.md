# ClassmapFLE

ClassmapFLE is now configured to run on Supabase (no Base44 dependency).

## Setup

1. Install dependencies:
   - `npm install`
2. Copy `.env.example` to `.env.local`
3. Set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Start dev server:
   - `npm run dev`

## Supabase CLI linkage

Use the project reference `dqsspskdsfdiaaymrngi`:

```bash
supabase login
supabase init
supabase link --project-ref dqsspskdsfdiaaymrngi
```

## Notes

- Keep real secrets only in local env files (`.env.local`), never in git.
- Shared Supabase project for TeachingApps:
  - URL: `https://dqsspskdsfdiaaymrngi.supabase.co`
