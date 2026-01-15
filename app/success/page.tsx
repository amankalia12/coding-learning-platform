"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function handleSuccess() {
      // 1. Get the logged in user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. UPDATE THE DATA HERE
        // This is what unlocks the lessons!
        const { error } = await supabase
          .from("user_profiles")
          .update({ is_pro: true }) 
          .eq("id", user.id);

        if (!error) {
          console.log("Data updated! User is now Pro.");
          // 3. Refresh the app state so the Course Page knows the change happened
          router.refresh(); 
        }
      }
      setLoading(false);
    }

    handleSuccess();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      {loading ? (
        <p>Unlocking your lessons...</p>
      ) : (
        <button 
          onClick={() => window.location.href = "/"}
          className="mt-4 bg-blue-600 p-3 rounded text-white"
        >
          Go Back to Course (Lessons Unlocked)
        </button>
      )}
    </div>
  );
}

