import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import './ChessGame.css';

type GameHistory = {
  fen: string;
  move: string;
}[];

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<GameHistory>([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState('Ongoing');

  // Update game status
  const updateGameStatus = useCallback((currentGame = game) => {
    if (currentGame.isCheckmate()) {
      setGameStatus(`Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins!`);
    } else if (currentGame.isDraw()) {
      setGameStatus('Draw!');
    } else if (currentGame.isCheck()) {
      setGameStatus('Check!');
    } else {
      setGameStatus('Ongoing');
    }
  }, [game]);

  // Make a random move for the AI
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const makeRandomMove = useCallback(() => {
    const possibleMoves = game.moves();
    
    // Exit if the game is over
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
      updateGameStatus();
      return;
    }

    // Pick a random move
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];
    
    // Make the move
    const gameCopy = new Chess(game.fen());
    gameCopy.move(move);
    
    // Update state
    setGame(gameCopy);
    setMoveHistory([...moveHistory, { fen: gameCopy.fen(), move }]);
    setIsWhiteTurn(true);
    updateGameStatus(gameCopy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, moveHistory]);


  // Handle piece movement
  function onDrop(sourceSquare: string, targetSquare: string) {
    if (!isWhiteTurn) return false;
    if (gameStatus !== 'Ongoing' && !gameStatus.includes('Check')) return false;

    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // Always promote to queen for simplicity
      } as any);

      // If invalid move, return false
      if (move === null) return false;

      // Update state
      setGame(gameCopy);
      setMoveHistory([...moveHistory, { fen: gameCopy.fen(), move: `${move.from}-${move.to}` }]);
      setIsWhiteTurn(false);
      updateGameStatus(gameCopy);

      // AI makes a move after a short delay
      setTimeout(makeRandomMove, 300);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Reset the game
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setIsWhiteTurn(true);
    setGameStatus('Ongoing');
  };

  // Undo the last move
  const undoMove = () => {
    if (moveHistory.length < 1) return;
    
    // Remove the last two moves (player move and AI move)
    const history = [...moveHistory];
    const newHistory = history.slice(0, -2);
    
    // Update game state
    const newGame = new Chess();
    if (newHistory.length > 0) {
      newGame.load(newHistory[newHistory.length - 1].fen);
    }
    
    setGame(newGame);
    setMoveHistory(newHistory);
    setIsWhiteTurn(newHistory.length % 2 === 0);
    updateGameStatus(newGame);
  };

  // Calculate board width based on viewport
  const boardWidth = useMemo(() => {
    const width = typeof window !== 'undefined' ? Math.min(window.innerWidth - 40, 600) : 600;
    return width;
  }, []);

  // Get the current FEN position
  const fen = game.fen();

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      // This will trigger a re-render with the new width
      setGame(new Chess(game.fen()));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [game]);

  return (
    <div className="chess-game">
      <div className="game-container">
        <div className="chessboard-container">
          <div style={{ width: boardWidth, height: boardWidth }}>
            <Chessboard 
              position={fen}
              onPieceDrop={onDrop}
              boardWidth={boardWidth}
              boardOrientation="white"
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}
              customDarkSquareStyle={{ backgroundColor: '#779556' }}
              customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
            />
          </div>
        </div>
        
        <div className="game-info">
          <h2>Chess Game</h2>
          <div className="status">
            <p>Status: <strong>{gameStatus}</strong></p>
            <p>Turn: <strong>{isWhiteTurn ? 'White' : 'Black'}</strong></p>
          </div>
          
          <div className="controls">
            <button onClick={resetGame} className="control-btn">New Game</button>
            <button onClick={undoMove} disabled={moveHistory.length === 0} className="control-btn">
              Undo Move
            </button>
          </div>
          
          <div className="move-history">
            <h3>Move History</h3>
            <div className="moves">
              {moveHistory.map((move, i) => (
                <div key={i} className="move">
                  {i % 2 === 0 ? `${i/2 + 1}.` : ''} {move.move}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
