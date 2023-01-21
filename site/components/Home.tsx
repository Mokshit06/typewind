import { useEffect, useState } from "react";

export default function Home() {
  // const [stars, setStars] = useState(0);
  //
  // useEffect(() => {
  //   fetch("https://api.github.com/repos/Mokshit06/headwind")
  //     .then((res) => res.json())
  //     .then((data) => console.log(data));
  // }, []);
  //
  return (
    <div className="px-8 pt-32 pb-32 sm:px-6 lg:px-8 text-white bg-gradient-to-b from-blackish to-color2 animate-gradient-x bg-repeat flex justify-content">
      <div className="lg:max-w-9xl flex flex-col items-center lg:gap-x-4 mx-auto">
        <div className="mx-auto text-center">
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-gray-100">
            Bringing typesafety to Tailwind
          </h1>
          <p className="text-gray-500 font-semibold text-lg md:text-2xl mt-4">
            Introducing Headwind, a{" "}
            <span className="underline decoration-wavy decoration-red-500">
              typesafe
            </span>{" "}
            Tailwind CSS with zero runtime.
          </p>
          {
            // <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-center text-transparent  bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
            //   The future of{" "}
            //   <TextLoop>
            //     <span className="underline decoration-wavy decoration-purple-600 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
            //       Tailwind
            //     </span>
            //     <span className="underline decoration-wavy decoration-purple-600 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">
            //       styling
            //     </span>
            //   </TextLoop>
            //   <br /> is here.
            // </h1>
          }
        </div>
        <div className="flex gap-x-4 my-4">
          <button className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400 flex gap-x-2 items-center">
            Get Started
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="3"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="20"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          {
            // <button className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto border-2 border-sky-500 bg-transparent highlight-white/20 hover:border-sky-400">
            //   Github {stars}
            // </button>
          }
        </div>
        <video
          src="/demo.mp4"
          className="border-[20px] shadow-xl rounded-lg bg-[#111111] border-[#111111] hidden md:block"
          autoPlay
          loop
          muted
          playsInline
          width={1200}
        ></video>
      </div>
    </div>
  );
}
