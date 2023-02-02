import { tw } from 'typewind';

export default function Button() {
  return (
    <button
      className={tw.bg_blue_500
        .hover(tw.bg_blue_600)
        .text_white.rounded.py_3.px_4.md(tw.py_4.px_5)
        .dark(tw.bg_sky_900.hover(tw.bg_sky_800))
        .important(tw.text_red_500.hover(tw.text_red_600))}
    >
      Click Me
    </button>
  );
}
