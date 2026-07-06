import React, { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

type GameHistory = {
  fen: string;
  move: string;
}[];

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<GameHistory>([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('Ongoing');

  const updateGameStatus = (currentGame: Chess) => {
    if (currentGame.isCheckmate()) {
      setGameStatus(`Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (currentGame.isDraw()) {
      setGameStatus('Draw!');
    } else if (currentGame.isCheck()) {
      setGameStatus('Check!');
    } else {
      setGameStatus('Ongoing');
    }
  };

  const makeRandomMove = useCallback(() => {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];

    const gameCopy = new Chess(game.fen());
    gameCopy.move(move);

    setGame(gameCopy);
    setMoveHistory(prev => [...prev, { fen: gameCopy.fen(), move }]);
    setIsWhiteTurn(true);
    updateGameStatus(gameCopy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  function onDrop(sourceSquare: string, targetSquare: string): boolean {
    if (!isWhiteTurn) return false;
    if (gameStatus !== 'Ongoing' && !gameStatus.includes('Check')) return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      setGame(gameCopy);
      setMoveHistory(prev => [...prev, { fen: gameCopy.fen(), move: `${move.from}-${move.to}` }]);
      setIsWhiteTurn(false);
      updateGameStatus(gameCopy);

      setTimeout(makeRandomMove, 300);
      return true;
    } catch (e) {
      return false;
    }
  }

  const resetGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setIsWhiteTurn(true);
    setGameStatus('Ongoing');
  };

  return (
    <div style={{ margin: '20px auto', width: '560px' }}>
      <Chessboard
        id="BasicBoard"
        position={game.fen()}
        onPieceDrop={onDrop}
        boardWidth={560}
      />
      <div style={{ marginTop: 20 }}>
        <p>Status: {gameStatus} | Turn: {isWhiteTurn ? 'White' : 'Black'}</p>
        <button onClick={resetGame}>New Game</button>
        <div style={{ marginTop: 10 }}>
          {moveHistory.map((m, i) => (
            <span key={i} style={{ marginRight: 8 }}>
              {i % 2 === 0 ? `${Math.floor(i/2)+1}.` : ''}{m.move}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
