import Link from "next/link";
import { Suspense } from "react";
import { DiReact } from "react-icons/di";
import { db } from "~/server/db";

async function Test() {
  await db.query.accounts.findMany();

  return <div></div>;
}

export default function HomePage() {
  const games = [
    {
      title: "Connect 4",
      description: "Simple Connect 4 game. Click on a column to drop a piece.",
      href: "/Connect4",
    },
    {
      title: "Chess",
      description: "Chess using React. Sounds cool right?",
      href: "/Chess",
    },
  ];
  return (
    <>
      <div className="container flex flex-col items-center justify-center gap-12 px-2 py-16 ">
        <Suspense>
          <Test />
        </Suspense>
        <h1 className="text-3xl font-extrabold tracking-tight text-purple-800 sm:text-[5rem]">
          Hi!
        </h1>
        <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
          I&apos;m <span className="text-red-500">Gabriel Bianchi 👋</span>
        </h1>
        <h1 className="mx-40 inline text-center text-5xl font-extrabold leading-normal text-white">
          I created this website to showcase some cool simple games with
          <DiReact className="mx-4 inline animate-spin-slow text-8xl text-[#61DBFB]" />
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {games.map((game, i) => (
            <Link
              key={i}
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href={game.href}
              target="_blank"
            >
              <h3 className="text-2xl font-bold">{game.title}</h3>
              <div className="text-lg">{game.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
