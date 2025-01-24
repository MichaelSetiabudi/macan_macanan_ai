import { gameOver, allPossibleKillMoveByTiger, allPossibleMoveByTiger } from "./gameOver";

function stateEvaluationBoard(board, originalBoard, side) {
    let score = 0;
    let allTigerPieces = board.pieces.filter((e) => e.type === 'macan');

    // Base winning/losing conditions
    if (gameOver(board.pieces) === 1) return 1000; // Tiger wins
    if (gameOver(board.pieces) === -1 && allTigerPieces.every((e) => e.position !== null)) return -1000; // Tiger loses

    // Piece advantage evaluation
    const capturedPieces = originalBoard.pieces.length - board.pieces.length;
    if (capturedPieces !== 0) {
        score += 30 * capturedPieces;
        return score
    }

    // Evaluate kill threats
    const tiger0Kills = allPossibleKillMoveByTiger(board.pieces, 0, board).length;
    const tiger1Kills = allPossibleKillMoveByTiger(board.pieces, 1, board).length;
    score += tiger0Kills * 12; // Increased from 10
    score += tiger1Kills * 12; // Increased from 10
    // if (score>=12) {
    //     return score
    // }
    // Positional evaluation
    for (const tiger of allTigerPieces) {
        if (!tiger.position) continue;

        // Central control (C13)
        if (tiger.position === 'C13') {
            score += 8; // Increased from 5
        }

        // Strong diagonal positions
        if (['C9', 'C19', 'C7', 'C17'].includes(tiger.position)) {
            score += 6; // Increased from 4
        }

        // Corner control
        if (['C3', 'C23'].includes(tiger.position)) {
            score += 5; // Increased from 3
        }

        // Mobility evaluation
        const tigerMoves = allPossibleMoveByTiger(board.pieces, tiger === allTigerPieces[0] ? 0 : 1).length;
        score += tigerMoves * 2; // New: reward having more possible moves

        // Defensive positioning
        if (isDefensivePosition(tiger.position, board.pieces)) {
            score += 4; // New: reward positions that protect against trapping
        }
    }

    // Territory control evaluation
    score += evaluateTerritory(board.pieces);

    // Tiger cooperation bonus
    if (areTigersCooperating(allTigerPieces)) {
        score += 7; // New: reward tigers that support each other
    }

    // Penalty for trapped tigers
    for (let i = 0; i < allTigerPieces.length; i++) {
        const moves = allPossibleMoveByTiger(board.pieces, i);
        const kills = allPossibleKillMoveByTiger(board.pieces, i, board);
        if (moves.length === 0 && kills.length === 0) {
            score -= 15; // Increased penalty for trapped tigers
        }
    }

    return score;
}

// Helper function to check if a position is defensive
function isDefensivePosition(position, pieces) {
    // Positions that have good escape routes and are hard to trap
    const defensivePositions = ['C8', 'C12', 'C14', 'C18', 'C13'];
    return defensivePositions.includes(position);
}

// Helper function to evaluate territory control
function evaluateTerritory(pieces) {
    let score = 0;
    const tigerPieces = pieces.filter(p => p.type === 'macan');

    // Define key territories
    const territories = {
        center: ['C13', 'C12', 'C14'],
        topHalf: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
        bottomHalf: ['C16', 'C17', 'C18', 'C19', 'C20', 'C21', 'C22', 'C23', 'C24', 'C25']
    };

    // Score control of different territories
    for (const tiger of tigerPieces) {
        if (!tiger.position) continue;

        if (territories.center.includes(tiger.position)) {
            score += 5; // Control of center is valuable
        }
        if (territories.topHalf.includes(tiger.position)) {
            score += 3; // Control of either half is good
        }
        if (territories.bottomHalf.includes(tiger.position)) {
            score += 3;
        }
    }

    return score;
}

// Helper function to check if tigers are cooperating
function areTigersCooperating(tigers) {
    if (tigers.length !== 2) return false;
    if (!tigers[0].position || !tigers[1].position) return false;

    // Define adjacent positions that are considered cooperative
    const cooperativeDistance = 2; // Adjust this value as needed

    // Simple distance check (can be improved with actual path finding)
    const pos1 = tigers[0].position;
    const pos2 = tigers[1].position;

    // If tigers are within supporting distance of each other
    if (arePositionsClose(pos1, pos2, cooperativeDistance)) {
        return true;
    }

    return false;
}

// Helper function to check if positions are close
function arePositionsClose(pos1, pos2, maxDistance) {
    // This is a simplified version - you would need to implement actual distance calculation
    // based on your board layout and valid movement paths
    const letter1 = pos1.charAt(0);
    const number1 = parseInt(pos1.slice(1));
    const letter2 = pos2.charAt(0);
    const number2 = parseInt(pos2.slice(1));

    const letterDiff = Math.abs(letter1.charCodeAt(0) - letter2.charCodeAt(0));
    const numberDiff = Math.abs(number1 - number2);

    return letterDiff + numberDiff <= maxDistance;
}

export { stateEvaluationBoard };