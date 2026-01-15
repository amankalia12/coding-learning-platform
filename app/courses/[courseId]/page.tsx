"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId;

  // Local State
  const [user, setUser] = useState<any>(null);
  const [isPro, setIsPro] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Collapsible State (Track expanded chapter IDs)
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleChapter = (id: string) => {
    const newSet = new Set(expandedChapters);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedChapters(newSet);
  };

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("is_pro")
          .eq("id", user.id)
          .single();
        if (profile) {
          console.log("Profile found:", profile);
          setIsPro(profile.is_pro || false);
        } else {
          console.log("No profile found, defaulting to FREE");
          setIsPro(false);
        }
      }

      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", courseId)
        .single();
      setCourse(courseData);

      if (courseData) {
        const { data: chapterData } = await supabase
          .from("chapters")
          .select("*, lessons(*)")
          .eq("course_id", courseData.id)
          .order("order_index", { ascending: true });

        setChapters(chapterData || []);
        if (chapterData && chapterData.length > 0) {
          setExpandedChapters(new Set([chapterData[0].id]));
        }
      }

      setLoading(false);
    }

    loadData();
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-primary text-xl font-black animate-pulse">Loading Mission Data...</div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
      <h1 className="text-2xl font-bold">Course not found.</h1>
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-accent selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative px-6 py-12 border-b border-[#432C7A]">
        <div className="absolute inset-0 bg-[url('/images/pixel-map.png')] bg-cover opacity-20" />
        <div className="absolute inset-0 bg-[#1A0B2E]/90" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
              {course.title}
            </h1>
            <p className="text-muted-foreground max-w-xl">
              {course.description}
            </p>
          </div>
          <button className="bg-[#FFA600] text-black px-8 py-3 rounded-xl font-black uppercase tracking-wide hover:scale-105 transition-transform shadow-[4px_4px_0_#996600]">
            Start Learning
          </button>
        </div>
      </section>

      {/* TREE & BRANCH LAYOUT */}
      <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
        <div className="relative border-l-2 border-[#432C7A] ml-6 md:ml-10 space-y-12">

          {chapters.map((chapter, index) => {
            const isExpanded = expandedChapters.has(chapter.id);

            return (
              <div key={chapter.id} className="relative pl-8 md:pl-12">
                {/* Dot on the main timeline */}
                <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-[#1A0B2E] border-2 border-[#7000FF]" />

                {/* CHAPTER CARD */}
                <div className="bg-[#0b1020] border border-[#2D1B4E] rounded-2xl overflow-hidden transition-all duration-300">

                  {/* Header (Click to toggle) */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-[#161e3d] transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-xl font-bold text-white bg-[#1A0B2E]">
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <h2 className="text-xl font-bold text-white">{chapter.title}</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                          {chapter.lessons?.length || 0} Missions
                        </p>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-6 h-6 text-white" />
                    </div>
                  </button>

                  {/* Body (Lessons) - Collapsible */}
                  {isExpanded && (
                    <div className="border-t border-[#2D1B4E] bg-[#0a0f1d] p-6 pt-2">
                      <div className="relative space-y-1">
                        {/* The "Branch" Line */}
                        <div className="absolute left-[22px] top-0 bottom-6 w-0.5 bg-[#2D1B4E]" />

                        {chapter.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, lIndex: number) => {
                          const canAccess = lesson.is_free || isPro;
                          let destination = `/lessons/${lesson.slug}`;
                          if (!lesson.is_free && !user) destination = "/login";
                          else if (!lesson.is_free && user && !isPro) destination = "/pricing";

                          return (
                            <div key={lesson.id} className="relative flex items-center justify-between py-4 pl-12 pr-4 group hover:bg-[#161e3d] rounded-lg transition-colors">
                              {/* Branch Connector */}
                              <div className="absolute left-[22px] top-1/2 w-4 h-0.5 bg-[#2D1B4E]" />
                              <div className="absolute left-[20px] top-1/2 -mt-[3px] w-1.5 h-1.5 rounded-full bg-[#7000FF]" />

                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                                  {lesson.title} {isPro ? '(PRO)' : ''} {!lesson.is_free ? '(PAID)' : '(FREE)'}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  Exercise {index + 1}.{lIndex + 1}
                                </span>
                              </div>


                              {lesson.is_free || canAccess ? (
                                <Link href={destination}>
                                  <button className="bg-[#00F0FF] hover:bg-[#00D0DF] text-black font-black text-xs px-6 py-2 rounded shadow-[0_3px_0_#0088AA] active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-wide">
                                    Start
                                  </button>
                                </Link>
                              ) : (
                                <Link href={destination}>
                                  <button className="bg-[#1A0B2E] border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-bold text-xs px-6 py-2 rounded cursor-pointer transition-colors flex items-center justify-center gap-2">
                                    <span>🔒</span> Locked
                                  </button>
                                </Link>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
