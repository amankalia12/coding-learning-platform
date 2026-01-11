import Link from 'next/link';
// Assuming type might be needed, or define locally if preferred. 

// Defining type locally to match previous file state if import is missing
type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: string;
};

// Deterministic gradient generator
const gradients = [
  'from-blue-500 to-purple-600',
  'from-teal-500 to-blue-600',
  'from-purple-500 to-pink-600',
  'from-cyan-500 to-blue-600',
];

export default function CourseCard({ course, index }: { course: Course; index: number }) {
  const gradient = gradients[index % gradients.length];

  return (
    <Link href={`/courses/${course.slug}`} className="group cursor-pointer">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">

        {/* Dynamic Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

        {/* Content Container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">

          {/* Top Badge */}
          <div className="flex justify-end">
            <div className="w-10 h-10 rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center text-lg group-hover:bg-primary/20 transition-colors">
              {index % 2 === 0 ? '📚' : '💻'}
            </div>
          </div>

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-primary bg-primary/10 rounded-md">
              Course {index + 1}
            </span>
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors mb-2">
              {course.title || course.description}
            </h3>
            {course.language && (
              <p className="text-sm text-muted-foreground">{course.language}</p>
            )}
            <div className="h-1 w-16 bg-primary mt-4 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
        </div>
      </div>
    </Link>
  );
}
