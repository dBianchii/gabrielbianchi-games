/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Coord, type Board, type Color } from "./initialBoard";
import { type Piece } from "./pieces";

export const isOutOfBounds = (i: number, j: number) => {
  return i < 0 || i > 7 || j < 0 || j > 7;
};

export const pieceColor = (piece: Piece) =>
  piece.id === piece.id.toUpperCase() ? "white" : "black";

export const otherColor = (color: Color) =>
  color === "white" ? "black" : "white";

export const getPiece = (opts: {
  board: Board;
  y: number;
  x: number;
  color?: Color;
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

export const getKingCoords = (board: Board, color: Color) => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y]!.length; x++) {
      const piece = board[y]![x];
      if (piece?.id.toLowerCase() === "k" && pieceColor(piece) === color)
        return { y, x };
    }
  }
  throw new Error("King not found");
};

const hasPiecesInDirection = ({
  board,
  startingPosition,
  direction,
  pieceIds,
  color,
  radiusToCheck = 7,
}: {
  board: Board;
  startingPosition: Coord;
  direction: { x: 0 | 1 | -1; y: 0 | 1 | -1 };
  pieceIds: Lowercase<Piece["id"]>[];
  color: Color;
  radiusToCheck?: number;
}) => {
  let ySrch = startingPosition.y + direction.y;
  let xSrch = startingPosition.x + direction.x;

  while (true && radiusToCheck-- > 0) {
    if (ySrch > board.length - 1 || ySrch < 0) return false;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (xSrch > board[0]!.length - 1 || xSrch < 0) return false;

    const piece = getPiece({ y: ySrch, x: xSrch, board: board });
    if (piece) {
      if (pieceColor(piece) === color) {
        if (pieceIds.includes(piece.id.toLowerCase() as Lowercase<Piece["id"]>))
          return true;
      }
      return false;
    }
    ySrch += direction.y;
    xSrch += direction.x;
  }
};

export const areThereAvailableMoves = ({
  board,
  turn,
  doMove,
  canCastle,
  kingCoords,
}: {
  board: Board;
  turn: Color;
  doMove: (opts: {
    coord: Coord;
    preview?: boolean;
    selectedCoord: Coord;
  }) => Board;
  canCastle: {
    white: {
      king: boolean;
      queen: boolean;
    };
    black: {
      king: boolean;
      queen: boolean;
    };
  };
  kingCoords: Coord;
}) => {
  const piecesCoordsForTurn: Coord[] = [];
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y]!.length; x++) {
      const piece = getPiece({ board, y, x, color: turn });
      if (piece) piecesCoordsForTurn.push({ y, x });
    }
  }

  for (const pieceCoord of piecesCoordsForTurn) {
    const availableMoves = getAvailableMoves({
      board,
      kingCoords,
      turn,
      selectedCoord: pieceCoord,
      canCastle,
      doMove,
    });
    if (availableMoves.length > 0) return true;
  }
  return false;
};

export const isKingInCheck = ({
  board,
  kingCoord,
  kingColor,
}: {
  board: Board;
  kingCoord: Coord;
  kingColor: Color;
}) => {
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
        board,
        startingPosition: kingCoord,
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
        board,
        startingPosition: kingCoord,
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

  const coordsToCheckForKing: Coord[] = [
    { y: kingCoord.y - 1, x: kingCoord.x - 1 },
    { y: kingCoord.y - 1, x: kingCoord.x },
    { y: kingCoord.y - 1, x: kingCoord.x + 1 },
    { y: kingCoord.y, x: kingCoord.x - 1 },
    { y: kingCoord.y, x: kingCoord.x + 1 },
    { y: kingCoord.y + 1, x: kingCoord.x - 1 },
    { y: kingCoord.y + 1, x: kingCoord.x },
    { y: kingCoord.y + 1, x: kingCoord.x + 1 },
  ];
  for (const coord of coordsToCheckForKing) {
    const piece = getPiece({ y: coord.y, x: coord.x, board: board });
    if (
      piece?.id.toLowerCase() === "k" &&
      pieceColor(piece) === otherColor(kingColor)
    ) {
      return true;
    }
  }
  return false;
};

