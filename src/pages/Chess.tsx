function Game() {
  return (
    <div className="flex flex-col">
      <div className="mx-auto flex max-w-4xl flex-row">
        {Array(20)
          .fill({})
          .map((o, i) => (
            <div
              key={i}
              className={`h-16 w-16 border-gray-400 bg-${
                i % 2 == 0 ? "black" : "white"
              }`}
            ></div>
          ))}
      </div>
    </div>
  );
}

export default function Chess() {
  return (
    <div>
      <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
        Chess
      </h1>

      <Game />
    </div>
  );
}
