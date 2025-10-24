// Lightweight supabase client stub to avoid runtime/type errors during development.
// Replace this with a real Supabase client using `@supabase/supabase-js` and your project
// environment variables when you're ready.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: any = {
  from: (table: string) => ({
    insert: async (rows: any[]) => {
      // Log a helpful message so developers notice they need to configure Supabase
      // in a real environment.
      // eslint-disable-next-line no-console
      console.warn(
        '[supabase stub] insert called on table',
        table,
        'rows:',
        rows,
        'Install and configure @supabase/supabase-js to perform real requests.'
      );

      return { data: null, error: new Error('Supabase client not configured') };
    },
  }),
};
