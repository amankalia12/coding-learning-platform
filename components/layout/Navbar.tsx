    // 'use client';

// import Link from 'next/link';
// import { supabase } from '@/lib/supabaseClient';
// import { useAuth } from '@/components/auth/AuthProvider';
// export default function Navbar() {

// const { user, loading } = useAuth();
//  if(loading){
//     return null;
//  }
//   if(!user){
//     return(
//         <Link
//         href="/login"
//         className="text-sm text-blue-400 hover:text-blue-300"
//       >
//         Login
//       </Link>
//     );
//   }
//     return (
//     <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
//       <div className="flex items-center gap-8">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-[#ffde00] rounded-lg rotate-3" /> {/* Mock Logo */}
//           <span className="text-2xl font-codedex tracking-tighter">CODÉDEX</span>
//         </div>
//         <div className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-slate-400">
//           <a href="#" className="hover:text-white transition">LEARN</a>
//           <a href="#" className="hover:text-white transition">PRACTICE</a>
//           <a href="#" className="hover:text-white transition">BUILD</a>
//           <a href="#" className="hover:text-white transition">COMMUNITY</a>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <button className="text-sm font-bold text-slate-400 hover:text-white transition">Sign In</button>
//         <button className="bg-[#ffde00] text-black px-5 py-2 rounded-md font-black text-xs uppercase tracking-tight hover:scale-105 transition active:scale-95">
//           Join Club
//         </button>
//       </div>
//     </nav>
//   );
// }

'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  language?: string;
};

export default function Navbar() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      const { data } = await supabase
        .from('courses')
        .select('id, title, slug, description, language')
        .order('title');
      setCourses(data || []);
    }
    loadCourses();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-[#E0E0E0] bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      {/* LEFT SIDE: Brand & Links */}
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#005F73] rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-md group-hover:shadow-lg transition-all">
            CA
          </div>
          <span className="text-xl font-bold text-[#292940]">
            CodeAcademy
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#292940]">
          {/* Courses Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCoursesOpen(true)}
            onMouseLeave={() => setIsCoursesOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-[#005F73] transition-colors font-medium">
              Courses
              <ChevronDown className={`w-4 h-4 transition-transform ${isCoursesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCoursesOpen && courses.length > 0 && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-lg shadow-xl py-3 z-[200] overflow-hidden border border-[#E0E0E0]">
                <div className="max-h-[400px] overflow-y-auto">
                  {courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="block px-5 py-4 hover:bg-[#F9F9F9] transition-colors border-b border-[#E0E0E0] last:border-b-0"
                      onClick={() => setIsCoursesOpen(false)}
                    >
                      <div className="font-semibold text-[#292940]">{course.title}</div>
                      {course.language && (
                        <div className="text-xs text-[#666666] mt-1 font-medium">{course.language}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Link href="/practice" className="hover:text-[#005F73] transition-colors font-medium">Practice</Link>
          <Link href="/pricing" className="hover:text-[#005F73] transition-colors font-medium">Pricing</Link>
        </div>
      </div>

      {/* RIGHT SIDE: Auth State */}
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="w-24 h-9 bg-[#F9F9F9] animate-pulse rounded-lg" />
        ) : !user ? (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-[#292940] hover:text-[#005F73] transition-colors px-5 py-2 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#FF6700] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#E55A00] transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-[#666666]">Welcome back</span>
              <span className="text-sm font-medium text-[#292940]">{user.email?.split('@')[0]}</span>
            </div>

            <div className="w-10 h-10 bg-[#005F73] rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-md">
              {user.email?.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-[#666666] hover:text-[#FF6700] transition-colors px-4 py-2 rounded-lg hover:bg-[#F9F9F9]"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
