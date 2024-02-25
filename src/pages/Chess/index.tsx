import classNames from "classnames";
import { useEffect, useState } from "react";
import { set } from "zod";
import BlackBishop from "../../assets/pieces/black-bishop.svg";
import BlackKing from "../../assets/pieces/black-king.svg";
import BlackKnight from "../../assets/pieces/black-knight.svg";
import BlackPawn from "../../assets/pieces/black-pawn.svg";
import BlackQueen from "../../assets/pieces/black-queen.svg";
import BlackRook from "../../assets/pieces/black-rook.svg";
import WhiteBishop from "../../assets/pieces/white-bishop.svg";
import WhiteKing from "../../assets/pieces/white-king.svg";
import WhiteKnight from "../../assets/pieces/white-knight.svg";
import WhitePawn from "../../assets/pieces/white-pawn.svg";
import WhiteQueen from "../../assets/pieces/white-queen.svg";
import WhiteRook from "../../assets/pieces/white-rook.svg";

const piecesIds = [
  "P",
  "R",
  "N",
  "B",
  "Q",
  "K",
  "p",
  "r",
  "n",
  "b",
  "q",
  "k",
] as const;

type Piece = {
  id: (typeof piecesIds)[number];
  svg: React.ReactElement;
};

const isOutOfBounds = (i: number, j: number) => {
  return i < 0 || i > 7 || j < 0 || j > 7;
};
const scale = "1.5";

const P: Piece = { id: "P", svg: <WhitePawn className={`scale-[${scale}]`} /> };
const R: Piece = { id: "R", svg: <WhiteRook className={`scale-[${scale}]`} /> };
const N: Piece = {
  id: "N",
  svg: <WhiteKnight className={`scale-[${scale}]`} />,
};
const B: Piece = {
  id: "B",
  svg: <WhiteBishop className={`scale-[${scale}]`} />,
};
const Q: Piece = {
  id: "Q",
  svg: <WhiteQueen className={`scale-[${scale}]`} />,
};
const K: Piece = { id: "K", svg: <WhiteKing className={`scale-[${scale}]`} /> };
const p: Piece = { id: "p", svg: <BlackPawn className={`scale-[${scale}]`} /> };
const r: Piece = { id: "r", svg: <BlackRook className={`scale-[${scale}]`} /> };
const n: Piece = {
  id: "n",
  svg: <BlackKnight className={`scale-[${scale}]`} />,
};
const b: Piece = {
  id: "b",
  svg: <BlackBishop className={`scale-[${scale}]`} />,
};
const q: Piece = {
  id: "q",
  svg: <BlackQueen className={`scale-[${scale}]`} />,
};
const k: Piece = { id: "k", svg: <BlackKing className={`scale-[${scale}]`} /> };

const initialBoard: (Piece | undefined)[][] = [
  [r, n, b, q, k, b, n, r],
  [p, p, p, p, p, p, p, p],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
  [P, P, P, P, P, P, P, P],
  [R, N, B, Q, K, B, N, R],
];

const getPieceColor = (piece: Piece) =>
  piece.id === piece.id.toUpperCase() ? "white" : "black";

const otherColor = (color: "white" | "black") =>
  color === "white" ? "black" : "white";

