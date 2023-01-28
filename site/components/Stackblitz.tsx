import React from 'react';
import { tw } from 'typewind';

const fileMap = {
  vite: 'src/App.tsx',
  next: 'pages/index.tsx',
};

export function Stackblitz({ example }: { example: keyof typeof fileMap }) {
  return (
    <div className={tw.relative}>
      <iframe
        src={`https://stackblitz.com/github/mokshit06/typewind/tree/main/examples/${example}-example?embed=1&file=${fileMap[example]}`}
        className={
          tw.w_full.h_['71vh'].rounded_lg.border_2.border_['#7977af2b']
        }
      />
    </div>
  );
}
