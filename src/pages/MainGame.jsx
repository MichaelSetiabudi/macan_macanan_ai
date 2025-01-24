import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { validKill, isValidKill } from "../components/validKill";
import { INTERSECTION_POINTS } from "../components/Intersection_Points";
import { initializeBoard } from "../components/initializeBoard";
import {
  VALID_CONNECTIONS,
  isValidConnection,
} from "../components/validConnections";
import {
  gameOver,
  allPossibleKillMoveByTiger,
  allPossibleMoveByTiger,
  allPossibleMoveByVillager,
} from "../components/gameOver";
import { PopUp } from "../components/PopUp";
import {
  findTheBestMove,
  findTheBestPlacement,
} from "../components/findTheBestMovewithABC";
import { findTheBestMoveOri } from "../components/findTheBestMove";
const GAME_PHASES = {
  PLACEMENT: "placement",
  MOVEMENT: "movement",
};

const MacanGame = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("macan");
  const [gamePhase, setGamePhase] = useState(GAME_PHASES.PLACEMENT);
  const [placedMacanCount, setPlacedMacanCount] = useState(0);
  const [placedAnakCount, setPlacedAnakCount] = useState(0);
  const [availableNodes, setAvailableNodes] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const popupWord = useRef();
  const popupWord2 = useRef();

  const [player, setPlayer] = useState(null);

  const handleResetPlayer = () => {
    localStorage.removeItem("playerType");
    navigate("/");
  };

  useEffect(() => {
    const savedPlayerType = localStorage.getItem("playerType");
    if (!savedPlayerType) {
      navigate("/");
    } else {
      setPlayer(savedPlayerType);
    }
  }, [navigate]);
  const playerPieceType = player === "Tiger" ? "macan" : "anak";
  const isValidMove = (piece, targetPoint) => {
    if (!piece.position) {
      return !board.pieces.some((p) => p.position === targetPoint.id);
    }

    const currentPoint = INTERSECTION_POINTS.find(
      (p) => p.id === piece.position
    );
    if (!currentPoint) return false;
    const targetIntersection = INTERSECTION_POINTS.find(
      (p) => p.id === targetPoint.id
    );
    if (!targetIntersection) return false;
    if (board.pieces.some((p) => p.position === targetPoint.id)) {
      return false;
    }
    if (piece.type === "macan") {
      return (
        isValidConnection(currentPoint, targetIntersection) ||
        isValidKill(currentPoint, targetIntersection, board).allVillagersPresent
      );
    }

    return isValidConnection(currentPoint, targetIntersection);
  };
  const makeAIMove = () => {
    const aiPieceType = playerPieceType === "macan" ? "anak" : "macan";

    if (currentPlayer !== aiPieceType) return;
    if (
      aiPieceType === "macan" &&
      placedMacanCount === 2 &&
      placedAnakCount < 8
    ) {
      const placedMacans = board.pieces.filter(
        (p) => p.type === "macan" && p.position !== null
      );
      const allPossibleMoves = [];
      placedMacans.forEach((macan) => {
        const validMoves = INTERSECTION_POINTS.filter((point) =>
          isValidMove(macan, point)
        );
        validMoves.forEach((move) => {
          allPossibleMoves.push({
            piece: macan,
            move: move,
          });
        });
      });
      if (allPossibleMoves.length > 0) {
        let selectedMove =
          allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];

        let newBoard = {
          ...board,
          pieces: board.pieces.map((p) =>
            p.id === selectedMove.piece.id
              ? {
                  ...p,
                  position: selectedMove.move.id,
                  x: selectedMove.move.x,
                  y: selectedMove.move.y,
                }
              : p
          ),
        };
        if (aiPieceType === "macan") {
          selectedMove = findTheBestMove(structuredClone(board), "macan");
          let ifKill = isValidKill(
            { id: selectedMove.piece.position },
            selectedMove.move,
            board
          );
          console.log(
            "ifkill : ",
            ifKill,
            " p1 : ",
            selectedMove.piece.position,
            " p2 : ",
            selectedMove.move.id,
            "board : ",
            board
          );
          let newPieces2 = board.pieces;
          if (ifKill.allVillagersPresent) {
            newPieces2 = board.pieces.filter(
              (e) => !ifKill.allKilledVillagers.includes(e)
            );
          }
          newPieces2.forEach((e) => {
            if (e.id === selectedMove.piece.id) {
              e.position = selectedMove.move.id;
              e.x = selectedMove.move.x;
              e.y = selectedMove.move.y;
            }
          });
          newBoard.pieces = newPieces2;
        }
        setBoard(newBoard);
        setCurrentPlayer(playerPieceType);
        return;
      }

      setCurrentPlayer(playerPieceType);
      return;
    }
    if (gamePhase === GAME_PHASES.PLACEMENT) {
      const availablePositions = INTERSECTION_POINTS.filter(
        (point) => !board.pieces.some((p) => p.position === point.id)
      );

      if (availablePositions.length > 0) {
        const randomPosition =
          availablePositions[
            Math.floor(Math.random() * availablePositions.length)
          ];
        const unplacedPiece = board.pieces.find(
          (p) => p.type === aiPieceType && p.position === null
        );

        if (unplacedPiece) {
          let newBoard = {
            ...board,
            pieces: board.pieces.map((p) =>
              p.id === unplacedPiece.id
                ? {
                    ...p,
                    position: randomPosition.id,
                    x: randomPosition.x,
                    y: randomPosition.y,
                  }
                : p
            ),
          };
          if (aiPieceType === "macan") {
            let selectedMove = findTheBestPlacement(
              structuredClone(board),
              structuredClone(unplacedPiece),
              "macan"
            );
            newBoard.pieces.forEach((e) => {
              if (e.id === unplacedPiece.id) {
                e.position = selectedMove.id;
                e.x = selectedMove.x;
                e.y = selectedMove.y;
              }
            });
          } else {
            let selectedMove = findTheBestPlacement(
              structuredClone(board),
              structuredClone(unplacedPiece),
              "anak"
            );
            newBoard.pieces.forEach((e) => {
              if (e.id === unplacedPiece.id) {
                e.position = selectedMove.id;
                e.x = selectedMove.x;
                e.y = selectedMove.y;
              }
            });
          }
          setBoard(newBoard);
          if (aiPieceType === "macan") {
            setPlacedMacanCount((prev) => prev + 1);
          } else {
            setPlacedAnakCount((prev) => prev + 1);
          }
          setCurrentPlayer(playerPieceType);
        }
      }
    } else {
      const aiPieces = board.pieces.filter(
        (p) => p.type === aiPieceType && p.position !== null
      );
      const allPossibleMoves = [];
      aiPieces.forEach((piece) => {
        const validMoves = INTERSECTION_POINTS.filter((point) =>
          isValidMove(piece, point)
        );
        validMoves.forEach((move) => {
          allPossibleMoves.push({
            piece: piece,
            move: move,
          });
        });
      });
      if (allPossibleMoves.length > 0) {
        let selectedMove =
          allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];

        let newBoard = {};
        let newPieces2 = [];
        newBoard = {
          ...board,
          pieces: board.pieces.map((p) =>
            p.id === selectedMove.piece.id
              ? {
                  ...p,
                  position: selectedMove.move.id,
                  x: selectedMove.move.x,
                  y: selectedMove.move.y,
                }
              : p
          ),
        };
        if (aiPieceType === "macan") {
          selectedMove = findTheBestMove(structuredClone(board), "macan");

          let ifKill = isValidKill(
            { id: selectedMove.piece.position },
            selectedMove.move,
            board
          );
          console.log(
            "ifkill : ",
            ifKill,
            " p1 : ",
            selectedMove.piece.position,
            " p2 : ",
            selectedMove.move.id,
            "board : ",
            board
          );
          newPieces2 = board.pieces;
          if (ifKill.allVillagersPresent) {
            newPieces2 = board.pieces.filter(
              (e) => !ifKill.allKilledVillagers.includes(e)
            );
          }
          newPieces2.forEach((e) => {
            if (e.id === selectedMove.piece.id) {
              e.position = selectedMove.move.id;
              e.x = selectedMove.move.x;
              e.y = selectedMove.move.y;
            }
          });
          newBoard.pieces = newPieces2;
        } else {
          selectedMove = findTheBestMove(structuredClone(board), "anak");

          newPieces2 = board.pieces;

          newPieces2.forEach((e) => {
            if (e.id === selectedMove.piece.id) {
              e.position = selectedMove.move.id;
              e.x = selectedMove.move.x;
              e.y = selectedMove.move.y;
            }
          });
          newBoard.pieces = newPieces2;
        }
        if (
          gameOver(newBoard.pieces) == 1 &&
          gamePhase != GAME_PHASES.PLACEMENT
        ) {
          popupWord.current = "Tiger Won";
          popupWord2.current = "You Play as " + player;
          setShowPopUp(true);
          console.log("Tiger Won");
        }
        if (gameOver(newBoard.pieces) == -1) {
          popupWord.current = "Villager Won";
          popupWord2.current = "You Play as " + player;
          setShowPopUp(true);
          console.log("Villager Won");
        }
        setBoard(newBoard);
        setCurrentPlayer(playerPieceType);
        return;
      }
      setCurrentPlayer(playerPieceType);
    }
  };

  useEffect(() => {
    if (currentPlayer !== playerPieceType) {
      const timer = setTimeout(makeAIMove, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gamePhase, playerPieceType]);

  useEffect(() => {
    if (placedMacanCount === 2 && placedAnakCount === 8) {
      setGamePhase(GAME_PHASES.MOVEMENT);
    }
  }, [placedMacanCount, placedAnakCount]);
  const handlePieceClick = (piece) => {
    if (piece.type !== playerPieceType || piece.type !== currentPlayer) return;
    if (
      piece.type === "macan" &&
      placedMacanCount === 2 &&
      piece.position === null
    )
      return;

    setSelectedPiece(piece);
  };
  useEffect(() => {
    if (placedAnakCount === 8) {
      setGamePhase(GAME_PHASES.MOVEMENT);
    }
  }, [placedAnakCount]);
  const isNodeAvailable = (point) => {
    if (!selectedPiece) return false;
    if (board.pieces.some((p) => p.position === point.id)) return false;
    if (gamePhase === GAME_PHASES.PLACEMENT) return true;
    return isValidMove(selectedPiece, point);
  };

  useEffect(() => {
    if (selectedPiece && currentPlayer === "macan") {
      const available = INTERSECTION_POINTS.filter((point) =>
        isNodeAvailable(point)
      );
      setAvailableNodes(available.map((point) => point.id));
    } else {
      setAvailableNodes([]);
    }
  }, [selectedPiece, currentPlayer, gamePhase]);

  const handlePositionClick = (point) => {
    if (!selectedPiece || currentPlayer !== playerPieceType) return;

    if (isValidMove(selectedPiece, point)) {
      let newPieces = [...board.pieces];
      if (selectedPiece.type === "macan" && selectedPiece.position) {
        const currentPoint = INTERSECTION_POINTS.find(
          (p) => p.id === selectedPiece.position
        );
        const killPaths = validKill.filter(
          (k) => k.tigerPosition === currentPoint.id
        );

        for (const path of killPaths) {
          const villagerPositions =
            path.villagerPositionThatCanBeAttackedByTiger;
          const targetIndex = villagerPositions.findIndex(
            (p) => p === point.id
          );
          if (targetIndex > 0 && targetIndex % 2 === 0) {
            const villagersToCapture = villagerPositions.slice(0, targetIndex);
            const allVillagersPresent = villagersToCapture.every((pos) =>
              board.pieces.some((p) => p.position === pos && p.type === "anak")
            );

            if (allVillagersPresent) {
              newPieces = newPieces.filter(
                (p) => !villagersToCapture.includes(p.position)
              );
              break;
            }
          }
        }
      }

      newPieces = newPieces.map((p) =>
        p.id === selectedPiece.id
          ? { ...p, position: point.id, x: point.x, y: point.y }
          : p
      );
      if (gameOver(newPieces) == 1 && gamePhase != GAME_PHASES.PLACEMENT) {
        popupWord.current = "Tiger Won";
        popupWord2.current = "You Play as " + player;
        setShowPopUp(true);
        console.log("Tiger Won");
      }
      if (gameOver(newPieces) == -1) {
        popupWord.current = "Villager Won";
        popupWord2.current = "You Play as " + player;
        setShowPopUp(true);
        console.log("Villager Won");
      }
      const newBoard = {
        ...board,
        pieces: newPieces,
      };

      setBoard(newBoard);
      setSelectedPiece(null);

      if (gamePhase === GAME_PHASES.PLACEMENT) {
        if (selectedPiece.type === "macan") {
          setPlacedMacanCount((prev) => prev + 1);
        } else {
          setPlacedAnakCount((prev) => prev + 1);
        }
      }

      setCurrentPlayer(currentPlayer === "macan" ? "anak" : "macan");
    }
  };
  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-2xl text-amber-800">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-[2000px] mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          <div className="flex-1 flex items-center justify-center min-h-[900px] bg-amber-50 rounded-xl p-4 shadow-inner">
            <div className="relative w-full h-full flex items-center justify-center">
              <svg
                className="w-full h-full max-w-[1200px]"
                viewBox="0 -20 200 150"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
                }}
              >
                <rect
                  x="0"
                  y="0"
                  width="200"
                  height="150"
                  fill="#f3e4c8"
                  rx="8"
                />
                <defs>
                  <pattern
                    id="macanPattern1"
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                  >
                    <image href="/macan_01.png" width="10" height="10" />
                  </pattern>
                  <pattern
                    id="macanPattern2"
                    patternUnits="userSpaceOnUse"
                    width="10"
                    height="10"
                  >
                    <image href="/macan_02.png" width="10" height="10" />
                  </pattern>
                  {Array(8)
                    .fill()
                    .map((_, i) => (
                      <pattern
                        key={`anakPattern${i + 1}`}
                        id={`anakPattern${i + 1}`}
                        patternUnits="userSpaceOnUse"
                        width="10"
                        height="10"
                      >
                        <image
                          href={`/anak_0${i + 1}.png`}
                          width="10"
                          height="10"
                        />
                      </pattern>
                    ))}
                </defs>
                {VALID_CONNECTIONS.map(([start, end], ind) => {
                  const startPoint = INTERSECTION_POINTS.find(
                    (p) => p.id === start
                  );
                  const endPoint = INTERSECTION_POINTS.find(
                    (p) => p.id === end
                  );
                  return (
                    <line
                      key={ind}
                      x1={startPoint.x}
                      y1={startPoint.y}
                      x2={endPoint.x}
                      y2={endPoint.y}
                      stroke="#8B4513"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  );
                })}
                {INTERSECTION_POINTS.map((point) => {
                  const isAvailable = availableNodes.includes(point.id);
                  const isOccupied = board.pieces.some(
                    (p) => p.position === point.id
                  );

                  return (
                    <g key={point.id}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isAvailable && !isOccupied ? "3.5" : "3"}
                        fill={
                          selectedPiece?.position === point.id
                            ? "#FFD700"
                            : isAvailable
                            ? "#FFF3E0"
                            : "#D7CCC8"
                        }
                        stroke={isAvailable ? "#FF9800" : "#795548"}
                        strokeWidth="1"
                        onClick={() => handlePositionClick(point)}
                        className="transition-all duration-200 ease-in-out cursor-pointer"
                      />
                      <text
                        x={point.x + 3.5}
                        y={point.y - 3}
                        fontSize="3.5"
                        fill="#5D4037"
                        className="select-none"
                      >
                        {point.label}
                      </text>
                    </g>
                  );
                })}

                <rect x="18" y="80" width="25" height="15" fill="#79D7BE" />
                <rect x="40" y="80" width="110" height="15" fill="#FB4141" />
                {board.pieces.map((piece) => (
                  <g
                    key={piece.id}
                    transform={`translate(${piece.x - 6},${piece.y - 6})`}
                    onClick={() => handlePieceClick(piece)}
                    className={`cursor-pointer transition-all duration-200 ${
                      piece.type === currentPlayer
                        ? "opacity-100"
                        : "opacity-70"
                    }`}
                  >
                    {selectedPiece?.id === piece.id && (
                      <circle
                        r="7"
                        cx="6"
                        cy="6"
                        fill="none"
                        stroke="#FFA000"
                        strokeWidth="1.2"
                        strokeDasharray="2,2"
                      />
                    )}
                    <circle
                      r="6"
                      cx="6"
                      cy="6"
                      fill={`url(#${piece.patternId})`}
                      stroke={
                        selectedPiece?.id === piece.id ? "#FFA000" : "#795548"
                      }
                      strokeWidth={selectedPiece?.id === piece.id ? "1.2" : "1"}
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-amber-700 rounded-xl p-8 text-amber-50 shadow-lg">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    Playing as {player}
                  </h2>
                  <div className="inline-block px-6 py-3 bg-amber-600 rounded-lg text-lg">
                    {currentPlayer === "macan"
                      ? "Tiger's Turn"
                      : "Villager's Turn"}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-amber-800/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-3">Game Phase</h3>
                    <p className="text-amber-200 text-lg">
                      {gamePhase === GAME_PHASES.PLACEMENT
                        ? "Piece Placement"
                        : "Movement Phase"}
                    </p>
                  </div>

                  <div className="bg-amber-800/50 p-6 rounded-lg">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white font-serif">
                        Project AI
                      </h2>
                      <p className="mt-2 text-white">
                        Kelas B Tahun 2024-2025
                      </p>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-white">Anggota Kelompok</p>

                      <p className="text-sm text-white">
                        - Michael Setiabudi - 222117045
                      </p>
                      <p className="text-sm text-white">
                        - Kenneth Elliot - 222117040
                      </p>
                      <p className="text-sm text-white">
                        - Yosua Christian - 222117069
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopUp
        showPopUp={showPopUp}
        setShowPopUp={setShowPopUp}
        name={popupWord.current}
        sentence={popupWord2.current}
      />
    </div>
  );
};

export default MacanGame;
