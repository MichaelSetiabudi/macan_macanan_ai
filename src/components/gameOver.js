import { VALID_CONNECTIONS } from "../components/validConnections"
import { validKill, isValidKill } from "../components/validKill"

function allPossibleMoveByVillager(newPieces, villagerId) {


    let allVillagerPieces = newPieces.filter((e) => e.type === 'anak' && e.id === villagerId && e.position !== null)

    let allVillagerPossibleMoves_Raw = VALID_CONNECTIONS.filter((e) => e.includes(allVillagerPieces[0].position))
    let allVillagerPossibleMoves = allVillagerPossibleMoves_Raw.flat().filter((e) => e !== allVillagerPieces[0].position)
    let furtherFilteredMoves = allVillagerPossibleMoves.filter((e) => !newPieces.some((i) => i.position === e))
    return furtherFilteredMoves
}

function allPossibleMoveByTiger(newPieces, tigerId) {
    let allTigerPieces = newPieces.filter((e) => e.type === "macan")
    let allTiger1PossibleMoves_Raw = VALID_CONNECTIONS.filter((e) => e.includes(allTigerPieces[tigerId].position))
    let allTiger1PossibleMoves = allTiger1PossibleMoves_Raw.flat().filter(value => value !== allTigerPieces[tigerId].position);
    let allTiger1PossibleMoves_final = allTiger1PossibleMoves.filter((e) => newPieces.some((i) => i.position === e) === false)
    return allTiger1PossibleMoves_final
}

function allPossibleKillMoveByTiger(newPieces, tigerId) {
    let board = {
        pieces: newPieces
    }
    let allTigerPieces = newPieces.filter((e) => e.type === "macan")
    let allTiger1PossibleKill_Raw = validKill.filter((e) => e.tigerPosition == allTigerPieces[tigerId].position)

    let allPossibleKillMoves = []
    allTiger1PossibleKill_Raw.forEach((x) => {
        x.villagerPositionThatCanBeAttackedByTiger.forEach((y) => {
            let canKill = isValidKill({ id: allTigerPieces[tigerId].position }, { id: y }, board)

            if (canKill.allVillagersPresent) {
                allPossibleKillMoves.push(y)
            }
        })
    })
    return allPossibleKillMoves
}

function gameOver(newPieces) {
    let board = {
        pieces: newPieces
    }
    let allVillagerPieces = newPieces.filter((e) => e.type === "anak")
    if (allVillagerPieces.length <= 2) {
        return 1;
    }

    let allTigerPieces = newPieces.filter((e) => e.type === "macan")

    let allTiger1PossibleMoves = allPossibleMoveByTiger(newPieces, 0)
    let allPiecesAsideTiger1 = newPieces.filter((e) => e.id !== 'macan_1')
    let checkIfTiger1MetDeadEnd = allTiger1PossibleMoves.every((e) => allPiecesAsideTiger1.some((i) => i.position === e))

    let allTiger1PossibleKill_Raw = validKill.filter((e) => e.tigerPosition == allTigerPieces[0].position)
    let checkIfTiger1CanKill = allTiger1PossibleKill_Raw.some((e) => e.villagerPositionThatCanBeAttackedByTiger.some((i) => (isValidKill({ id: allTigerPieces[0].position }, { id: i }, board)).allVillagersPresent))
    if (checkIfTiger1MetDeadEnd === true && checkIfTiger1CanKill === false) {
        // console.log(allTigerPieces)
        // console.log("Tiger1 is stuck")
    }

    let allTiger2PossibleMoves = allPossibleMoveByTiger(newPieces, 1)
    let allPiecesAsideTiger2 = newPieces.filter((e) => e.id !== 'macan_1')
    let checkIfTiger2MetDeadEnd = allTiger2PossibleMoves.every((e) => allPiecesAsideTiger2.some((i) => i.position === e))

    let allTiger2PossibleKill_Raw = validKill.filter((e) => e.tigerPosition == allTigerPieces[1].position)
    let checkIfTiger2CanKill = allTiger2PossibleKill_Raw.some((e) => e.villagerPositionThatCanBeAttackedByTiger.some((i) => (isValidKill({ id: allTigerPieces[1].position }, { id: i }, board)).allVillagersPresent))

    if (checkIfTiger2MetDeadEnd === true && checkIfTiger2CanKill === false) {
        // console.log(allTigerPieces)
        // console.log("Tiger2 is stuck")
    }

    if (checkIfTiger1MetDeadEnd === true && checkIfTiger1CanKill === false && checkIfTiger2MetDeadEnd === true && checkIfTiger2CanKill === false) {
        return -1;
    }

    return 0;
}

let a = [
    ['a', 'b'],
    ['v', 'a'],
    ['e', 'a']
]

export { gameOver, allPossibleKillMoveByTiger, allPossibleMoveByTiger, allPossibleMoveByVillager }