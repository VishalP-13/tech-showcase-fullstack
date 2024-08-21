import Image from "next/image";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-2">
      <h1 className="text-3xl font-sans tracking-tight text-gray-900 mt-[150px]">
        Welcome to the Posts Blog!
      </h1>
      <div className="flex flex-col items-center justify-center mt-8">
        <Image
          src="/hello.gif"
          alt="Animated GIF"
          className="w-full max-w-6xl shadow-2xl shadow-blue-950"
          width={1800}
          height={1400}
          priority
        />
      </div>
    </div>
  );
}
