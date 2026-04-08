export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          esModuleInterop: true,
          resolveJsonModule: true,
          moduleResolution: 'node',
          target: 'ESNext',
          strict: true,
          allowJs: true,
          skipLibCheck: true,
        },
      },
    ],
  },
};
