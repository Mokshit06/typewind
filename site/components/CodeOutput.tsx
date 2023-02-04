import { tw } from 'typewind';

export const CodeOutput = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={tw.z_['-1'].flex.justify_center.rounded_xl.bg_slate_800.py_5}
    >
      {children}
    </div>
  );
};
