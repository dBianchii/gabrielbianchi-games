import classNames from "classnames";

function Game() {
  type Piece = {
    // Define properties of the Piece type here
  };

  const board: (null | Piece)[][] = [];

  for (let i = 0; i < 8; i++) {
    board[i] = Array(8).fill(null) as (null | Piece)[];
  }

  return (
    <div className="flex flex-col">
      {board.map((row, i) => (
        <div className="flex" key={i}>
          {row.map((piece, j) => (
            <div
              key={j}
              className={classNames("h-16 w-16 border-gray-400", {
                "bg-white": (i + j) % 2 === 0,
                "bg-black": (i + j) % 2 === 1,
              })}
            ></div>
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
