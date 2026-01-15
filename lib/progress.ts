'use client';
import { supabase } from '@/lib/supabaseClient';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

/* ===============================
   LESSON PROGRESS (DB ONLY)
================================ */

export async function isLessonCompleted(
  userId: string,
  lessonId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('user_progress')
    .select('is_completed')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle();

  return data?.is_completed ?? false;
}



// export async function markLessonCompleted(lessonId: string) {
//   const { error } = await supabase
//     .from('user_progress')
//     .upsert(
//       {
//         lesson_id: lessonId,
//         is_completed: true,
//         completed_at: new Date().toISOString(),
//       },
//       {
//         onConflict: 'lesson_id',
//       }
//     );

//   if (error) {
//     console.error('SAVE PROGRESS ERROR:', error);
//     throw error;
//   }
// }


// export async function markLessonCompleted(lessonId: string) {
//   // 1. Get the current logged-in user
//   const { data: { user }, error: authError } = await supabase.auth.getUser();

//   if (authError || !user) {
//     console.error('User not authenticated');
//     return;
//   }

//   // 2. Save progress with the USER ID
//   const { error } = await supabase
//     .from('user_progress')
//     .upsert(
//       {
//         user_id: user.id, // <--- THIS WAS MISSING
//         lesson_id: lessonId,
//         is_completed: true,
//         completed_at: new Date().toISOString(),
//       },
//       {
//         // Important: Match the unique constraint in your database
//         // Usually, this should be both user_id and lesson_id
//         onConflict: 'user_id,lesson_id', 
//       }
//     );

//   if (error) {
//     // Log the actual message so you don't see "{}"
//     console.error('SAVE PROGRESS ERROR:', error.message); 
//     throw error;
//   }
// }
export async function markLessonCompleted(lessonId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("No user found in session. Are you logged in?");
    return;
  }

  // LOG THIS: Copy this ID and check if it exists in your user_profile table
  console.log("Attempting to save for User ID:", user.id); 

  const { error } = await supabase
    .from('user_progress')
    .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' }
    );

  if (error) {
    console.error('DATABASE ERROR MESSAGE:', error.message);
    console.error('DATABASE ERROR DETAIL:', error.details); // This gives more info!
    throw error;
  }
}

export async function getCompletedLessons(
  userId: string,
  lessonIds: string[]
): Promise<string[]> {
  if (lessonIds.length === 0) return [];

  const { data,error } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('is_completed', true)
    .in('lesson_id', lessonIds);

     if (error) {
    console.error('READ PROGRESS ERROR:', error);
   

    return [];
  }

  return data?.map((l) => l.lesson_id) ?? [];
}
