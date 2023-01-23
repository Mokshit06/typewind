import { FiCode } from 'react-icons/fi';
import { SiTailwindcss, SiTypescript } from 'react-icons/si';
import { MdExtensionOff, MdExposureZero } from 'react-icons/md';
import { RiSettingsFill } from 'react-icons/ri';
import { CiFolderOff } from 'react-icons/ci';

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
          <code className="bg-black text-sm py-0.5 px-[.25em] border border-white/30 rounded text-gray-400">
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
          <code className="bg-black text-sm py-0.5 px-[.25em] border border-white/30 rounded text-gray-400">
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
    <div className="w-full min-h-[600px] py-16 md:pt-20">
      <h2 className="font-bold text-2xl lg:text-3xl xl:text-4xl text-center">
        Why Typewind?
      </h2>
      <div className="mx-auto lg:max-w-8xl mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-8 lg:gap-y-12">
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
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 flex flex-col">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-sky-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-100 mt-4">{title}</h3>
      <p className="text-gray-400 mt-2">{description}</p>
    </div>
  );
};
