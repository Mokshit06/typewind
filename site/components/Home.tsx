import Link from "next/link";
import { Features } from "./Features";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <>
      <div className="min-h-screen lg:max-w-9xl flex flex-col justify-center items-center lg:gap-x-4 mx-auto px-4">
        <div className="mx-auto text-center">
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-gray-100">
            Bringing typesafety to Tailwind
          </h1>
          <p className="text-gray-500 font-semibold text-lg md:text-2xl mt-4">
            Introducing Typewind, a{" "}
            <span className="underline decoration-wavy decoration-red-500">
              typesafe
            </span>{" "}
            Tailwind CSS with zero runtime.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center sm:flex-row gap-4 my-6 text-md sm:text-xl w-full">
          <Link href="/docs">
            <button className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 p-8 rounded-lg w-full justify-center sm:w-auto bg-sky-500 highlight-white/20 hover:bg-sky-400 flex gap-x-2 items-center">
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
          </Link>
          <a
            className="focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 p-8 rounded-lg w-full flex items-center justify-center gap-2 sm:w-auto bg-gray-800 hover:bg-gray-700"
            target="_blank"
            rel="noreferrer"
            href="//github.com/mokshit06/headwind"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              version="1.1"
              viewBox="0 0 32 32"
              focusable="false"
              height="1.5em"
              width="1.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 5.343c-6.196 0-11.219 5.023-11.219 11.219 0 4.957 3.214 9.162 7.673 10.645 0.561 0.103 0.766-0.244 0.766-0.54 0-0.267-0.010-1.152-0.016-2.088-3.12 0.678-3.779-1.323-3.779-1.323-0.511-1.296-1.246-1.641-1.246-1.641-1.020-0.696 0.077-0.682 0.077-0.682 1.126 0.078 1.72 1.156 1.72 1.156 1.001 1.715 2.627 1.219 3.265 0.931 0.102-0.723 0.392-1.219 0.712-1.498-2.49-0.283-5.11-1.246-5.11-5.545 0-1.226 0.438-2.225 1.154-3.011-0.114-0.285-0.501-1.426 0.111-2.97 0 0 0.941-0.301 3.085 1.15 0.894-0.25 1.854-0.373 2.807-0.377 0.953 0.004 1.913 0.129 2.809 0.379 2.14-1.453 3.083-1.15 3.083-1.15 0.613 1.545 0.227 2.685 0.112 2.969 0.719 0.785 1.153 1.785 1.153 3.011 0 4.31-2.624 5.259-5.123 5.537 0.404 0.348 0.761 1.030 0.761 2.076 0 1.5-0.015 2.709-0.015 3.079 0 0.299 0.204 0.648 0.772 0.538 4.455-1.486 7.666-5.69 7.666-10.645 0-6.195-5.023-11.219-11.219-11.219z"></path>
            </svg>
            Github
          </a>
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
      <Features />
    </>
  );
}
