import { VALID_CONNECTIONS } from "../components/validConnections"
import { validKill, isValidKill } from "../components/validKill"
import { gameOver, allPossibleKillMoveByTiger, allPossibleMoveByTiger, allPossibleMoveByVillager } from "../components/gameOver"
import { INTERSECTION_POINTS } from "../components/Intersection_Points"
import { stateEvaluationBoard } from "./stateEvaluationBoard"

const evaluationCache = new Map();

const validMovesLookup = new Map();
INTERSECTION_POINTS.forEach(point => {
    validMovesLookup.set(point.id, VALID_CONNECTIONS.filter(conn =>
        conn.source === point.id || conn.destination === point.id
    ));
});

function evaluateEscapeRoutes(board, tigerPos) {
    if (!tigerPos) return 0;
    const connections = validMovesLookup.get(tigerPos) || [];
    let escapeScore = 0;
    let surroundingVillagers = 0;
    let escapeRoutes = 0;

    connections.forEach(conn => {
        const checkPos = conn.source === tigerPos ? conn.destination : conn.source;
        const isOccupied = board.pieces.some(p => p.position === checkPos);
        const isVillager = board.pieces.some(p => p.type === 'anak' && p.position === checkPos);

        if (isVillager) {
            surroundingVillagers++;
        } else if (!isOccupied) {
            escapeRoutes++;

            const secondaryConnections = validMovesLookup.get(checkPos) || [];
            const openSecondaryRoutes = secondaryConnections.filter(secConn => {
                const secPos = secConn.source === checkPos ? secConn.destination : secConn.source;
                return !board.pieces.some(p => p.position === secPos);
            }).length;

            escapeScore += openSecondaryRoutes * 5;
        }
    });

    if (surroundingVillagers >= 2 && escapeRoutes <= 2) {
        escapeScore += escapeRoutes * 25;
    }

    return escapeScore;
}

function getPositionKey(board) {
    return board.pieces.map(p => `${p.id}:${p.position}`).sort().join('|');
}

