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

// Fun vibrant gradients
const gradients = [
  'from-blue-500 via-purple-500 to-pink-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-green-500 via-teal-500 to-blue-500',
  'from-purple-500 via-pink-500 to-rose-500',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-cyan-500 via-blue-500 to-indigo-500',
];

export default function CourseCard({ course, index }: { course: Course; index: number }) {
  const gradient = gradients[index % gradients.length];

  return (
    <Link href={`/courses/${course.slug}`} className="group cursor-pointer">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-card shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">

        {/* Dynamic Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />

        {/* Content Container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">

          {/* Top Badge */}
          <div className="flex justify-end">
            <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:bg-white group-hover:scale-110 transition-all shadow-lg">
              {index % 2 === 0 ? '🚀' : '💻'}
            </div>
          </div>

          <div className="relative z-10">
            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary rounded-md shadow-lg">
              Course {index + 1}
            </span>
            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-yellow-300 transition-colors mb-2 drop-shadow-lg">
              {course.title || course.description}
            </h3>
            {course.language && (
              <p className="text-sm text-white/90 drop-shadow">{course.language}</p>
            )}
            <div className="h-1 w-16 bg-gradient-to-r from-accent to-yellow-400 mt-4 rounded-full group-hover:w-full transition-all duration-500 shadow-lg" />
          </div>
        </div>
      </div>
    </Link>
  );
}
