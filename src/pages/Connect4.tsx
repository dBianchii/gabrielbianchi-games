import React, { useState } from "react";
function Game() {
  const nullArr = [null, null, null, null, null, null];

  const [col1, setCol1] = useState<(string | null)[]>(nullArr);
  const [col2, setCol2] = useState<(string | null)[]>(nullArr);
  const [col3, setCol3] = useState<(string | null)[]>(nullArr);
  const [col4, setCol4] = useState<(string | null)[]>(nullArr);
  const [col5, setCol5] = useState<(string | null)[]>(nullArr);
  const [col6, setCol6] = useState<(string | null)[]>(nullArr);
  const [col7, setCol7] = useState<(string | null)[]>(nullArr);

  const [board, setBoard] = useState<(string | null)[][]>([
    nullArr,
    nullArr,
    nullArr,
    nullArr,
    nullArr,
    nullArr,
    nullArr,
  ]);

  const [turn, setTurn] = useState<"blue" | "red">("blue");

  function handleColumnClick(
    col: (string | null)[],
    setCol: React.Dispatch<React.SetStateAction<(string | null)[]>>
  ) {
    const colCopy = [...col];
    colCopy[colCopy.lastIndexOf(null)] = turn;

    setCol(colCopy);
    setTurn(turn == "blue" ? "red" : "blue");

    setBoard([col1, col2, col3, col4, col5, col6, col7]);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="mx-auto flex flex-row">
        <Column onClick={() => handleColumnClick(col1, setCol1)} col={col1} />
        <Column onClick={() => handleColumnClick(col2, setCol2)} col={col2} />
        <Column onClick={() => handleColumnClick(col3, setCol3)} col={col3} />
        <Column onClick={() => handleColumnClick(col4, setCol4)} col={col4} />
        <Column onClick={() => handleColumnClick(col5, setCol5)} col={col5} />
        <Column onClick={() => handleColumnClick(col6, setCol6)} col={col6} />
        <Column onClick={() => handleColumnClick(col7, setCol7)} col={col7} />
      </div>
    </div>
  );
}

function Column({
  onClick,
  col,
}: {
  onClick: () => void;
  col: (string | null)[];
}) {
  return (
    <div className="flex flex-col hover:scale-95" onClick={onClick}>
      <Circle fill={col[0] ?? "white"} />
      <Circle fill={col[1] ?? "white"} />
      <Circle fill={col[2] ?? "white"} />
      <Circle fill={col[3] ?? "white"} />
      <Circle fill={col[4] ?? "white"} />
      <Circle fill={col[5] ?? "white"} />
    </div>
  );
}
//adapt the above to be a function where the fill can be changed
function Circle({ fill }: { fill: string }) {
  return (
    <div className="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 50 50"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="black"
          strokeWidth="3"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export default function Connect4() {
  return (
    <div>
      <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
        Connect 4
      </h1>

      <Game />
    </div>
  );
}
