function Game() {
  return (
    <div className="flex flex-col">
      {Array(8)
        .fill("")
        .map((o, i) => (
          <div className="flex" key={i}>
            {Array(8)
              .fill("")
              .map((o, p) => (
                <div
                  key={p}
                  className={`h-16 w-16 border-gray-400 bg-${
                    (p + i) % 2 == 0 ? "black" : "white"
                  }`}
                />
              ))}
          </div>
        ))}
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
