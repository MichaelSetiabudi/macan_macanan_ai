export const GAME_STATUS = {
    PLAYING: 'playing',
    MACAN_WINS: 'macan_wins',
    ANAK_WINS: 'anak_wins'
  };
  
  export const canMacanEat = (macanPos, targetPos, board, intersectionPoints) => {
    if (!macanPos || !targetPos) return false;
    
    const currentPoint = intersectionPoints.find(p => p.id === macanPos);
    const targetPoint = intersectionPoints.find(p => p.id === targetPos);
    
    if (!currentPoint || !targetPoint) return false;
  
    const dx = Math.abs(targetPoint.x - currentPoint.x);
    const dy = Math.abs(targetPoint.y - currentPoint.y);
  
    // Harus bergerak dua langkah
    if (!((dx === 180 && dy === 0) || (dx === 0 && dy === 180) || (dx === 180 && dy === 180))) {
      return false;
    }
  
    // Hitung posisi tengah
    const midX = (currentPoint.x + targetPoint.x) / 2;
    const midY = (currentPoint.y + targetPoint.y) / 2;
    
    // Cari titik persimpangan di tengah
    const midPoint = intersectionPoints.find(p => 
      Math.abs(p.x - midX) < 1 && Math.abs(p.y - midY) < 1
    );
    
    if (!midPoint) return false;
    
    // Cek apakah ada anak di tengah
    const childInMiddle = board.pieces.find(p => 
      p.type === 'anak' && p.position === midPoint.id
    );
    
    // Cek apakah posisi target kosong
    const targetOccupied = board.pieces.some(p => p.position === targetPoint.id);
    
    return !!childInMiddle && !targetOccupied;
  };
  
  export const getValidMoves = (piece, board, intersectionPoints) => {
    if (!piece.position) {
      // Untuk penempatan awal, filter posisi yang sudah ditempati
      return intersectionPoints.filter(point => 
        !board.pieces.some(p => p.position === point.id)
      ).map(p => p.id);
    }
  
    const currentPoint = intersectionPoints.find(p => p.id === piece.position);
    const validMoves = [];
  
    intersectionPoints.forEach(target => {
      const dx = Math.abs(target.x - currentPoint.x);
      const dy = Math.abs(target.y - currentPoint.y);
      
      // Gerakan normal satu langkah
      const isNormalMove = (
        ((dx === 90 || dx === 80) && dy === 0) ||
        (dx === 0 && (dy === 90 || dy === 80)) ||
        ((dx === 90 || dx === 80) && (dy === 90 || dy === 80))
      );
      
      // Cek apakah posisi target sudah ditempati
      const isOccupied = board.pieces.some(p => p.position === target.id);
      
      if (isNormalMove && !isOccupied) {
        validMoves.push(target.id);
      }
      
      // Khusus untuk macan, cek gerakan makan
      if (piece.type === 'macan') {
        if (canMacanEat(piece.position, target.id, board, intersectionPoints)) {
          validMoves.push(target.id);
        }
      }
    });
  
    return validMoves;
  };
  
  export const checkWinCondition = (board, intersectionPoints) => {
    const placedAnakPieces = board.pieces.filter(p => p.type === 'anak' && p.position);
    const placedMacanPieces = board.pieces.filter(p => p.type === 'macan' && p.position);
    
    // Macan menang jika anak tersisa <= 3
    if (placedAnakPieces.length <= 3) {
      return GAME_STATUS.MACAN_WINS;
    }
    
    // Cek apakah macan terjebak (tidak bisa bergerak)
    const macanCanMove = placedMacanPieces.some(macan => {
      const validMoves = getValidMoves(macan, board, intersectionPoints);
      return validMoves.length > 0;
    });
    
    if (!macanCanMove && placedMacanPieces.length === 2) {
      return GAME_STATUS.ANAK_WINS;
    }
    
    return GAME_STATUS.PLAYING;
  };
  
  export const isValidMove = (piece, targetPoint, board, intersectionPoints) => {
    const validMoves = getValidMoves(piece, board, intersectionPoints);
    return validMoves.includes(targetPoint.id);
  };
  
  export const makeMove = (piece, targetPoint, board, intersectionPoints) => {
    let newBoard = { ...board };
    
    if (piece.type === 'macan' && piece.position) {
      if (canMacanEat(piece.position, targetPoint.id, board, intersectionPoints)) {
        // Hitung posisi tengah untuk menghapus anak yang dimakan
        const currentPoint = intersectionPoints.find(p => p.id === piece.position);
        const midX = (currentPoint.x + targetPoint.x) / 2;
        const midY = (currentPoint.y + targetPoint.y) / 2;
        const midPoint = intersectionPoints.find(p => 
          Math.abs(p.x - midX) < 1 && Math.abs(p.y - midY) < 1
        );
  
        // Hapus anak yang dimakan
        newBoard = {
          ...newBoard,
          pieces: newBoard.pieces.filter(p => 
            !(p.type === 'anak' && p.position === midPoint.id)
          )
        };
      }
    }
    
    // Update posisi piece
    return {
      ...newBoard,
      pieces: newBoard.pieces.map(p => 
        p.id === piece.id 
          ? { ...p, position: targetPoint.id, x: targetPoint.x, y: targetPoint.y }
          : p
      )
    };
  };