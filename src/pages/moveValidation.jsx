/* eslint-disable no-undef */
// moveValidation.js
export const isValidMove = (piece, currentPoint, targetPoint, board, intersectionPoints) => {
    if (!piece.position) return true; // Penempatan pertama selalu valid
    
    const validMoves = getValidMoves(piece, board, intersectionPoints);
    return validMoves.includes(targetPoint.id);
  };
  
  export const makeMove = (piece, targetPoint, board, intersectionPoints) => {
    let newBoard = { ...board };
    
    // Jika macan memakan anak
    if (piece.type === 'macan' && canMacanEat(piece.position, targetPoint.id, board, intersectionPoints)) {
      newBoard = processMacanEating(piece, targetPoint.id, board, intersectionPoints);
    }
    
    // Update posisi piece
    newBoard = {
      ...newBoard,
      pieces: newBoard.pieces.map(p => 
        p.id === piece.id 
          ? { ...p, position: targetPoint.id, x: targetPoint.x, y: targetPoint.y }
          : p
      )
    };
    
    return newBoard;
  };