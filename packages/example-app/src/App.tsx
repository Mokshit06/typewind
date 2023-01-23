import { tw } from 'typewind';

export default function App() {
  return (
    <button className={tw.flex.items_center.bg_blue_500.hover(tw.bg_blue_300)}>
      Get started
    </button>
  );
}