function Game({
  turn,
  setTurn,
}: {
  turn: "white" | "black";
  setTurn: (turn: "white" | "black") => void;
}) {
  const [selectedCoords, setSelectedCoords] = useState<
    { x: number; y: number } | undefined
  >();

  const [board, setBoard] = useState(initialBoard);

  const hasPiece = (
    y: number,
    x: number,
    color: "white" | "black" | undefined = undefined
  ) => {
    const piece = board[y]?.[x];
    if (!piece) return false;
    if (!color) return true;
    const pieceColor = getPieceColor(piece);
    return pieceColor === color;
  };

  const availableSquaresMoves: {
    y: number;
    x: number;
    condition?: () => boolean;
  }[] = [];
  // Add logic to calculate available moves
  if (selectedCoords) {
    const selectedPiece = initialBoard[selectedCoords.y]?.[selectedCoords.x];
    if (!selectedPiece)
      throw new Error("Selected piece is undefined but we have selectedCoords");

    //Let's separate the color from the id.
    const selectedPieceColor = getPieceColor(selectedPiece);

    const u = selectedPieceColor === "white" ? -1 : 1; //?Up or down
    const { y: selectedY, x: selectedX } = selectedCoords;

    switch (selectedPiece.id.toLowerCase()) {
      case "p": {
        availableSquaresMoves.push(
          ...[
            {
              //Move forward
              y: selectedY + u,
              x: selectedX,
              condition: () => !hasPiece(selectedY + u, selectedX),
            },
            {
              //Move forward 2
              y: selectedY + u + u,
              x: selectedX,
              condition: () => selectedY === 1 || selectedY === 6,
            },
            {
              //Capture
              y: selectedY + u,
              x: selectedX - 1,
              condition: () =>
                hasPiece(
                  selectedY + u,
                  selectedX - 1,
                  otherColor(selectedPieceColor)
                ),
            },
            {
              //Capture
              y: selectedY + u,
              x: selectedX + 1,
              condition: () =>
                hasPiece(
                  selectedY + u,
                  selectedX + 1,
                  otherColor(selectedPieceColor)
                ),
            },
          ].filter(({ y, x, condition }) => {
            if (isOutOfBounds(y, x)) return false;
            if (condition && !condition()) return false;

            return true;
          })
        );
        break;
      }
      case "r": {
        let stopUp = false;
        let stopDown = false;
        let stopRight = false;
        let stopLeft = false;

        const handleDirectionCheck = (y: number, x: number, stop: boolean) => {
          if (isOutOfBounds(y, x)) stop = true;
          else if (hasPiece(y, x)) {
            stop = true;
            if (hasPiece(y, x, otherColor(selectedPieceColor)))
              availableSquaresMoves.push({ y, x }); //Capture
          } else availableSquaresMoves.push({ y, x });
          return stop;
        };

        for (let i = 1; i < 8; i++) {
          if (!stopUp)
            stopUp = handleDirectionCheck(selectedY - i, selectedX, false);
          if (!stopDown)
            stopDown = handleDirectionCheck(selectedY + i, selectedX, false);
          if (!stopRight)
            stopRight = handleDirectionCheck(selectedY, selectedX + i, false);
          if (!stopLeft)
            stopLeft = handleDirectionCheck(selectedY, selectedX - i, false);
        }
        break;
      }
      case "n": {
        const possibleMoves = [
          { y: selectedY - 2, x: selectedX - 1 },
          { y: selectedY - 2, x: selectedX + 1 },
          { y: selectedY - 1, x: selectedX - 2 },
          { y: selectedY - 1, x: selectedX + 2 },
          { y: selectedY + 1, x: selectedX - 2 },
          { y: selectedY + 1, x: selectedX + 2 },
          { y: selectedY + 2, x: selectedX - 1 },
          { y: selectedY + 2, x: selectedX + 1 },
        ].filter((c) => !isOutOfBounds(c.y, c.x));
        availableSquaresMoves.push(
          ...possibleMoves.filter(
            ({ y, x }) => !hasPiece(y, x, selectedPieceColor)
          )
        );
        break;
      }
      case "b": {
        let stopUpRight = false;
        let stopUpLeft = false;
        let stopDownRight = false;
        let stopDownLeft = false;

        const handleDirectionCheck = (y: number, x: number, stop: boolean) => {
          if (isOutOfBounds(y, x)) stop = true;
          else if (hasPiece(y, x)) {
            stop = true;
            if (hasPiece(y, x, otherColor(selectedPieceColor)))
              availableSquaresMoves.push({ y, x }); //Capture
          } else availableSquaresMoves.push({ y, x });
          return stop;
        };

        for (let i = 1; i < 8; i++) {
          if (!stopUpRight)
            stopUpRight = handleDirectionCheck(
              selectedY - i,
              selectedX + i,
              false
            );
          if (!stopUpLeft)
            stopUpLeft = handleDirectionCheck(
              selectedY - i,
              selectedX - i,
              false
            );
          if (!stopDownRight)
            stopDownRight = handleDirectionCheck(
              selectedY + i,
              selectedX + i,
              false
            );
          if (!stopDownLeft)
            stopDownLeft = handleDirectionCheck(
              selectedY + i,
              selectedX - i,
              false
            );
        }
        break;
      }
      case "q": {
        let stopUp = false;
        let stopDown = false;
        let stopRight = false;
        let stopLeft = false;
        let stopUpRight = false;
        let stopUpLeft = false;
        let stopDownRight = false;
        let stopDownLeft = false;

        const handleDirectionCheck = (y: number, x: number, stop: boolean) => {
          if (isOutOfBounds(y, x)) stop = true;
          else if (hasPiece(y, x)) {
            stop = true;
            if (hasPiece(y, x, otherColor(selectedPieceColor)))
              availableSquaresMoves.push({ y, x }); //Capture
          } else availableSquaresMoves.push({ y, x });
          return stop;
        };

        for (let i = 1; i < 8; i++) {
          if (!stopUp)
            stopUp = handleDirectionCheck(selectedY - i, selectedX, false);
          if (!stopDown)
            stopDown = handleDirectionCheck(selectedY + i, selectedX, false);
          if (!stopRight)
            stopRight = handleDirectionCheck(selectedY, selectedX + i, false);
          if (!stopLeft)
            stopLeft = handleDirectionCheck(selectedY, selectedX - i, false);
          if (!stopUpRight)
            stopUpRight = handleDirectionCheck(
              selectedY - i,
              selectedX + i,
              false
            );
          if (!stopUpLeft)
            stopUpLeft = handleDirectionCheck(
              selectedY - i,
              selectedX - i,
              false
            );
          if (!stopDownRight)
            stopDownRight = handleDirectionCheck(
              selectedY + i,
              selectedX + i,
              false
            );
          if (!stopDownLeft)
            stopDownLeft = handleDirectionCheck(
              selectedY + i,
              selectedX - i,
              false
            );
        }
        break;
      }
      case "k": {
        const possibleMoves = [
          { y: selectedY - 1, x: selectedX - 1 },
          { y: selectedY - 1, x: selectedX },
          { y: selectedY - 1, x: selectedX + 1 },
          { y: selectedY, x: selectedX - 1 },
          { y: selectedY, x: selectedX + 1 },
          { y: selectedY + 1, x: selectedX - 1 },
          { y: selectedY + 1, x: selectedX },
          { y: selectedY + 1, x: selectedX + 1 },
        ].filter((c) => !isOutOfBounds(c.y, c.x));
        availableSquaresMoves.push(
          ...possibleMoves.filter(
            ({ y, x }) => !hasPiece(y, x, selectedPieceColor)
          )
        );
        break;
      }
    }
  }

  const handleSelectSquare = ({ y, x }: { y: number; x: number }) => {
    if (selectedCoords) {
      if (
        (selectedCoords.x === x && selectedCoords.y === y) || //Same piece
        (!hasPiece(y, x) &&
          !availableSquaresMoves.some(
            (coord) => coord.y === y && coord.x === x
          ))
      ) {
        setSelectedCoords(undefined);
        return;
      }

      if (
        availableSquaresMoves.some((coord) => coord.y === y && coord.x === x)
      ) {
        doMove({ y, x });
        setSelectedCoords(undefined);
        return;
      }

      if (hasPiece(y, x, turn)) {
        setSelectedCoords({ y, x });
        return;
      }
    } else {
      if (!hasPiece(y, x, turn)) return;
      setSelectedCoords({ y, x });
    }
  };

  const doMove = (coord: { y: number; x: number }) => {
    if (!selectedCoords) throw new Error("Unreachable");
    const newBoard = [...board];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newBoard[coord.y]![coord.x] =
      newBoard[selectedCoords.y]?.[selectedCoords.x]; //Move piece
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newBoard[selectedCoords.y]![selectedCoords.x] = undefined; //Remove piece from old position
    setBoard(newBoard);
    setTurn(otherColor(turn));
  };

  return (
    <div className="flex flex-col">
      {board.map((row, y) => (
        <div className="flex" key={y}>
          {row.map((piece, x) => (
            <Square
              availableMove={availableSquaresMoves.some(
                (coord) => coord.y === y && coord.x === x
              )}
              highlighted={
                selectedCoords &&
                selectedCoords.y === y &&
                selectedCoords.x === x
              }
              key={x + y}
              y={y}
              x={x}
              piece={piece}
              handleSelectPiece={handleSelectSquare}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Square({
  y,
  x,
  piece,
  highlighted,
  handleSelectPiece,
  availableMove,
}: {
  y: number;
  x: number;
  piece: Piece | undefined;
  handleSelectPiece: (args: { y: number; x: number }) => void;
  highlighted?: boolean;
  availableMove: boolean;
}) {
  return (
    <div
      onClick={() => handleSelectPiece({ y, x })}
      className={classNames(
        "flex h-20 w-20 items-center justify-center border-gray-400",
        {
          "bg-[#FBCC9C]": (y + x) % 2 === 0 && !highlighted,
          "bg-[#91602E]": (y + x) % 2 === 1 && !highlighted,
          "bg-yellow-500": highlighted,
          "bg-yellow-200": availableMove,
        }
      )}
    >
      {piece && piece.svg}
    </div>
  );
}

export default function Chess() {
  const [turn, setTurn] = useState<"white" | "black">("white");

  useEffect(() => {
    document.title = `Chess - ${turn}'s turn`;
    //play audio
  }, [turn]);

  return (
    <div className="flex">
      <div className="flex flex-col">
        <h1 className="text-5xl font-extrabold tracking-tight text-cyan-800 sm:text-[5rem]">
          Chess
        </h1>
        <Game turn={turn} setTurn={setTurn} />
      </div>
    </div>
  );
}
