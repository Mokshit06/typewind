import { tw } from 'typewind';
import './index.css';

export default function App() {
  return (
    <h1 className={tw.text_red_800.dark(tw.text_red_400)}>tailwind + ts?</h1>
  );
}
