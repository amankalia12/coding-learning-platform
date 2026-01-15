

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import Editor from '@monaco-editor/react';
import { useAuth } from '@/components/auth/AuthProvider';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import {BookOpen, Clock, ChevronRight} from 'lucide-react';

import {
  isLessonCompleted,
  markLessonCompleted,
} from '@/lib/progress';
import ReactMarkdown from 'react-markdown';
// Some versions use this specifically
//import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from 'react-resizable-panels';
type Lesson = {
  id: string;
  slug: string;
  title: string;
  chapter_id: string;
  order_index: number;
  instructions_markdown: string | null;
  initial_code: string | null;
  expected_output: string | null;
  explanation: string | null;
};

type LessonNav = {
  id: string;
  slug: string;
  title: string;
  order_index: number;
};

export default function LessonClient({
  lessonId,
}: {
  lessonId: string;
}) {

  /* =======================
     STATE
     ======================= */
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<LessonNav[]>([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  /* =======================
     LOAD LESSON + NAV
     ======================= */
  useEffect(() => {

    async function loadLesson() {

      setLoading(true);

      // 1️⃣ Current lesson
      const { data: current } = await supabase
        .from('lessons')
        .select(
          'id, slug, title, chapter_id, order_index, instructions_markdown, initial_code,expected_output,explanation'
        )
        .eq('slug', lessonId)
        .maybeSingle();



      if (!current) {
        console.warn('Lesson not found for slug:', lessonId);
        setLoading(false);
        setLesson(null);
        return;
      }
      setLesson(current);
      setCode(current.initial_code ?? '');
      setLoading(false);


      if (user) {

        const completed = await isLessonCompleted(user.id, current.id);
        setCompleted(completed);
      }
      // 2️⃣ All lessons in chapter
      const { data: chapterLessons } = await supabase
        .from('lessons')
        .select('id, slug, title, order_index')
        .eq('chapter_id', current.chapter_id)
        .order('order_index', { ascending: true });

      setLessons(chapterLessons ?? []);
      setLoading(false);
    }

    loadLesson();
  }, [lessonId]);

  /* =======================
     RUN CODE
     ======================= */
  async function handleRun() {
    if (!lesson) return;

    setRunning(true);
    setOutput('Running...');

    try {
      const res = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`Error: ${data.error ?? 'Unknown error'}`);
      } else if (data.stderr) {
        setOutput(data.stderr);
      } else {
        setOutput(data.stdout || '(no output)');
      }
    } catch (err: any) {
      setOutput(`Request failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  }

  /* =======================
     BACK / NEXT
     ======================= */
  const index = lessons.findIndex((l) => l.id === lesson?.id);
  const prevLesson = index > 0 ? lessons[index - 1] : null;
  const nextLesson =
    index >= 0 && index < lessons.length - 1
      ? lessons[index + 1]
      : null;

  /* =======================
     RENDER
     ======================= */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse text-xl font-bold">Initializing Deep Space Link...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <div className="text-xl font-bold text-destructive">Lesson not found or access denied.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* 1. TOP NAVBAR */}
      <nav className="h-14 border-b border-border bg-white shadow-sm flex items-center justify-between px-6 shrink-0 z-10 relative">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-primary group-hover:text-primary/80 transition-all">
              CodeAcademy
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3 text-xs md:text-sm font-mono text-muted-foreground">
            <span>Module</span>
            <span className="text-border">/</span>
            <span className="text-foreground">{lesson.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary">⚡</span>
            <span className="text-xs font-bold text-primary">100 XP</span>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CONTENT AREA (Resizable Panels) */}
      <main className="flex-1 flex overflow-hidden relative">
        <PanelGroup orientation="horizontal" className="h-full w-full">
       
          <Panel defaultSize={40} minSize={20}>
            <section className="h-full flex flex-col bg-card border-r border-border">
              {/* Status Header */}
              <div className="px-6 py-3 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Lesson Instructions</span>
                </div>
                {/* Dynamic Access Badge */}

              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                <h1 className="text-3xl font-bold mb-2 text-foreground tracking-tight leading-none">
                  {lesson.title}
                </h1>

                {/* Main Instructions */}
                <div className="prose prose-stone max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-code:text-primary prose-pre:bg-muted prose-pre:border prose-pre:border-border">
             <ReactMarkdown
  rehypePlugins={[rehypeHighlight]}
  components={{
    code(props) {
      const { children, className, node, ...rest } = props;
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      return match ? (
        <div className="relative group mt-6 mb-4">
          {/* Language Label */}
          <span className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded border border-border uppercase font-bold tracking-tighter z-10">
            {language}
          </span>
          {/* Code Block */}
          <pre className="overflow-x-auto rounded-xl border border-border bg-muted p-4">
            <code className={className} {...rest}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        // This renders simple `inline code`
        <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary font-mono text-sm" {...rest}>
          {children}
        </code>
      );
    },
  }}
>
  {lesson.instructions_markdown}
</ReactMarkdown>
                </div>

                {/* 💡 The Explanation (Hidden until completed) */}
                {/* {completed && lesson.explanation && (
                  <div className="mt-8 p-6 rounded-xl bg-blue-500/5 border border-blue-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-3 text-blue-400 font-bold text-sm uppercase tracking-wider">
                      <span>✨ System Intel</span>
                    </div>
                    <p className="text-sm text-blue-100/80 leading-relaxed italic">
                      {lesson.explanation}
                    </p>
                  </div>
                )} */}
              </div>

              {/* Simple Footer inside Panel for Task Target */}
              <div className="px-6 py-4 border-t border-white/5 bg-black/20">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Expected Output</span>
                  <code className="text-xs text-green-400 font-mono bg-black/40 px-2 py-1 rounded border border-green-500/20 w-fit">
                    {lesson.expected_output}
                  </code>
                </div>
              </div>
            </section>
          </Panel>

          <PanelResizeHandle className="w-1 bg-white/5 hover:bg-blue-500/50 transition-colors cursor-col-resize" />

          {/* COLUMN 2: Code & Output (Stacked) */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup orientation="vertical" className="h-full w-full">

              {/* TOP: Editor Area */}
              <Panel defaultSize={70} minSize={40}>
                <div className="h-full flex flex-col relative bg-card">
                  {/* Editor Header */}
                  <div className="flex items-center justify-between bg-muted border-b border-border shrink-0 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">📝</span>
                      <span className="text-xs font-bold text-foreground">query.sql</span>
                    </div>

                    <button
                      onClick={handleRun}
                      disabled={running}
                      className={`
                                px-3 py-1 rounded text-xs font-bold tracking-wide shadow-lg transition-all flex items-center gap-2
                                ${running
                          ? 'bg-muted text-muted-foreground cursor-wait'
                          : 'bg-accent hover:bg-accent/90 text-accent-foreground active:scale-95 shadow-accent/20'
                        }
                                `}
                    >
                      <span>{running ? '...' : 'RUN'}</span>
                      {!running && <span className="text-sm">▶</span>}
                    </button>
                  </div>

                  {/* Monaco Editor */}
                  <div className="flex-1 relative bg-background">
                    <Editor
                      height="100%"
                      theme="vs"
                      language="sql"
                      value={code}
                      onChange={(v) => setCode(v ?? '')}
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        lineHeight: 24,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        renderLineHighlight: 'gutter',
                      }}
                    />
                  </div>


                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-border hover:bg-primary/50 transition-colors cursor-row-resize" />

              {/* BOTTOM: Output Area */}
              <Panel defaultSize={30} minSize={10}>
                <div className="h-full bg-muted flex flex-col">
                  <div className="px-4 py-2 border-b border-border text-[10px] font-bold text-muted-foreground uppercase bg-muted flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                      <span>Terminal Output</span>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 font-mono text-sm bg-black/40">
                    {output ? (
                      <div className="text-blue-100/90 whitespace-pre-wrap">
                        {output}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                        <div className="text-2xl mb-2 grayscale">🖥️</div>
                        <p className="max-w-[200px] text-xs leading-relaxed text-muted-foreground">Waiting for output stream...</p>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

            </PanelGroup>
          </Panel>
        </PanelGroup>
      </main>

      {/* 3. BOTTOM FOOTER BAR */}
      <footer className="h-16 border-t border-border bg-background grid grid-cols-3 items-center px-6 shrink-0 z-20">

        {/* Left: Empty for balance */}
        <div />

        {/* Center: Completion Action */}
        <div className="flex justify-center">
          <button
            onClick={async () => {
              try {
                const { data: sessionData, error: sessionError } =
                  await supabase.auth.getSession();

                if (sessionError || !sessionData.session) {
                  alert('You must be logged in');
                  return;
                }

                await markLessonCompleted(lesson.id);
                setCompleted(true);
              } catch (err) {
                console.error('MARK COMPLETE FAILED:', err);
                alert('Failed to save progress');
              }
            }}
            disabled={completed}
            className={`
              px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all min-w-[180px]
              ${completed
                ? 'bg-muted text-muted-foreground cursor-default'
                : 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 active:translate-y-0.5'
              }
            `}
          >
            {completed ? '✓ MISSION COMPLETE' : 'COMPLETE MISSION'}
          </button>
        </div>

        {/* Right: Navigation Controls */}
        <div className="flex items-center justify-end gap-4">
          {prevLesson ? (
            <Link href={`/lessons/${prevLesson.slug}`} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-primary/10 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
              ← PREV
            </Link>
          ) : (
            <span className="px-4 py-2 text-xs font-bold text-muted-foreground/30 cursor-not-allowed">← PREV</span>
          )}

          <div className="h-4 w-[1px] bg-border" />

          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.slug}`} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-primary/10 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
              NEXT →
            </Link>
          ) : (
            <span className="px-4 py-2 text-xs font-bold text-muted-foreground/30 cursor-not-allowed">NEXT →</span>
          )}
        </div>
      </footer>
    </div>
  );
}
