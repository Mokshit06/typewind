import { FiCode } from 'react-icons/fi';
import { SiTailwindcss, SiTypescript } from 'react-icons/si';
import { MdExtensionOff } from 'react-icons/md';
import { RiSettingsFill } from 'react-icons/ri';
import { CiFolderOff } from 'react-icons/ci';
import { tw } from 'typewind';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

export const Features = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <CiFolderOff size="2em" />,
      title: 'Zero Bundle Size',
      description: (
        <>
          Typewind compiles away all the styles used, and converts them to
          static classes at build time.
        </>
      ),
    },
    {
      icon: <SiTailwindcss size="1.5em" />,
      title: 'Apply variants to multiple styles at once',
      description: (
        <>
          Typewind provides an intuitive syntax to apply variants to multiple
          styles.
        </>
      ),
    },
    {
      icon: <SiTypescript size="1.5em" />,
      title: 'Typesafe',
      description: (
        <>
          Using TS intellisense, Typewind is able to provide type safety to
          tailwind, and provide autocomplete for all the classes from{' '}
          <code
            className={
              tw.bg_black.text_sm.py_['0.5'].px_['-0.25rem'].border.rounded
                .text_gray_400
            }
          >
            tailwind.config.js
          </code>
        </>
      ),
    },
    {
      icon: <RiSettingsFill size="1.5em" />,
      title: 'Types generated from config',
      description: (
        <>
          Type definitions of{' '}
          <code
            className={
              tw.bg_black.text_sm.py_['0.5'].px_['-0.25rem'].border.rounded
                .text_gray_400
            }
          >
            tw
          </code>{' '}
          are generated from your `tailwind.config.js`, and also creates types
          for custom theme palette and plugins.
        </>
      ),
    },
    {
      icon: <MdExtensionOff size="1.5em" />,
      title: 'No need of extensions',
      description: (
        <>
          Type definitions along with CSS Docs are generated from your tailwind
          config and work using editors's built-in IntelliSense, and doesn't
          require extra extensions.
        </>
      ),
    },
    {
      icon: <FiCode size="1.5em" />,
      title: 'Supports all frameworks',
      description: (
        <>
          Typewind works with most Javascript/Typescript frameworks and build
          tools like NextJS, SolidStart, Vite, etc.
        </>
      ),
    },
  ];

  return (
    <div className={tw.w_full.min_h_['600px'].py_16.md(tw.pt_20)}>
      <h2
        className={
          tw.font_bold.text_2xl.lg(tw.text_3xl).xl(tw.text_4xl).text_center
        }
      >
        Why Typewind?
      </h2>
      <div className={tw.mx_auto.lg(tw.max_w_7xl).mt_12}>
        <div
          className={
            tw.grid.grid_cols_1
              .sm(tw.grid_cols_2)
              .lg(tw.grid_cols_3.gap_x_8.gap_y_12).gap_x_6.gap_y_8
          }
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div
      className={
        tw.bg_neutral_900.border.border_neutral_800.rounded_lg.p_8.flex.flex_col
      }
    >
      <div
        className={
          tw.flex.items_center.justify_center.h_16.w_16.rounded_full.bg_sky_500
        }
      >
        {icon}
      </div>
      <h3 className={tw.text_lg.font_semibold.text_gray_100.mt_4}>{title}</h3>
      <p className={tw.text_gray_400.mt_2}>{description}</p>
    </div>
  );
};
