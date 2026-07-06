import React, { useState, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { findBestMove } from './chessAI';

type MoveEntry = {
  move: string;
};

const ChessGame: React.FC = () => {
  const gameRef = useRef(new Chess());
  const [position, setPosition] = useState(gameRef.current.fen());
  const [moveHistory, setMoveHistory] = useState<MoveEntry[]>([]);
  const [gameStatus, setGameStatus] = useState('进行中');
  const [isThinking, setIsThinking] = useState(false);

  const getGameStatus = useCallback((chess: Chess): string => {
    if (chess.isCheckmate()) {
      return `将杀！${chess.turn() === 'w' ? '黑方' : '白方'}获胜！`;
    }
    if (chess.isStalemate()) {
      return '和棋（无子可走）！';
    }
    if (chess.isDraw()) {
      return '和棋！';
    }
    if (chess.isCheck()) {
      return '将军！';
    }
    return '进行中';
  }, []);

  const syncState = useCallback(() => {
    setPosition(gameRef.current.fen());
    setGameStatus(getGameStatus(gameRef.current));
  }, [getGameStatus]);

  const makeAIMove = useCallback(() => {
    const chess = gameRef.current;

    if (chess.isGameOver()) {
      setIsThinking(false);
      syncState();
      return;
    }

    // Use Minimax AI to find the best move
    const bestMove = findBestMove(chess, 3); // Depth 3 for reasonable performance
    
    if (bestMove) {
      chess.move(bestMove);
      setMoveHistory(prev => [...prev, { move: bestMove }]);
    }

    setIsThinking(false);
    syncState();
  }, [syncState]);

  function onDrop(sourceSquare: string, targetSquare: string, piece: string): boolean {
    const chess = gameRef.current;

    // 只允许白方走子（玩家）
    if (chess.turn() !== 'w') return false;
    // 游戏结束不允许走子
    if (chess.isGameOver()) return false;
    // AI 正在思考时不允许走子
    if (isThinking) return false;

    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      setMoveHistory(prev => [...prev, { move: move.san }]);
      syncState();

      // 检查游戏是否结束
      if (chess.isGameOver()) {
        return true;
      }

      // AI 走子
      setIsThinking(true);
      setTimeout(makeAIMove, 500);
      return true;
    } catch {
      return false;
    }
  }

  const resetGame = () => {
    gameRef.current = new Chess();
    setPosition(gameRef.current.fen());
    setMoveHistory([]);
    setGameStatus('进行中');
    setIsThinking(false);
  };

  const currentTurn = gameRef.current.turn() === 'w' ? '白方' : '黑方';

  return (
    <div style={{ margin: '20px auto', maxWidth: '600px', padding: '0 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 10 }}>象棋对弈</h2>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Chessboard
          id="ChessBoard"
          position={position}
          onPieceDrop={onDrop}
          boardWidth={560}
          animationDuration={200}
        />
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 'bold' }}>
          状态: {gameStatus} | 轮到: {isThinking ? '黑方思考中...' : currentTurn}
        </p>
        <button
          onClick={resetGame}
          style={{
            padding: '8px 16px',
            fontSize: 14,
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          新游戏
        </button>

        <div style={{ marginTop: 16, textAlign: 'left', maxHeight: 200, overflowY: 'auto' }}>
          <strong>走法记录：</strong>
          <div style={{ marginTop: 4 }}>
            {moveHistory.map((m, i) => (
              <span key={i} style={{ marginRight: 6 }}>
                {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : ''}
                {m.move}{' '}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
