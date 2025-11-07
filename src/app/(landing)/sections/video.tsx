"use client";
import Image from "next/image";

export default function VideoSection() {
  return (
    <section className="relative z-[-1] -my-14 md:-my-20 lg:-my-34 xl:-my-50">
      <div className="absolute w-full h-full bg-linear-to-t from-background via-transparent to-background pointer-events-none"></div>
      <div className=" bg-card mix-blend-color absolute w-full h-full pointer-events-none"></div>
      <video
        width={1920}
        muted
        autoPlay
        loop
        preload="none"
        className="w-full min-h-80 object-cover"
      >
        <source
          src="https://res.cloudinary.com/dxa43gzxq/video/upload/v1748045239/video-3_mgurfv.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute w-full h-full top-0 flex items-center justify-center z-[1]">
        <Image
          className="w-32 md:w-44 lg:w-52 xl:w-64"
          src="/video-icon.png"
          alt="What Is Forex Trading?"
          width={400}
          height={400}
          priority
        />
      </div>
    </section>
  );
}
