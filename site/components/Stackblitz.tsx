import React from 'react';

const fileMap = {
  vite: 'src/App.tsx',
  next: 'pages/index.tsx',
};

export function Stackblitz({ example }: { example: keyof typeof fileMap }) {
  return (
    <div className="relative">
      <iframe
        src={`https://stackblitz.com/github/mokshit06/typewind/tree/main/examples/${example}-example?embed=1&file=${fileMap[example]}`}
        className="w-full h-[71vh] rounded-lg border-2 border-[#7977af2b]"
      />
    </div>
  );
}
