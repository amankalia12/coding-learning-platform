import { supabase } from '@/lib/supabaseClient';

<button
  onClick={async () => {
    await supabase.auth.signOut();
  }}
>
  Logout
</button>
