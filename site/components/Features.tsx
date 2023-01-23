import { SiTypescript } from "react-icons/si";
import { MdExtensionOff } from "react-icons/md";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

export const Features = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <SiTypescript size="1.5em" />,
      title: "Typesafe",
      description: (
        <>
          Typewind is a completely typesafe version of Tailwind CSS. It has type
          definitions for all classes and variants custom to your{" "}
          <code className="bg-black text-sm py-0.5 px-[.25em] border border-white/30 rounded text-gray-400">
            tailwind.config.js
          </code>
        </>
      ),
    },
    {
      icon: <MdExtensionOff size="1.5em" />,
      title: "No Extensions Required",
      description: (
        <>
          Typewind is a completely typesafe version of Tailwind CSS. It has type
          definitions for all classes and variants custom to your{" "}
          <code className="bg-black text-sm py-0.5 px-[.25em] border border-white/30 rounded text-gray-400">
            tailwind.config.js
          </code>
        </>
      ),
    },
    {
      icon: <SiTypescript size="1.5em" />,
      title: "Typesafe",
      description: (
        <>
          Typewind is a completely typesafe version of Tailwind CSS. It has type
          definitions for all classes and variants custom to your{" "}
          <code className="bg-black text-sm py-0.5 px-[.25em] border border-white/30 rounded text-gray-400">
            tailwind.config.js
          </code>
        </>
      ),
    },
  ];
  return (
    <div className="w-full min-h-[600px]">
      <div className="mx-auto lg:max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 lg:gap-y-12">
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
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 flex flex-col">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-800">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-100 mt-4">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
};
