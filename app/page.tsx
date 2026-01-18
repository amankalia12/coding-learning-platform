import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import Features from '@/components/home/Features';
import LearningPaths from '@/components/home/LearningPaths';
import CourseGrid from '@/components/home/CourseGrid';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';
import Navbar from '@/components/layout/Navbar';
import { supabase } from '@/lib/supabaseClient';

export default async function HomePage() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('title');

  if (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="text-4xl mb-4">🛸</div>
          <h1 className="text-xl font-bold">Signal Lost</h1>
          <p className="text-muted-foreground">Failed to load mission data.</p>
        </div>
      </div>
    );
  }

  const firstCourse = courses && courses.length > 0 ? courses[0] : null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <Hero firstCourse={firstCourse} />
        <Stats />
        <Features />
        <LearningPaths />
        <CourseGrid courses={courses || []} />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
