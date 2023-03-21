import classNames from "classnames";
import ChessSVG from "../../assets/chess.svg";

function Game() {
  const board: string[][] = [
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["r", "n", "b", "q", "k", "b", "n", "r"],
  ];

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
            >
              {piece && <Piece type={piece} />}
            </div>
          ))}
        </div>
      ))}

      <ChessSVG />
    </div>
  );
}

function Piece({ type }: { type: string }) {
  return <div className="text-xl text-amber-600">{type}</div>;
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
