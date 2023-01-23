import { tw } from 'typewind';
import './index.css';

export default function App() {
  return (
    <div
      className={tw.h_screen.w_full.bg_gray_100.flex.justify_center.items_center.dark(
        tw.bg_gray_800
      )}
    >
      <div
        className={tw.bg_white.rounded.p_4.shadow.dark(
          tw.bg_gray_900.text_white
        )}
      >
        {/* primary color is coming from tailwind.config.js */}
        <h1 className={tw.text_2xl.font_bold.text_primary}>Hello World</h1>
        <p>
          This is an example vite app demonstrating the use of{' '}
          <a href="//typewind.vercel.app" className={tw.text_primary.underline}>
            Typewind
          </a>
          .
        </p>
      </div>
    </div>
  );
}