export function getAvailableMoves({
  board,
  kingCoords,
  turn,
  selectedCoord,
  canCastle,
  doMove,
}: {
  board: Board;
  kingCoords: Coord;
  turn: Color;
  selectedCoord: Coord;
  canCastle: {
    white: {
      king: boolean;
      queen: boolean;
    };
    black: {
      king: boolean;
      queen: boolean;
    };
  };
  doMove: (opts: {
    coord: Coord;
    preview?: boolean;
    selectedCoord: Coord;
  }) => Board;
}) {
  const { y: selectedY, x: selectedX } = selectedCoord;
  const selectedPiece = getPiece({
    board,
    y: selectedCoord.y,
    x: selectedCoord.x,
  });
  if (!selectedPiece) throw new Error("Unreachable");

  const availableMoves: {
    y: number;
    x: number;
    condition?: () => boolean;
  }[] = [];
  function getAvailableMovesFromDirections(
    initialCoord: Coord,
    directions: [number, number][]
  ) {
    const initialPiece = getPiece({
      board,
      y: initialCoord.y,
      x: initialCoord.x,
    });
    if (!initialPiece) throw new Error("Unreachable");

    for (const [dirY, dirX] of directions) {
      let stop = false;
      let currentY = initialCoord.y + dirY;
      let currentX = initialCoord.x + dirX;

      while (!stop && !isOutOfBounds(currentY, currentX)) {
        const currentSquarePiece = getPiece({
          board,
          y: currentY,
          x: currentX,
        });

        // Check for friendly piece
        if (
          currentSquarePiece &&
          pieceColor(currentSquarePiece) === pieceColor(initialPiece)
        ) {
          stop = true;
          break;
        }

        // Add valid move
        availableMoves.push({ y: currentY, x: currentX });

        // Check for opponent piece and stop moving further
        if (getPiece({ board, y: currentY, x: currentX })) {
          stop = true;
          break;
        }

        currentY += dirY;
        currentX += dirX;
      }
    }
  }

  switch (selectedPiece.id.toLowerCase()) {
    case "p": {
      const u = pieceColor(selectedPiece) === "white" ? -1 : 1; //?Up or down
      availableMoves.push(
        ...[
          {
            //Move forward
            y: selectedY + u,
            x: selectedX,
            condition: () =>
              !getPiece({ board, y: selectedY + u, x: selectedX }),
          },
          {
            //Move forward 2
            y: selectedY + u + u,
            x: selectedX,
            condition: () =>
              (selectedY === 1 || selectedY === 6) &&
              !getPiece({ board, y: selectedY + u, x: selectedX }) &&
              !getPiece({ board, y: selectedY + u + u, x: selectedX }),
          },
          {
            //Capture
            y: selectedY + u,
            x: selectedX - 1,
            condition: () =>
              !!getPiece({
                board,
                y: selectedY + u,
                x: selectedX - 1,
                color: otherColor(pieceColor(selectedPiece)),
              }),
          },
          {
            //Capture
            y: selectedY + u,
            x: selectedX + 1,
            condition: () =>
              !!getPiece({
                board,
                y: selectedY + u,
                x: selectedX + 1,
                color: otherColor(pieceColor(selectedPiece)),
              }),
          },
        ].filter(({ condition }) => {
          if (condition && !condition()) return false;
          return true;
        })
      );
      break;
    }
    case "r": {
      getAvailableMovesFromDirections(selectedCoord, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]);
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
      ].filter(
        ({ y, x }) =>
          !getPiece({ board, y, x, color: pieceColor(selectedPiece) })
      );

      availableMoves.push(...possibleMoves);
      break;
    }
    case "b": {
      getAvailableMovesFromDirections(selectedCoord, [
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ]);

      break;
    }
    case "q": {
      getAvailableMovesFromDirections(selectedCoord, [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, -1],
        [1, -1],
        [-1, 1],
      ]);

      break;
    }
    case "k": {
      availableMoves.push(
        ...[
          { y: selectedY - 1, x: selectedX - 1 },
          { y: selectedY - 1, x: selectedX },
          { y: selectedY - 1, x: selectedX + 1 },
          { y: selectedY, x: selectedX - 1 },
          { y: selectedY, x: selectedX + 1 },
          { y: selectedY + 1, x: selectedX - 1 },
          { y: selectedY + 1, x: selectedX },
          { y: selectedY + 1, x: selectedX + 1 },
          {
            y: selectedY,
            x: selectedX - 2,
            condition: () =>
              canCastle[turn].queen &&
              !getPiece({ board, y: selectedY, x: selectedX - 1 }) &&
              !getPiece({ board, y: selectedY, x: selectedX - 2 }) &&
              !getPiece({ board, y: selectedY, x: selectedX - 3 }),
          },
          {
            y: selectedY,
            x: selectedX + 2,
            condition: () =>
              canCastle[turn].king &&
              !getPiece({ board, y: selectedY, x: selectedX + 1 }) &&
              !getPiece({ board, y: selectedY, x: selectedX + 2 }),
          },
        ].filter(({ y, x, condition }) => {
          if (getPiece({ board, y, x, color: pieceColor(selectedPiece) }))
            return false;
          if (condition && !condition()) return false;

          return true;
        })
      );
      break;
    }
  }
  return availableMoves
    .filter((c) => !isOutOfBounds(c.y, c.x))
    .filter(({ y, x }: Coord) => {
      const previewBoard = doMove({
        selectedCoord,
        coord: { y, x },
        preview: true,
      });
      const kingCoord =
        selectedPiece.id.toLowerCase() === "k" ? { y, x } : kingCoords;

      if (
        isKingInCheck({
          board: previewBoard,
          kingCoord,
          kingColor: turn,
        })
      )
        return false;
      return true;
    });
}
