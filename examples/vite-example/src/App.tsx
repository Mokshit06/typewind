import { tw } from 'typewind';
import './index.css';

const t = {
  a: 'b',
};

export default function App() {
  return (
    <div className={tw.bg_black.hover(tw.bg_red_500.text_white).text_['16px']}>
      <h1 className={tw.text_white}>Hello World</h1>
    </div>
  );
}
