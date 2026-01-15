'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Trash2, Edit3, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ManageCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        setLoading(true);

        // Try a simple count first
        const { data, error, status, statusText } = await supabase
            .from('courses')
            .select('*');

        console.log({
            status,
            statusText,
            dataReceived: data,
            errorMessage: error?.message
        });

        if (error) {
            alert(`Error ${status}: ${error.message}`);
        } else {
            setCourses(data || []);
        }
        setLoading(false);
    }
    async function deleteCourse(id: string) {
        if (!confirm("Delete this course and all its lessons?")) return;
        await supabase.from('courses').delete().eq('id', id);
        fetchCourses();
    }

    if (loading) return <div className="p-10 animate-pulse text-muted-foreground">Loading Archive...</div>;

    return (
        <div className="p-10 min-h-screen bg-background text-foreground">
            <header className="mb-10">
                <h1 className="text-3xl font-bold">Course Management</h1>
                <p className="text-muted-foreground">You have {courses.length} active courses in the database.</p>
            </header>

            <div className="grid gap-4">
                {courses.map((course) => (
                    <div key={course.id} className="bg-card border border-border p-6 rounded-2xl flex justify-between items-center group shadow-md shadow-black/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary border border-border flex items-center justify-center font-bold uppercase">
                                {course.language.substring(0, 2)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{course.title}</h3>
                                <p className="text-sm text-muted-foreground">{course.slug}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link href={`/lessons/${course.slug}`} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink size={20} />
                            </Link>
                            <button onClick={() => deleteCourse(course.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <Link
                            href={`/admin/edit/${course.id}`}
                            className="p-2 text-muted-foreground hover:text-primary"
                        >
                            <Edit3 size={20} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}