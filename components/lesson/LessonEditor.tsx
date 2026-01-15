export function LessonEditor({ code, setCode }: any) {
  return (
    <div className="flex flex-col border-r border-white/10">
      <div className="px-4 py-2 text-sm bg-[#10162f] border-b border-white/10">
        query.sql
      </div>

      <textarea
        className="flex-1 bg-[#0f172a] text-green-300 font-mono p-4 outline-none resize-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
    </div>
  );
}
