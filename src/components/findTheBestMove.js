// fungsi ini tidak dipakai karena sudah menggunakan findTheBestMove with alpha beta prunning
import { VALID_CONNECTIONS } from "../components/validConnections"
import { validKill, isValidKill } from "../components/validKill"
import { gameOver, allPossibleKillMoveByTiger, allPossibleMoveByTiger, allPossibleMoveByVillager } from "../components/gameOver"
import { INTERSECTION_POINTS } from "../components/Intersection_Points"
import { stateEvaluationBoard } from "../components/stateEvaluationBoard"
// buat macan tok
function findTheBestMoveOri(board, side) {
    let originalBoard = structuredClone(board)
    let bestVal = -Infinity
        // let originaldepth = 3;
    let depth = 3
    let moveVal = 0
    let takenMove = {
        piece: {},
        move: {},
    }
    let allPossibleMovesOrKillByTiger = []
    let allVillagerPieces = board.pieces.filter((e) => e.type == 'anak' && e.position !== null)
    let allTigerPieces = board.pieces.filter((e) => e.type == 'macan')
    let originalPos = ''
    let allKilledVillagersFindTheBestMove = [] // owned by findTheBestMove function
    if (side === 'anak') {
        bestVal = Infinity
        allVillagerPieces.forEach((x, y) => {
            let allAnakPossibleMoves = allPossibleMoveByVillager(structuredClone(board.pieces), x.id)
            allAnakPossibleMoves.forEach((i, j) => {
                originalPos = x.position
                board.pieces.forEach((e) => {
                        if (e === x) {
                            e.position = i
                        }
                    })
                    // extract value from minimax algorithm, if minimax value/score is higher then take the move
                moveVal = minimax(board, depth - 1, true)

                // console.log('position i : ',i,' score : ',moveVal)
                // put the pieces back to it's original location
                board.pieces.forEach((e) => {
                    if (e === x) {
                        e.position = originalPos
                    }
                })
                x.position = originalPos
                if (moveVal < bestVal) {
                    bestVal = moveVal
                    takenMove = {
                            piece: x,
                            move: (INTERSECTION_POINTS.filter((e) => e.id === i))[0],
                        }
                        // console.log('takenMove : ',takenMove)
                }
            })
        })
    } else {
        allTigerPieces.forEach((x, y) => {
            allPossibleMovesOrKillByTiger = [...allPossibleMoveByTiger(board.pieces, y), ...allPossibleKillMoveByTiger(board.pieces, y)]
            console.log('Tiger id : ', x.id, ' Tiger Position : ', x.position, 'allPossibleMovesOrKillByTiger : ', allPossibleKillMoveByTiger(board.pieces, y), 'board : ', board.pieces)
            allPossibleMovesOrKillByTiger.forEach((i, j) => {
                let cloneBoardPiecesFindTheBest = structuredClone(board.pieces)
                let isValidKillTrue = (isValidKill({ id: x.position }, { id: i }, board)).allVillagersPresent
                    // if move is a valid kill, then removed all the killed villagers
                if ((isValidKill({ id: x.position }, { id: i }, board)).allVillagersPresent) {
                    allKilledVillagersFindTheBestMove = (isValidKill({ id: x.position }, { id: i }, board)).allKilledVillagers
                    board.pieces = board.pieces.filter((e) => !allKilledVillagersFindTheBestMove.some((i) => i === e))
                        // console.log("Kill Move, board : ",board,' all killed villagers : ',allKilledVillagersFindTheBestMove)
                }
                // put the pieces to it's designated location
                originalPos = x.position
                board.pieces.forEach((e) => {
                        if (e === x) {
                            e.position = i
                        }
                    })
                    // extract value from minimax algorithm, if minimax value/score is higher then take the move
                moveVal = minimax(board, depth - 1, false)

                // console.log('position i : ',i,' score : ',moveVal)
                // put the pieces back to it's original location
                board.pieces.forEach((e) => {
                    if (e === x) {
                        e.position = originalPos
                    }
                })
                x.position = originalPos
                if (moveVal > bestVal) {
                    bestVal = moveVal
                    takenMove = {
                            piece: x,
                            move: (INTERSECTION_POINTS.filter((e) => e.id === i))[0],
                        }
                        // console.log('takenMove : ',takenMove)
                }
                // if there's any killed villager, then revived the villager for the next minimax scenario
                if (isValidKillTrue) {
                    board.pieces = cloneBoardPiecesFindTheBest
                }

                // console.log('i : ',i,' score : ',moveVal,' tiger : ',x.id, ' board : ',board)
            })
        })
    }


    function minimax(board, depth, is_maximising) {
        let best = Infinity
            // Get the score value of the board state
        let score = stateEvaluationBoard(board, originalBoard, 'macan');
        // if depth has run out then returns the score
        if (depth === 0) {
            return score
        }
        let allTigerPiecesInMinimax = board.pieces.filter((e) => e.type === 'macan') // all tiger piece in this minimax function
        let allVillagerPiecesInMinimax = board.pieces.filter((e) => e.type === 'anak' && e.position !== null) // all villager piece in this minimax function
        let originalVillagerPos = '' // original position of villager piece
        let originalTigerPos = '' // original position of tiger piece
        let allKilledVillagers = [] // owned by minimax function, array containing all killed villagers pieces
            // AI maximizing it's advantage
        if (is_maximising) {
            let prevBest = best
            best = -Infinity
                // exploring all tiger pieces
            allTigerPiecesInMinimax.forEach((x, y) => {
                // look for all possible normal move or kill move for tiger piece
                allPossibleMovesOrKillByTiger = [...allPossibleMoveByTiger(board.pieces, y), ...allPossibleKillMoveByTiger(board.pieces, y, board)]
                    // exploring through all tiger piece's moves
                allPossibleMovesOrKillByTiger.forEach((i, j) => {

                    let isValidKillTrueMinimax = (isValidKill({ id: x.position }, { id: i }, board)).allVillagersPresent
                        // clone the board states
                    let cloneBoardPiecesMinimax = structuredClone(board.pieces)
                        // check if the tiger piece move is a killing move, if yes then removed all killed villagers from the board
                    if ((isValidKill({ id: x.position }, { id: i }, board)).allVillagersPresent) {
                        allKilledVillagers = (isValidKill({ id: x.position }, { id: i }, board)).allKilledVillagers
                            // board.pieces = board.pieces.filter((e)=>!allKilledVillagers.includes(e.position))
                        board.pieces = board.pieces.filter((e) => !allKilledVillagers.some((i) => i === e))
                            // allVillagerPiecesInMinimax = board.pieces.filter((e)=>e.type==='anak')
                    }
                    // changed the tiger piece position based on the looping moves
                    originalTigerPos = x.position
                        // x.position=i
                    board.pieces.forEach((e) => {
                            if (e === x) {
                                e.position = i
                            }
                        })
                        // kill villager if kill move is valid / taken

                    // recursive minimax
                    let moveVal2 = minimax(board, depth - 1, false)
                        // put the tiger piece's position back to it's original position for next minimax scenario/move
                        // x.position=originalTigerPos
                    board.pieces.forEach((e) => {
                            if (e === x) {
                                e.position = originalTigerPos
                            }
                        })
                        // restore all killed villager pieces back to board.pieces for next minimax scenario/move 
                        // if there are any killed villagers
                    if (isValidKillTrueMinimax) {
                        board.pieces = cloneBoardPiecesMinimax
                    }

                    // choose the best value 
                    best = Math.max(best, moveVal2)
                        // prevent best from returning -Infinity value in case depth outnumbered available moves
                    if (best === -Infinity) {
                        best = prevBest
                    }
                    // if (side==='macan') {
                    //     if (depth===originaldepth) {
                    //         if(moveVal2>bestVal){
                    //             bestVal=moveVal2
                    //         }
                    //     }
                    // }

                    return best
                })
            })
        } else {
            // opponent minimizing AI's advantage
            let prevBest = best
            best = Infinity
            allVillagerPiecesInMinimax = board.pieces.filter((e) => e.type === 'anak' && e.position !== null) // all villager pieces in this minimax function
                // console.log('board : ',board.pieces,' allVillagerPiecesInMinimax : ',allVillagerPiecesInMinimax,' depth : ',depth)
            allVillagerPiecesInMinimax.forEach((x, y) => {
                // console.log(' villager pieces x : ',x,'',' allVillagerPiecesInMinimax : ',allVillagerPiecesInMinimax,' depth : ',depth)
                let allVillagerPossibleMoves = allPossibleMoveByVillager(board.pieces, x.id) // all villager piece possible moves
                    // let allVillagerPossibleMoves = allPossibleMoveByVillager(allVillagerPiecesInMinimax,x.id)
                allVillagerPossibleMoves.forEach((i, j) => { // exploring all villager piece possible move
                    originalVillagerPos = x.position
                        // x.position = i
                    board.pieces.forEach((e) => { // change the villager piece position
                        if (e === x) {
                            e.position = i
                        }
                    })
                    let moveVal2 = minimax(board, depth - 1, true) // recursive minimax for deeper scenario

                    // x.position = originalVillagerPos
                    // put the villager piece back to it's original position for next minimax scenario
                    board.pieces.forEach((e) => {
                            if (e === x) {
                                e.position = originalVillagerPos
                            }
                        })
                        // take the worst score to minimize AI advantage
                    best = Math.min(best, moveVal2)
                    if (best === Infinity) {
                        best = prevBest
                    }
                    return best
                })
            })
        }
        return best
    }

    return takenMove
}

function findTheBestPlacement(board, piece) {
    let originalBoard = structuredClone(board)
    let originalPos = ''
    let takenTile = {}
    let bestValue = -Infinity
    let placementValue = 0
    let allEmptyTiles = INTERSECTION_POINTS.filter((e) => !board.pieces.some((x) => x.position === e.id))
    allEmptyTiles.forEach((x, y) => {

        board.pieces.forEach((e) => {
            if (e.id === piece.id) {
                e.position = x.id;
            }
        })
        placementValue = stateEvaluationBoard(board, originalBoard, 'macan')
        board.pieces.forEach((e) => {
            if (e.id === piece.id) {
                e.position = null;
            }
        })
        if (placementValue > bestValue) {
            bestValue = placementValue
            takenTile = x
        }
        // console.log('tile x : ',x.id,' score : ',placementValue)
    })
    return takenTile
}

export { findTheBestMoveOri, findTheBestPlacement }