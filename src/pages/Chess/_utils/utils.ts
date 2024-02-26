import { type Coord, type Board } from "./initialBoard";
import { type Piece } from "./pieces";

export const isOutOfBounds = (i: number, j: number) => {
  return i < 0 || i > 7 || j < 0 || j > 7;
};

export const pieceColor = (piece: Piece) =>
  piece.id === piece.id.toUpperCase() ? "white" : "black";

export const otherColor = (color: "white" | "black") =>
  color === "white" ? "black" : "white";

export const getPiece = (opts: {
  board: Board;
  y: number;
  x: number;
  color?: "white" | "black";
  pieceIds?: Lowercase<Piece["id"]>[];
}) => {
  const piece = opts.board[opts.y]?.[opts.x];
  if (!piece) return;

  if (opts.color) {
    if (pieceColor(piece) !== opts.color) return;
  }

  if (opts.pieceIds?.length)
    if (
      !opts.pieceIds.includes(piece.id.toLowerCase() as Lowercase<Piece["id"]>)
    )
      return;

  return piece;
};

export const isInCheck = ({
  board,
  kingCoord,
  kingColor,
}: {
  board: Board;
  kingCoord: Coord;
  kingColor: "white" | "black";
}) => {
  const hasPiecesInDirection = ({
    direction,
    pieceIds,
    color,
    radiusToCheck = 7,
  }: {
    direction: { x: 0 | 1 | -1; y: 0 | 1 | -1 };
    pieceIds: Lowercase<Piece["id"]>[];
    color: "white" | "black";
    radiusToCheck?: number;
  }) => {
    let ySrch = kingCoord.y + direction.y;
    let xSrch = kingCoord.x + direction.x;

    while (true && radiusToCheck-- > 0) {
      if (ySrch > board.length - 1 || ySrch < 0) return false;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (xSrch > board[0]!.length - 1 || xSrch < 0) return false;

      const piece = getPiece({ y: ySrch, x: xSrch, board: board });
      if (piece) {
        if (pieceColor(piece) === color) {
          if (
            pieceIds.includes(piece.id.toLowerCase() as Lowercase<Piece["id"]>)
          )
            return true;
        }
        return false;
      }
      ySrch += direction.y;
      xSrch += direction.x;
    }
  };

  const directionsToCheckForRooksAndQueens: { y: 1 | 0 | -1; x: 1 | 0 | -1 }[] =
    [
      { y: -1, x: 0 },
      { y: 0, x: -1 },
      { y: 0, x: 1 },
      { y: 1, x: 0 },
    ];

  for (const direction of directionsToCheckForRooksAndQueens) {
    if (
      hasPiecesInDirection({
        direction,
        pieceIds: ["q", "r"],
        color: otherColor(kingColor),
      })
    )
      return true;
  }

  const directionsToCheckForQueenAndBishops: { y: 1 | -1; x: 1 | -1 }[] = [
    { y: -1, x: -1 },
    { y: -1, x: 1 },
    { y: 1, x: -1 },
    { y: 1, x: 1 },
  ];

  for (const direction of directionsToCheckForQueenAndBishops) {
    if (
      hasPiecesInDirection({
        direction,
        pieceIds: ["q", "b"],
        color: otherColor(kingColor),
      })
    )
      return true;
  }

  //check for pawns
  const coordsToCheckForPawn: Coord[] = [
    { y: kingCoord.y - 1, x: kingCoord.x - 1 },
    { y: kingCoord.y - 1, x: kingCoord.x + 1 },
  ];
  for (const coord of coordsToCheckForPawn) {
    const piece = getPiece({ y: coord.y, x: coord.x, board: board });
    if (
      piece?.id.toLowerCase() === "p" &&
      pieceColor(piece) === otherColor(kingColor)
    ) {
      return true;
    }
  }

  //check for knights
  const coordsToCheckForKnights: Coord[] = [
    { y: kingCoord.y - 2, x: kingCoord.x - 1 },
    { y: kingCoord.y - 1, x: kingCoord.x - 2 },
    { y: kingCoord.y + 1, x: kingCoord.x - 2 },
    { y: kingCoord.y + 2, x: kingCoord.x - 1 },
    { y: kingCoord.y - 2, x: kingCoord.x + 1 },
    { y: kingCoord.y - 1, x: kingCoord.x + 2 },
    { y: kingCoord.y + 1, x: kingCoord.x + 2 },
    { y: kingCoord.y + 2, x: kingCoord.x + 1 },
  ];
  for (const coord of coordsToCheckForKnights) {
    const piece = getPiece({ y: coord.y, x: coord.x, board: board });
    if (
      piece?.id.toLowerCase() === "n" &&
      pieceColor(piece) === otherColor(kingColor)
    ) {
      return true;
    }
  }
};
