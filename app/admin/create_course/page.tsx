
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Save, Plus, Trash2, ArrowLeft, Loader2, BookOpen } from 'lucide-react';

export default function NewCoursePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // 1. Initial Empty State
    const [course, setCourse] = useState({
        title: '',
        slug: '',
        description: '',
        language: 'python',
        image_url: ''
    });

    const [chapters, setChapters] = useState([
        {
            title: 'Chapter 1',
            order_index: 1,
            lessons: [
                { title: 'Introduction', slug: 'intro', order_index: 1, instructions_markdown: '', is_free: true, initial_code: '', solution_code: '', expected_output: '', explanation: '' }
            ]
        }
    ]);

    // --- Helper Functions ---
    const addChapter = () => {
        setChapters([...chapters, {
            title: `Chapter ${chapters.length + 1}`,
            order_index: chapters.length + 1,
            lessons: []
        }]);
    };

    const addLesson = (chIdx: number) => {
        const updated = [...chapters];
        updated[chIdx].lessons.push({
           title: 'New Lesson',
        slug: 'new-lesson-' + Date.now(),
        order_index: updated[chIdx].lessons.length + 1,
        instructions_markdown: '',
        initial_code: '',     // Added
        solution_code: '',   // Added
        expected_output: '', // Added
        explanation: '',     // Added
        is_free: false
        });
        setChapters(updated);
    };

    // --- THE CREATION FLOW ---
    const handleCreate = async () => {
        if (!course.title || !course.slug) return alert("Please fill in the title and slug!");

        setLoading(true);
        try {
            // STEP 1: Insert the Course
            const { data: newCourse, error: cErr } = await supabase
                .from('courses')
                .insert([course])
                .select()
                .single();

            if (cErr) throw cErr;

            // STEP 2: Loop through Chapters
            for (const chapter of chapters) {
                const { data: newChapter, error: chErr } = await supabase
                    .from('chapters')
                    .insert([{
                        course_id: newCourse.id,
                        title: chapter.title,
                        order_index: chapter.order_index
                    }])
                    .select()
                    .single();

                if (chErr) throw chErr;

                // STEP 3: Insert Lessons for this Chapter
                if (chapter.lessons.length > 0) {
                    const lessonsToInsert = chapter.lessons.map(l => ({
                        ...l,
                        chapter_id: newChapter.id
                    }));

                    const { error: lErr } = await supabase.from('lessons').insert(lessonsToInsert);
                    if (lErr) throw lErr;
                }
            }

            alert("🎉 Course Created and Published!");
            router.push('/admin/manage');
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8 pb-32">
            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-10">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft size={18} /> Back to Archive
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/30 hover:from-primary/90 hover:to-accent/90"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {loading ? 'PUBLISHING...' : 'PUBLISH COURSE'}
                    </button>
                </div>

                {/* COURSE FORM */}
                <div className="bg-card border border-border rounded-3xl p-8 mb-8 shadow-lg shadow-black/10">
                    <div className="flex items-center gap-2 mb-6 text-primary">
                        <BookOpen size={18} />
                        <h2 className="font-bold text-xs uppercase tracking-[0.2em]">Course Metadata</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            placeholder="Course Title (e.g. Advanced Python)"
                            className="bg-input border border-border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground"
                            onChange={e => setCourse({ ...course, title: e.target.value })}
                        />
                        <input
                            placeholder="Slug (e.g. advanced-python)"
                            className="bg-input border border-border p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-foreground"
                            onChange={e => setCourse({ ...course, slug: e.target.value })}
                        />
                    </div>
                </div>

                {/* CHAPTER BUILDER */}
                <div className="space-y-6">
                    {chapters.map((chapter, chIdx) => (
                        <div key={chIdx} className="bg-card border border-border rounded-3xl overflow-hidden shadow-md shadow-black/10">
                            <div className="p-5 bg-muted/30 border-b border-border flex justify-between items-center">
                                <input
                                    className="bg-transparent font-bold text-lg outline-none focus:text-primary text-foreground"
                                    value={chapter.title}
                                    onChange={e => {
                                        const updated = [...chapters];
                                        updated[chIdx].title = e.target.value;
                                        setChapters(updated);
                                    }}
                                />
                            </div>

                            <div className="p-6 space-y-4">
                                {chapter.lessons.map((lesson, lsIdx) => (
                                
                                  <div key={lsIdx} className="bg-card/60 border border-border/60 rounded-2xl p-6 space-y-4">
    {/* 1. Header Row: Title and Slug */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Lesson Title</label>
            <input
                placeholder="e.g. Variables in Python"
                className="w-full bg-input border border-border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                value={lesson.title}
                onChange={e => {
                    const updated = [...chapters];
                    updated[chIdx].lessons[lsIdx].title = e.target.value;
                    setChapters(updated);
                }}
            />
        </div>
        <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Lesson Slug</label>
            <input
                placeholder="variables-python"
                className="w-full bg-input border border-border p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary text-foreground"
                value={lesson.slug}
                onChange={e => {
                    const updated = [...chapters];
                    updated[chIdx].lessons[lsIdx].slug = e.target.value;
                    setChapters(updated);
                }}
            />
        </div>
    </div>

    {/* 2. Markdown Instructions */}
    <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Instructions (Markdown)</label>
        <textarea
            placeholder="Explain the lesson here..."
            className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-xs font-mono h-28 outline-none focus:border-blue-1500"
            value={lesson.instructions_markdown}
            onChange={e => {
                const updated = [...chapters];
                updated[chIdx].lessons[lsIdx].instructions_markdown = e.target.value;
                setChapters(updated);
            }}
        />
    </div>

    {/* 3. Code Section (Grid) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
            <label className="text-[10px] text-blue-500/70 uppercase font-bold tracking-wider">Initial Code (What user sees)</label>
            <textarea
                className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs font-mono h-40 outline-none focus:border-blue-500"
                value={lesson.initial_code}
                onChange={e => {
                    const updated = [...chapters];
                    updated[chIdx].lessons[lsIdx].initial_code = e.target.value;
                    setChapters(updated);
                }}
            />
        </div>
        <div className="space-y-1">
            <label className="text-[10px] text-green-500/70 uppercase font-bold tracking-wider">Solution Code</label>
            <textarea
                className="w-full bg-black border border-white/10 p-3 rounded-xl text-xs font-mono h-40 outline-none focus:border-green-500"
                value={lesson.solution_code}
                onChange={e => {
                    const updated = [...chapters];
                    updated[chIdx].lessons[lsIdx].solution_code = e.target.value;
                    setChapters(updated);
                }}
            />
        </div>
    </div>

    {/* 4. Validation & Explanation */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Expected Output</label>
            <input
                placeholder="e.g. Hello World"
                className="w-full bg-zinc-900 border border-white/10 p-2.5 rounded-lg text-sm outline-none focus:border-blue-500"
                value={lesson.expected_output}
                onChange={e => {
                    const updated = [...chapters];
                    updated[chIdx].lessons[lsIdx].expected_output = e.target.value;
                    setChapters(updated);
                }}
            />
        </div>
        <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer group">
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/10 bg-zinc-900 checked:bg-blue-500"
                    checked={lesson.is_free}
                    onChange={e => {
                        const updated = [...chapters];
                        updated[chIdx].lessons[lsIdx].is_free = e.target.checked;
                        setChapters(updated);
                    }}
                />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Free Lesson</span>
            </label>
        </div>
    </div>

    <div className="space-y-1">
        <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Explanation (Shown after completion)</label>
        <textarea
            placeholder="Why does this solution work?"
            className="w-full bg-zinc-900 border border-white/10 p-3 rounded-xl text-sm h-20 outline-none focus:border-blue-500"
            value={lesson.explanation}
            onChange={e => {
                const updated = [...chapters];
                updated[chIdx].lessons[lsIdx].explanation = e.target.value;
                setChapters(updated);
            }}
        />
    </div>
</div>
                                ))}

                                <button
                                    onClick={() => addLesson(chIdx)}
                                    className="w-full py-3 border-2 border-dashed border-white/10 rounded-2xl text-zinc-500 hover:text-blue-400 hover:border-blue-500/50 transition-all text-xs font-bold"
                                >
                                    + ADD LESSON
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addChapter}
                        className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-zinc-400 font-bold hover:bg-white/10 transition-all"
                    >
                        + NEW CHAPTER
                    </button>
                </div>
            </div>
        </div>
    );
}