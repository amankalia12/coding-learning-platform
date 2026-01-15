// app/lessons/[lessonId]/page.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';

// type LessonRow = {
//   id: string;
//   slug: string;
//   title: string;
//   instructions_markdown: string;
//   initial_code: string;
// };

// interface LessonPageProps {
//   params: {
//     lessonId: string;
//   };
// }

// export default function LessonPage({ params }: LessonPageProps) {
//   const { lessonId } = params;

//   const [lesson, setLesson] = useState<LessonRow | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [code, setCode] = useState('');
//   const [output, setOutput] = useState('');
//   const [running, setRunning] = useState(false);

//   // 1️⃣ Load lesson from Supabase
//   useEffect(() => {
//     async function loadLesson() {
//       setLoading(true);

//       const { data, error } = await supabase
//         .from('lessons')
//         .select('id, slug, title, instructions_markdown, initial_code')
//         .eq('slug', lessonId)
//         .single();

//       if (error) {
//         setError(error.message);
//         setLesson(null);
//       } else {
//         setLesson(data);
//         setCode(data.initial_code ?? '');
//       }

//       setLoading(false);
//     }

//     loadLesson();
//   }, [lessonId]);

//   // 2️⃣ Run code
//   async function handleRun() {
//     if (!lesson) return;

//     if (!code.trim()) {
//       setOutput('Code is empty.');
//       return;
//     }

//     setRunning(true);
//     setOutput('Running...');

//     try {
//       const res = await fetch('/api/run-code', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           lessonId: lesson.id, // ✅ REAL lesson ID
//           code,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setOutput(`Error: ${data.error ?? 'Unknown error'}`);
//       } else if (data.stderr) {
//         setOutput(data.stderr);
//       } else {
//         setOutput(data.stdout || '(no output)');
//       }
//     } catch (e: any) {
//       setOutput(`Request failed: ${e.message}`);
//     } finally {
//       setRunning(false);
//     }
//   }

//   // 3️⃣ UI states
//   if (loading) return <div className="p-8">Loading lesson…</div>;
//   if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
//   if (!lesson) return <div className="p-8">Lesson not found.</div>;

//   return (
//     <main className="min-h-screen bg-slate-100 p-4 md:p-6">
//       <h1 className="mb-4 text-2xl font-bold">{lesson.title}</h1>

//       <div className="grid gap-4 md:grid-cols-3">
//         {/* Instructions panel */}
//         <section className="md:col-span-1 max-h-[80vh] overflow-y-auto rounded-lg bg-white p-4 shadow">
//           <h2 className="mb-2 text-lg font-semibold">Instructions</h2>
//           <pre className="whitespace-pre-wrap text-sm text-slate-800">
//             {lesson.instructions_markdown}
//           </pre>
//         </section>

//         {/* Editor + Output */}
//         <section className="md:col-span-2 flex flex-col gap-4">
//           {/* Code editor */}
//           <div className="rounded-lg bg-white p-4 shadow">
//             <h2 className="mb-2 text-lg font-semibold">Code</h2>
//             <textarea
//               className="h-64 w-full rounded border bg-slate-900 p-2 font-mono text-sm text-slate-50"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//             <button
//               onClick={handleRun}
//               disabled={running}
//               className="mt-3 rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
//             >
//               {running ? 'Running…' : 'Run Code'}
//             </button>
//           </div>

//           {/* Output window */}
//           <div className="rounded-lg bg-black p-4 font-mono text-sm text-green-400">
//             <div className="mb-2 font-semibold text-slate-100">Output</div>
//             <pre className="whitespace-pre-wrap">{output}</pre>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { use } from 'react';
// import { NextResponse } from 'next/server';
// interface LessonParamsPromise {
//   params: Promise<{ lessonId: string }>;
// }

// type LessonRow = {
//   id: string;
//   slug: string;
//   title: string;
//   instructions_markdown: string;
//   initial_code: string;
//   solution_code: string | null;

// };

// export default function LessonPage({ params }: LessonParamsPromise) {
//   // yahan koi Promise / use(params) nahi
//  const { lessonId } = use(params);

//   const [lesson, setLesson] = useState<LessonRow | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [code, setCode] = useState('');      // editor ka code
//   const [output, setOutput] = useState('');  // output window
//   const [running, setRunning] = useState(false);

//   // 1) Lesson data Supabase se lao
//   useEffect(() => {
//     async function loadLesson() {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('lessons')
//         .select('id, slug, title, instructions_markdown, initial_code')
//         .eq('slug', lessonId)
//         .maybeSingle();

//       if (error) {
//         setError(error.message);
//         setLesson(null);
//         setLoading(false);
//         return;
//       }

//       if (data) {
//         setLesson(data as LessonRow);
//         setCode((data as LessonRow).initial_code ?? '');
//       } else {
//         setLesson(null);
//       }

//       setLoading(false);
//     }

//     loadLesson();
//   }, [lessonId]);

//   // 2) Run button handler
//   async function handleRun() {
//     if (!code.trim()) {
//       setOutput('Code is empty.');
//       return;
//     }

//     setRunning(true);
//     setOutput('Running...');

//     try {
//       const res = await fetch('/api/run-code', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//            lessonId: lesson?.id, // abhi ke liye hard-coded; future me lesson.language
//           code,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setOutput(`Error: ${data.error ?? 'Unknown error'}`);
//       } else if (data.stderr) {
//         setOutput(data.stderr);
//       } else {
//         setOutput(data.stdout || '(no output)');
//       }
//     } catch (e: any) {
//       setOutput(`Request failed: ${e.message}`);
//       return NextResponse.json({error:e.message??'Execution failed'},{status:500});
      
//     } finally {
//       setRunning(false);
//     }
//   }

//   if (loading) return <div className="p-8">Loading lesson…</div>;
//   if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
//   if (!lesson) return <div className="p-8">Lesson not found.</div>;

//   return (
//     <main className="min-h-screen bg-slate-100 p-4 md:p-6">
//       <h1 className="mb-4 text-2xl font-bold">{lesson.title}</h1>

//       <div className="grid gap-4 md:grid-cols-3">
//         {/* Instructions panel */}
//         <section className="md:col-span-1 max-h-[80vh] overflow-y-auto rounded-lg bg-white p-4 shadow">
//           <h2 className="mb-2 text-lg font-semibold">Instructions</h2>
//           <pre className="whitespace-pre-wrap text-sm text-slate-800">
//             {lesson.instructions_markdown}
//           </pre>
//         </section>

//         {/* Editor + Output */}
//         <section className="md:col-span-2 flex flex-col gap-4">
//           {/* Code editor */}
//           <div className="rounded-lg bg-white p-4 shadow">
//             <h2 className="mb-2 text-lg font-semibold">Code</h2>
//             <textarea
//               className="h-64 w-full rounded border bg-slate-900 p-2 font-mono text-sm text-slate-50"
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//             />
//             <button
//               onClick={handleRun}
//               disabled={running}
//               className="mt-3 rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
//             >
//               {running ? 'Running…' : 'Run Code'}
//             </button>
//           </div>

//           {/* Output window */}
//           <div className="rounded-lg bg-black p-4 font-mono text-sm text-green-400">
//             <div className="mb-2 font-semibold text-slate-100">Output</div>
//             <pre className="whitespace-pre-wrap">{output}</pre>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

import LessonClient from '@/components/lesson/LessonClient';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  // ✅ UNWRAP params here (server-side)
  const { lessonId } = await params;

  return <LessonClient lessonId={lessonId} />;
}
