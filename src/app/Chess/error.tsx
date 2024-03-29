"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
          Chess
        </h1>
        <div className="flex scale-50 flex-col pt-56 md:scale-100">
          <h2 className="font-bold text-white">Oh no, an error occured...</h2>
          <button
            onClick={reset}
            className="rounded-md bg-red-600 px-4 py-2 font-bold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
