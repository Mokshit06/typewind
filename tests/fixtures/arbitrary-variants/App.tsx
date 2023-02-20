import { tw } from 'typewind';

export default function Button() {
  return (
    <button className={tw.variant('&:nth-child(3)', tw.underline)}>
      Click Me
    </button>
  );
}