function findTheBestMove(board, side) {
    evaluationCache.clear();
    let originalBoard = structuredClone(board);
    let bestVal = -Infinity;
    let depth = 5;
    let takenMove = {
        piece: {},
        move: {},
    };

    function evaluateKillChain(board, tigerPos, move) {
        const cacheKey = `kill_${tigerPos}_${move}_${getPositionKey(board)}`;
        if (evaluationCache.has(cacheKey)) {
            return evaluationCache.get(cacheKey);
        }

        let score = 0;
        let currentBoard = structuredClone(board);
        let killInfo = isValidKill({ id: tigerPos }, { id: move }, currentBoard);

        if (killInfo.allVillagersPresent) {
            score += 30;

            currentBoard.pieces = currentBoard.pieces.filter(p =>
                !killInfo.allKilledVillagers.some(v => v === p)
            );

            let tiger = currentBoard.pieces.find(p =>
                p.type === 'macan' && p.position === tigerPos
            );

            if (tiger) {
                tiger.position = move;
                let nextKills = allPossibleKillMoveByTiger(currentBoard.pieces, 0, currentBoard);
                let escapeValue = evaluateEscapeRoutes(currentBoard, move);

                if (nextKills.length > 0) {
                    score += 40 * Math.min(nextKills.length, 3);
                }
                score += escapeValue;
            }
        }

        evaluationCache.set(cacheKey, score);
        return score;
    }

    function findEmergencyMove(tiger) {
        if (!tiger || !tiger.position) return null;

        let allPossibleMoves = VALID_CONNECTIONS.filter(conn =>
            conn.source === tiger.position || conn.destination === tiger.position
        ).map(conn => conn.source === tiger.position ? conn.destination : conn.source);

        let availableMoves = allPossibleMoves.filter(movePos =>
            !board.pieces.some(p => p.position === movePos)
        );
        console.log("all Possible Moves Emergency Moves : ", allPossibleMoves, ' valid Con : ', availableMoves)
        if (availableMoves.length > 0) {
            return {
                piece: tiger,
                move: INTERSECTION_POINTS.find(p => p.id === availableMoves[0])
            };
        }

        return null;
    }

    function isThreatened(villager, board) {
        let tigerPositions = board.pieces.filter(p => p.type === 'macan').map(p => p.position);
        for (let tigerPos of tigerPositions) {
            if (isValidKill({ id: tigerPos }, { id: villager.position }, board).allVillagersPresent) {
                return true;
            }
        }
        return false;
    }

    function evaluateSurrounding(board, tigerPos) {
        if (!tigerPos) return 0;

        const connections = validMovesLookup.get(tigerPos) || [];
        let surroundingVillagers = 0;
        let possibleMoves = 0;

        connections.forEach(conn => {
            const checkPos = conn.source === tigerPos ? conn.destination : conn.source;
            if (board.pieces.some(p => p.type === 'anak' && p.position === checkPos)) {
                surroundingVillagers++;
            } else {
                possibleMoves++;
            }
        });

        let score = 0;
        if (surroundingVillagers >= 3 && possibleMoves === 0) {
            score += 100;
        } else if (surroundingVillagers >= 2 && possibleMoves <= 1) {
            score += 50;
        }

        return score;
    }

    function minimax(board, depth, is_maximising, alpha = -Infinity, beta = Infinity) {
        let checkDepthTooBig = 'yes'
        const positionKey = `${depth}_${is_maximising}_${getPositionKey(board)}`;
        if (evaluationCache.has(positionKey)) {
            return evaluationCache.get(positionKey);
        }
        const evaluation = stateEvaluationBoard(board, originalBoard, 'macan');
        if (depth === 0) {

            evaluationCache.set(positionKey, evaluation);
            return evaluation;
        }

        if (is_maximising) {
            let best = -Infinity;
            let allTigerPieces = board.pieces.filter(e => e.type === 'macan');

            for (let tiger of allTigerPieces) {
                let killMoves = allPossibleKillMoveByTiger(board.pieces, 0, board);
                let normalMoves = killMoves.length ? [] : allPossibleMoveByTiger(board.pieces, 0);
                let moves = [...killMoves, ...normalMoves];
                if (moves.length !== 0) checkDepthTooBig = 'no'
                for (let move of moves) {
                    let boardCopy = structuredClone(board);
                    let tigerCopy = boardCopy.pieces.find(p => p.id === tiger.id);
                    let originalPos = tiger.position;

                    let killInfo = isValidKill({ id: originalPos }, { id: move }, board);
                    if (killInfo.allVillagersPresent) {
                        boardCopy.pieces = boardCopy.pieces.filter(
                            p => !killInfo.allKilledVillagers.some(v => v === p)
                        );
                    }

                    tigerCopy.position = move;

                    let moveVal = minimax(boardCopy, depth - 1, false, alpha, beta);
                    moveVal += evaluateKillChain(board, originalPos, move);
                    moveVal += evaluateSurrounding(board, originalPos);

                    best = Math.max(best, moveVal);
                    alpha = Math.max(alpha, best);

                    if (beta <= alpha) break;
                }
            }
            evaluationCache.set(positionKey, best);
            if (checkDepthTooBig === 'yes') {
                return evaluation
            }
            return best;
        } else {
            let best = Infinity;
            let allVillagers = board.pieces.filter(p => p.type === 'anak' && p.position !== null);
            allVillagers.sort((a, b) => {
                const scoreA = evaluateSurrounding(board, a.position);
                const scoreB = evaluateSurrounding(board, b.position);
                return scoreB - scoreA;
            });

            for (let villager of allVillagers) {
                let moves = allPossibleMoveByVillager(board.pieces, villager.id);

                for (let move of moves) {
                    let boardCopy = structuredClone(board);
                    let villagerCopy = boardCopy.pieces.find(p => p.id === villager.id);
                    villagerCopy.position = move;

                    let e = minimax(boardCopy, depth - 1, true, alpha, beta);
                    best = Math.min(best, e);
                    beta = Math.min(beta, best);

                    if (beta <= alpha) break;
                }
            }
            evaluationCache.set(positionKey, best);
            if (best === Infinity) {
                return evaluation
            }
            return best;
        }
    }

    if (side === 'anak') {
        bestVal = Infinity;
        let allVillPieces = board.pieces.filter((e) => e.type === 'anak');
        let prioritizedMoves = new Map();
        let threatenedVillagers = [];
        for (let villager of allVillPieces) {
            if (isThreatened(villager, board)) {
                threatenedVillagers.push(villager);
            }
        }

        if (threatenedVillagers.length > 0) {
            for (let villager of threatenedVillagers) {
                let moves = allPossibleMoveByVillager(board.pieces, villager.id);

                for (let move of moves) {
                    let boardCopy = structuredClone(board);
                    let villagerCopy = boardCopy.pieces.find(p => p.id === villager.id);
                    let originalPos = villager.position;

                    if (!originalPos || !move) continue;

                    villagerCopy.position = move;

                    let baseVal = minimax(boardCopy, depth - 1, true);
                    let surroundingBonus = evaluateSurrounding(boardCopy, originalPos);
                    let moveVal = baseVal + surroundingBonus;

                    if (moveVal === Infinity) moveVal = 1000;

                    prioritizedMoves.set(move, {
                        value: moveVal,
                        piece: villager,
                        move: INTERSECTION_POINTS.find(p => p.id === move)
                    });
                }
            }
        } else {
            for (let [idx, villager] of allVillPieces.entries()) {
                let moves = allPossibleMoveByVillager(board.pieces, villager.id);

                for (let move of moves) {
                    let boardCopy = structuredClone(board);
                    let villagerCopy = boardCopy.pieces.find(p => p.id === villager.id);
                    let originalPos = villager.position;

                    if (!originalPos || !move) continue;

                    villagerCopy.position = move;

                    let baseVal = minimax(boardCopy, depth - 1, true);
                    let surroundingBonus = evaluateSurrounding(boardCopy, originalPos);
                    let moveVal = baseVal + surroundingBonus;

                    if (moveVal === Infinity) moveVal = 1000;

                    prioritizedMoves.set(move, {
                        value: moveVal,
                        piece: villager,
                        move: INTERSECTION_POINTS.find(p => p.id === move)
                    });
                }
            }
        }

        for (let [_, moveInfo] of prioritizedMoves) {
            if (moveInfo.value < bestVal) {
                bestVal = moveInfo.value;
                takenMove = {
                    piece: moveInfo.piece,
                    move: moveInfo.move
                };
            }
        }

        return takenMove;
    }

    let allTigerPieces = board.pieces.filter((e) => e.type === 'macan');
    let prioritizedMoves = new Map();
    let movesCollection = [];

    for (let [idx, tiger] of allTigerPieces.entries()) {
        let killMoves = allPossibleKillMoveByTiger(board.pieces, idx, board);
        let normalMoves = killMoves.length ? [] : allPossibleMoveByTiger(board.pieces, idx);
        let moves = [...killMoves, ...normalMoves];

        for (let move of moves) {
            let boardCopy = structuredClone(board);
            let tigerCopy = boardCopy.pieces.find(p => p.id === tiger.id);
            let originalPos = tiger.position;

            if (!originalPos || !move) continue;

            let killInfo = isValidKill({ id: originalPos }, { id: move }, board);
            if (killInfo.allVillagersPresent) {
                boardCopy.pieces = boardCopy.pieces.filter(
                    p => !killInfo.allKilledVillagers.some(v => v === p)
                );
            }

            tigerCopy.position = move;

            let baseVal = minimax(boardCopy, depth - 1, false);
            let killChainBonus = evaluateKillChain(board, originalPos, move);
            let surroundingBonus = evaluateSurrounding(board, originalPos);
            let moveVal = baseVal + killChainBonus + surroundingBonus;

            if (moveVal === -Infinity) moveVal = -1000;

            movesCollection.push({ move: INTERSECTION_POINTS.find(p => p.id === move), value: moveVal, piece: tiger });
            prioritizedMoves.set(move, {
                value: moveVal,
                piece: tiger,
                move: INTERSECTION_POINTS.find(p => p.id === move)
            });
        }
    }

    movesCollection.forEach((moveInfo) => {
        if (moveInfo.value > bestVal) {
            bestVal = moveInfo.value;
            takenMove = {
                piece: moveInfo.piece,
                move: moveInfo.move
            };
        }
    });

    return takenMove;
}

function findTheBestPlacement(board, piece, side) {
    let originalBoard = structuredClone(board);
    let bestValue = -Infinity;
    if (side === 'anak') {
        bestValue = Infinity
    }
    let takenTile = {};

    let allEmptyTiles = INTERSECTION_POINTS.filter(e =>
        !board.pieces.some(x => x.position === e.id)
    );

    allEmptyTiles.sort((a, b) => {
        const aConnections = (validMovesLookup.get(a.id) || []).length;
        const bConnections = (validMovesLookup.get(b.id) || []).length;
        return bConnections - aConnections;
    });

    for (let tile of allEmptyTiles) {
        let boardCopy = structuredClone(board);
        let pieceCopy = boardCopy.pieces.find(e => e.id === piece.id);
        pieceCopy.position = tile.id;

        let placementValue = stateEvaluationBoard(boardCopy, originalBoard, 'macan');
        if (side === 'macan') {
            if (placementValue > bestValue) {
                bestValue = placementValue;
                takenTile = tile;
            }
        } else {
            if (placementValue < bestValue) {
                bestValue = placementValue;
                takenTile = tile;
            }
        }

    }

    return takenTile;
}

export { findTheBestMove, findTheBestPlacement };