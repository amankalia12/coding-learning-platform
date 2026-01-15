
import { AuthProvider } from '@/components/auth/AuthProvider';
export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="h-screen overflow-hidden bg-[#0b1020]">
      {children}
    </div>
  );
}
