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
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative px-6 py-16 border-b border-border bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-left flex-1">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs tracking-wide w-fit mb-4">
              Course Overview
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
              {course.description}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                {chapters.length} Chapters
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                {chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0)} Lessons
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button className="primary-button px-8 py-4 text-lg font-semibold shadow-lg">
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* COURSE CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-12 pb-32">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Course Content</h2>
          <p className="text-muted-foreground">
            Progress through each chapter to master the fundamentals and advanced concepts.
          </p>
        </div>

        <div className="space-y-6">
          {chapters.map((chapter, index) => {
            const isExpanded = expandedChapters.has(chapter.id);

            return (
              <div key={chapter.id} className="professional-card rounded-xl overflow-hidden">
                {/* Chapter Header */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-foreground">{chapter.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {chapter.lessons?.length || 0} Lessons
                      </p>
                    </div>
                  </div>
                  <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="border-t border-border bg-muted/20">
                    <div className="p-6 space-y-3">
                      {chapter.lessons?.sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any, lIndex: number) => {
                        const canAccess = lesson.is_free || isPro;
                        let destination = `/lessons/${lesson.slug}`;
                        if (!lesson.is_free && !user) destination = "/login";
                        else if (!lesson.is_free && user && !isPro) destination = "/pricing";

                        return (
                          <div key={lesson.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                                {lIndex + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground text-sm">
                                  {lesson.title}
                                  {isPro && !lesson.is_free && (
                                    <span className="ml-2 px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full font-medium">PRO</span>
                                  )}
                                  {!lesson.is_free && !isPro && (
                                    <span className="ml-2 px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">PREMIUM</span>
                                  )}
                                  {lesson.is_free && (
                                    <span className="ml-2 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">FREE</span>
                                  )}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Exercise {index + 1}.{lIndex + 1}
                                </p>
                              </div>
                            </div>

                            {lesson.is_free || canAccess ? (
                              <Link href={destination}>
                                <button className="primary-button text-sm px-4 py-2 font-medium">
                                  Start
                                </button>
                              </Link>
                            ) : (
                              <Link href={destination}>
                                <button className="secondary-button text-sm px-4 py-2 font-medium flex items-center gap-2">
                                  <span>🔒</span>
                                  Locked
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
