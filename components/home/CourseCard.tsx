import Link from 'next/link';

// Defining type locally to match previous file state if import is missing
type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: string;
};

// Professional gradients
const gradients = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-green-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-indigo-500 to-purple-600',
];

export default function CourseCard({ course, index }: { course: Course; index: number }) {
  const gradient = gradients[index % gradients.length];

  return (
    <Link href={`/courses/${course.slug}`} className="group cursor-pointer">
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2">
        {/* Content Container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top Badge */}
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-lg group-hover:bg-primary/20 group-hover:scale-110 transition-all">
              {index % 4 === 0 ? '🚀' : index % 4 === 1 ? '💻' : index % 4 === 2 ? '📚' : '⚡'}
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {index + 1}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors mb-2">
              {course.title || course.description}
            </h3>
            {course.language && (
              <p className="text-sm text-muted-foreground mb-3">{course.language}</p>
            )}
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full w-16 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500 group-hover:w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
