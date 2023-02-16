import { tw } from 'typewind';

export default function Button() {
  console.log(tw.text_red_100);

  return <button className={tw.text_red_100}>Click Me</button>;
}
