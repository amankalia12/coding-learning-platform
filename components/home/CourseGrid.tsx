'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CourseCard from '@/components/home/CourseCard';
import { Link } from 'lucide-react';

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: string;
};


export default function CourseGrid({ courses }: { courses: any[] }) {
  if (!courses || courses.length === 0) return null;

  return (
    <section className="px-8 mt-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="text-4xl">🐍</div>
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground leading-none">
            {courses[0]?.title}
          </h2>
          <p className="text-muted-foreground font-medium mt-1">
            Get started with {courses[0]?.language || 'coding'}, a beginner-friendly language.
          </p>
        </div>
      </div>

      {/* THE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          // ✅ Now we call the component and it keeps the beautiful design!
          <CourseCard key={course.id} course={course} index={index} />
        ))}
      </div>
    </section>
  );
}