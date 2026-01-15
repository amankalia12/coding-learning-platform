'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Save, Trash2, Plus, ArrowLeft, Loader2, GripVertical } from 'lucide-react';

export default function FullCourseEditor() {
    const { id: courseId } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // THE MASTER STATE: Holds everything in one tree
    const [course, setCourse] = useState<any>(null);
    const [chapters, setChapters] = useState<any[]>([]);

    // --- 1. THE FETCH FLOW (RECURSIVE SELECT) ---
    useEffect(() => {
        async function loadData() {
            // Fetch course + chapters + lessons in ONE call
            const { data, error } = await supabase
                .from('courses')
                .select(`
          *,
          chapters (
            *,
            lessons (*)
          )
        `)
                .eq('id', courseId)
                .single();

            if (error) {
                console.error("Fetch error:", error);
                return;
            }

            // Sort chapters and lessons by order_index
            const sortedChapters = data.chapters.sort((a: any, b: any) => a.order_index - b.order_index);
            sortedChapters.forEach((ch: any) => {
                ch.lessons.sort((a: any, b: any) => a.order_index - b.order_index);
            });

            setCourse(data);
            setChapters(sortedChapters);
            setLoading(false);
        }
        loadData();
    }, [courseId]);

    // --- 2. UPDATE LOGIC (LOCAL STATE) ---
    const updateLesson = (chIdx: number, lsIdx: number, field: string, value: any) => {
        const updated = [...chapters];
        updated[chIdx].lessons[lsIdx][field] = value;
        setChapters(updated);
    };

    const addLesson = (chIdx: number) => {
        const updated = [...chapters];
        updated[chIdx].lessons.push({
            title: 'New Lesson',
            order_index: updated[chIdx].lessons.length + 1,
            instructions_markdown: '',
            is_free: false
        });
        setChapters(updated);
    };
    const addChapter = () => {
        setChapters([...chapters, {
            id: crypto.randomUUID(),
            title: '',
            order_index: chapters.length + 1,
            lessons: []
        }]);
    };

    // --- 3. DELETE LOGIC (DATABASE + STATE) ---
    const deleteLesson = async (chIdx: number, lsIdx: number, lessonId?: string) => {
        if (lessonId) {
            if (!confirm("Delete this lesson from database?")) return;
            await supabase.from('lessons').delete().eq('id', lessonId);
        }
        const updated = [...chapters];
        updated[chIdx].lessons.splice(lsIdx, 1);
        setChapters(updated);
    };


    const deleteChapter = async (chIdx: number, chapterId?: string) => {
        if (chapterId) {
            if (!confirm("Delete entire chapter and its lessons?")) return;
            await supabase.from('chapters').delete().eq('id', chapterId);
        }
        setChapters(chapters.filter((_, i) => i !== chIdx));
    };
    // --- THE MASTER DELETE FLOW ---

    const deleteEntireCourse = async () => {
        if (!confirm("Delete everything?")) return;

        setSaving(true);
        try {
            // We use .select() here just to see what was deleted
            const { data, error, count } = await supabase
                .from('courses')
                .delete()
                .eq('id', courseId)
            // count: 'exact' tells us exactly how many rows were deleted
            const { error: delError, count: deletedCount } = await supabase
                .from('courses')
                .delete({ count: 'exact' })
                .eq('id', courseId);

            if (delError) throw delError;

            if (deletedCount === 0) {
                alert("No rows deleted. This is likely an RLS permission issue.");
            } else {
                alert(`Success! Deleted ${deletedCount} course.`);
                router.push('/admin/manage');
            }
        } catch (err: any) {
            console.error("Delete Error:", err);
            alert("Delete failed: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ''; // Shows the browser's "Are you sure?" dialog
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);
    // --- 4. THE MASTER SAVE FLOW (UPSERT) ---
    // const handleSync = async () => {
    //     setSaving(true);
    //     try {
    //         // A. Update Course Meta
    //         await supabase.from('courses').update({
    //             title: course.title,
    //             description: course.description,
    //             language: course.language
    //         }).eq('id', courseId);

    //         // B. Loop through Chapters
    //         for (const chapter of chapters) {
    //             const { data: savedChapter, error: chErr } = await supabase
    //                 .from('chapters')
    //                 .upsert({
    //                     id: chapter.id, // If present, updates. If absent, inserts.
    //                     course_id: courseId,
    //                     title: chapter.title,
    //                     order_index: chapter.order_index
    //                 })
    //                 .select().single();

    //             if (chErr) throw chErr;

    //             // C. Sync Lessons for this chapter
    //             if (chapter.lessons && chapter.lessons.length > 0) {
    //                 const lessonsToSync = chapter.lessons.map((l: any) => ({
    //                     ...l,
    //                     chapter_id: savedChapter.id // Link to parent chapter
    //                 }));

    //                 const { error: lsErr } = await supabase.from('lessons').upsert(lessonsToSync);
    //                 if (lsErr) throw lsErr;
    //             }
    //         }

    //         alert("Full Course Sync Complete! 🚀");
    //         router.refresh();
    //     } catch (err: any) {
    //         alert("Error: " + err.message);
    //     } finally {
    //         setSaving(false);
    //     }
    // };
    // const handleSync = async () => {
    //     setSaving(true);
    //     try {
    //         // A. Update Course Meta (Using upsert to ensure it matches the ID)
    //         const { error: courseErr } = await supabase.from('courses').upsert({
    //             id: courseId, // Ensure we are targeting the specific course
    //             title: course.title,
    //             description: course.description,
    //             language: course.language,
    //             slug: course.slug
    //         });
    //         if (courseErr) throw courseErr;

    //         // B. Loop through Chapters
    //         for (const chapter of chapters) {
    //             const chapterPayload: any = {
    //                 course_id: courseId,
    //                 title: chapter.title,
    //                 order_index: chapter.order_index
    //             };

    //             // Only include ID if it's a real UUID (not a temporary crypto.randomUUID)
    //             if (chapter.id && chapter.id.length > 20) {
    //                 chapterPayload.id = chapter.id;
    //             }

    //             const { data: savedChapter, error: chErr } = await supabase
    //                 .from('chapters')
    //                 .upsert(chapterPayload)
    //                 .select().single();

    //             if (chErr) throw chErr;

    //             // C. Sync Lessons
    //             if (chapter.lessons && chapter.lessons.length > 0) {
    //                 const lessonsToSync = chapter.lessons.map((l: any) => {
    //                     const lessonObj: any = {
    //                         chapter_id: savedChapter.id,
    //                         title: l.title,
    //                         slug: l.slug,
    //                         order_index: l.order_index,
    //                         instructions_markdown: l.instructions_markdown, // Fixed spelling
    //                         is_free: l.is_free
    //                     };
    //                     // Keep existing ID if it exists
    //                     if (l.id) lessonObj.id = l.id;
    //                     return lessonObj;
    //                 });

    //                 const { error: lsErr } = await supabase.from('lessons').upsert(lessonsToSync);
    //                 if (lsErr) throw lsErr;
    //             }
    //         }

    //         alert("Full Course Sync Complete! 🚀");
    //         router.refresh();
    //     } catch (err: any) {
    //         console.error("Sync Error:", err);
    //         alert("Error: " + err.message);
    //     } finally {
    //         setSaving(false);
    //     }
    // };
    const handleSync = async () => {
    setSaving(true);
    try {
        // A. Update Course Meta
        const { error: courseErr } = await supabase.from('courses').upsert({
            id: courseId,
            title: course.title,
            slug: course.slug,
            description: course.description,
            language: course.language,
            image_url: course.image_url // Added image_url
        });
        if (courseErr) throw courseErr;

        // B. Loop through Chapters
        for (const chapter of chapters) {
            const { data: savedChapter, error: chErr } = await supabase
                .from('chapters')
                .upsert({
                    id: chapter.id.length > 20 ? chapter.id : undefined, // Check if real UUID
                    course_id: courseId,
                    title: chapter.title,
                    order_index: chapter.order_index
                })
                .select().single();

            if (chErr) throw chErr;

            // C. Sync Lessons with ALL fields
            if (chapter.lessons && chapter.lessons.length > 0) {
                const lessonsToSync = chapter.lessons.map((l: any) => ({
                    id: l.id || undefined,
                    chapter_id: savedChapter.id,
                    title: l.title,
                    order_index: l.order_index,
                    slug: l.slug,
                    instructions_markdown: l.instructions_markdown,
                    initial_code: l.intial_code,     // Your specific field
                    solution_code: l.solution_code, // Your specific field
                    expected_output: l.expected_output, // Your specific field
                    explanation: l.explanation,     // Your specific field
                    is_free: l.is_free
                }));

                const { error: lsErr } = await supabase.from('lessons').upsert(lessonsToSync);
                if (lsErr) throw lsErr;
            }
        }
        alert("Full Course Sync Complete! 🚀");
        router.refresh();
    } catch (err: any) {
        alert("Error: " + err.message);
    } finally {
        setSaving(false);
    }
};
    if (loading) return <div className="h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="min-h-screen bg-background text-foreground p-8 pb-32">
            <div className="max-w-5xl mx-auto">

                {/* TOP NAV */}
                <div className="flex justify-between items-center mb-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={18} /> Back</button>
                    <button
                        onClick={handleSync}
                        disabled={saving}
                        className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/30 hover:from-primary/90 hover:to-accent/90"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {saving ? 'SYNCING...' : 'SYNC ALL CHANGES'}
                    </button>
                </div>

                {/* COURSE SECTION */}
                <div className="bg-card border border-border rounded-3xl p-8 mb-10 shadow-lg shadow-black/10">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Course Title</label>
                    <input
                        className="w-full bg-transparent text-4xl font-black outline-none border-b border-transparent focus:border-primary/60 py-2 mb-4"
                        value={course.title}
                        onChange={e => setCourse({ ...course, title: e.target.value })}
                    />
                </div>

                {/* CHAPTERS & LESSONS SECTION */}
                <div className="space-y-8">
                    {chapters.map((chapter, chIdx) => (
                        <div key={chapter.id || chIdx} className="bg-card border border-border rounded-3xl overflow-hidden shadow-md shadow-black/10">

                            {/* Chapter Header */}
                            <div className="p-6 bg-muted/30 flex items-center justify-between border-b border-border">
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="text-muted-foreground font-mono text-sm">CH {chIdx + 1}</span>
                                    <input
                                        className="bg-transparent text-xl font-bold outline-none focus:text-primary w-full"
                                        value={chapter.title}
                                        onChange={e => {
                                            const updated = [...chapters];
                                            updated[chIdx].title = e.target.value;
                                            setChapters(updated);
                                        }}
                                    />
                                </div>
                                <button onClick={() => deleteChapter(chIdx, chapter.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={18} /></button>
                            </div>

                            {/* LESSONS LIST (THE NESTED MAP) */}
                            <div className="p-6 space-y-4 bg-muted/20">
                                {chapter.lessons?.map((lesson: any, lsIdx: number) => (
                                    <div key={lesson.id || lsIdx} className="bg-card/70 border border-border/60 rounded-2xl p-6 relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="grid grid-cols-2 gap-4 flex-1 mr-10">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-muted-foreground uppercase font-bold">Lesson Title</label>
                                                    <input
                                                        className="w-full bg-input border border-border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                                                        value={lesson.title}
                                                        onChange={e => updateLesson(chIdx, lsIdx, 'title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] text-muted-foreground uppercase font-bold">Slug</label>
                                                    <input
                                                        className="w-full bg-input border border-border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                                                        value={lesson.slug}
                                                        onChange={e => updateLesson(chIdx, lsIdx, 'slug', e.target.value)}
                                                    />
                                                </div>
                                                {/* Technical Fields for Coding Lessons */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Initial Code</label>
        <textarea
            className="w-full bg-black/40 border border-white/5 p-2 rounded-lg text-xs font-mono h-32 outline-none focus:border-blue-500/50"
            value={lesson.initial_code}
            onChange={e => updateLesson(chIdx, lsIdx, 'intial_code', e.target.value)}
        />
    </div>
    <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Solution Code</label>
        <textarea
            className="w-full bg-black/40 border border-white/5 p-2 rounded-lg text-xs font-mono h-32 outline-none focus:border-blue-500/50"
            value={lesson.solution_code}
            onChange={e => updateLesson(chIdx, lsIdx, 'solution_code', e.target.value)}
        />
    </div>
</div>

<div className="mt-4 space-y-4">
    <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Expected Output</label>
        <input
            className="w-full bg-black/40 border border-white/5 p-2 rounded-lg text-sm outline-none focus:border-blue-500/50"
            value={lesson.expected_output}
            onChange={e => updateLesson(chIdx, lsIdx, 'expected_output', e.target.value)}
        />
    </div>
    <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Explanation</label>
        <textarea
            className="w-full bg-black/40 border border-white/5 p-2 rounded-lg text-sm h-20 outline-none focus:border-blue-500/50"
            value={lesson.explanation}
            onChange={e => updateLesson(chIdx, lsIdx, 'explanation', e.target.value)}
        />
    </div>
       <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold">Instructionn</label>
        <textarea
            className="w-full bg-black/40 border border-white/5 p-3 rounded-xl text-sm font-mono h-24 mb-4 mt-1 outline-none focus:border-blue-500/50"
            value={lesson.instructions_markdown}
            onChange={e => updateLesson(chIdx, lsIdx, 'instructions_markdown', e.target.value)}
        />
    </div>
</div>
    </div>
     <button onClick={() => deleteLesson(chIdx, lsIdx, lesson.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <label className="text-[10px] text-zinc-500 uppercase font-bold">Instructions (Markdown)</label>
                                        {/* <textarea
                                            className="w-full bg-black/40 border border-white/5 p-3 rounded-xl text-sm font-mono h-24 mb-4 mt-1 outline-none focus:border-blue-500/50"
                                            value={lesson.instructions_markdown}
                                            onChange={e => updateLesson(chIdx, lsIdx, 'instruction_markdown', e.target.value)}
                                        /> */}
                                    </div>
                                ))}

                                <button
                                    onClick={() => addLesson(chIdx)}
                                    className="w-full py-3 border-2 border-dashed border-white/5 rounded-2xl text-zinc-600 hover:text-blue-500 hover:border-blue-500/50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> ADD LESSON TO {chapter.title || 'CHAPTER'}
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addChapter}
                        className="w-full py-5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-3xl font-black tracking-widest hover:bg-blue-600/20 transition-all"
                    >
                        + ADD NEW CHAPTER
                    </button>

                </div>
            </div>
            {/* ... inside your return JSX ... */}

            <div className="max-w-5xl mx-auto mt-20 pt-10 border-t border-red-900/30">
                <div className="bg-red-900/10 border border-red-900/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
                            <Trash2 size={20} /> Danger Zone
                        </h3>
                        <p className="text-zinc-500 text-sm mt-1">
                            Once you delete a course, there is no going back. Please be certain.
                        </p>
                    </div>
                    <button
                        onClick={deleteEntireCourse}
                        className="bg-red-600 hover:bg-red-500 px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
                    >
                        DELETE THIS COURSE
                    </button>
                </div>
            </div>
        </div>
    );
}