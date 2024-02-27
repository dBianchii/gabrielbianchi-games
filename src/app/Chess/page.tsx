import { Game } from "./_components/board";

export default function Chess() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
          Chess
        </h1>
        <Game />
      </div>
    </div>
  );
}
