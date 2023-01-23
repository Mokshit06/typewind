export const CodeOutput = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black-900 z-[-1] flex justify-center rounded-xl bg-slate-800 py-5">
      {children}
    </div>
  );
};
