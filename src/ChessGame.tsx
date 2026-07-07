// import React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { findBestMove } from './chessAI';
import { CHESS_POSITIONS } from './positions';
import { useLanguage } from './i18n/LanguageContext';
import { Language } from './i18n';
import { saveGameToHistory, getGameHistory, GameRecord } from './gameHistory';

type MoveEntry = {
  move: string;
};

const ChessGame: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const gameRef = useRef(new Chess());
  const [position, setPosition] = useState(gameRef.current.fen());
  const [moveHistory, setMoveHistory] = useState<MoveEntry[]>([]);
  const [gameStatus, setGameStatus] = useState(t('inProgress'));
  const [isThinking, setIsThinking] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
  const [selectedHistoryGame, setSelectedHistoryGame] = useState<string | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  // Load game history on mount
  useEffect(() => {
    setGameHistory(getGameHistory());
  }, []);

  const getGameStatus = useCallback((chess: Chess): string => {
    if (chess.isCheckmate()) {
      return `${t('checkmate')} ${chess.turn() === 'w' ? t('black') : t('white')}`;
    }
    if (chess.isStalemate()) {
      return t('stalemate');
    }
    if (chess.isDraw()) {
      return t('draw');
    }
    if (chess.isCheck()) {
      return t('check');
    }
    return t('inProgress');
  }, [t]);

  const syncState = useCallback(() => {
    setPosition(gameRef.current.fen());
    setGameStatus(getGameStatus(gameRef.current));
    
    // Check if game just ended and save to history
    const chess = gameRef.current;
    if (chess.isGameOver() && !gameEnded && moveHistory.length > 0) {
      const record: GameRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        result: getGameStatus(chess),
        moves: moveHistory.map(m => m.move),
        finalFen: chess.fen(),
        startPosition: selectedPosition
      };
      saveGameToHistory(record);
      setGameHistory(getGameHistory());
      setGameEnded(true);
    }
  }, [getGameStatus, gameEnded, moveHistory, selectedPosition]);

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

  function onDrop(sourceSquare: string, targetSquare: string, _piece: string): boolean {
    const chess = gameRef.current;

    // Only w can move - player
    if (chess.turn() !== 'w') return false;
    // No moving on GameOver
    if (chess.isGameOver()) return false;
    // No moving on AI thinking
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

      if (chess.isGameOver()) {
        return true;
      }

      // AI moving
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
    setGameStatus(t('inProgress'));
    setIsThinking(false);
    setSelectedPosition(null);
    setGameEnded(false);
    setSelectedHistoryGame(null);
  };

  const loadPosition = (fen: string, positionName: string) => {
    try {
      const chess = new Chess(fen);
      gameRef.current = chess;
      setPosition(fen);
      setMoveHistory([]);
      setGameStatus(getGameStatus(chess));
      setIsThinking(false);
      setSelectedPosition(positionName);
      setGameEnded(false);
      setSelectedHistoryGame(null);
    } catch (error) {
      console.error('Invalid FEN:', error);
    }
  };

  const loadGameFromHistory = (gameId: string) => {
    const game = gameHistory.find(g => g.id === gameId);
    if (!game) return;

    try {
      const chess = new Chess();
      const validMoves: string[] = [];
      
      // Load all moves
      for (const move of game.moves) {
        const result = chess.move(move);
        if (result === null) {
          console.error(`Invalid move in history: ${move}`);
          // Skip invalid moves
          continue;
        }
        validMoves.push(move);
      }
      
      gameRef.current = chess;
      setPosition(chess.fen());
      setMoveHistory(validMoves.map(move => ({ move })));
      setGameStatus(getGameStatus(chess));
      setIsThinking(false);
      setSelectedPosition(game.startPosition);
      setGameEnded(true);
      setSelectedHistoryGame(gameId);
    } catch (error) {
      console.error('Failed to load game from history:', error);
    }
  };

  const loadRandomPosition = (type: 'middlegame' | 'endgame' | 'tactical') => {
    const randomPos = CHESS_POSITIONS.getRandomPosition(type);
    loadPosition(randomPos.fen, randomPos.name);
  };

  const undoMove = () => {
    const chess = gameRef.current;
    
    // Undo the last move
    chess.undo();
    
    // Update position and history
    setPosition(chess.fen());
    setMoveHistory(prev => prev.slice(0, -1));
    setGameStatus(getGameStatus(chess));
    setIsThinking(false);
  };

  const undoToStart = () => {
    const chess = gameRef.current;
    
    // Undo all moves
    while (chess.history().length > 0) {
      chess.undo();
    }
    
    // Reset to initial position
    setPosition(chess.fen());
    setMoveHistory([]);
    setGameStatus(getGameStatus(chess));
    setIsThinking(false);
    setSelectedPosition(null);
  };

  const currentTurn = gameRef.current.turn() === 'w' ? t('white') : t('black');

  return (
    <div style={{ margin: '20px auto', maxWidth: '700px', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h2 style={{ textAlign: 'center', margin: 0, flex: 1 }}>{t('title')}</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            padding: '6px 12px',
            fontSize: 14,
            cursor: 'pointer',
            marginLeft: 10,
          }}
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      {selectedPosition && (
        <div style={{ textAlign: 'center', marginBottom: 10, color: '#666', fontSize: 14 }}>
          {t('currentPosition')}: {selectedPosition}
        </div>
      )}

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
          {t('status')}: {gameStatus} | {t('turn')}: {isThinking ? `${t('black')} ${t('thinking')}` : currentTurn}
        </p>
        
        <div style={{ marginTop: 15 }}>
          <button
            onClick={resetGame}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer',
              marginRight: 8,
            }}
          >
            {t('newGame')}
          </button>
          <button
            onClick={() => loadRandomPosition('middlegame')}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer',
              marginRight: 8,
            }}
          >
            {t('randomMiddlegame')}
          </button>
          <button
            onClick={() => loadRandomPosition('endgame')}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer',
              marginRight: 8,
            }}
          >
            {t('randomEndgame')}
          </button>
          <button
            onClick={() => loadRandomPosition('tactical')}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: 'pointer',
              marginRight: 8,
            }}
          >
            {t('randomTactical')}
          </button>
        </div>

        <div style={{ marginTop: 10 }}>
          <button
            onClick={undoMove}
            disabled={moveHistory.length === 0}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: moveHistory.length === 0 ? 'not-allowed' : 'pointer',
              marginRight: 8,
              opacity: moveHistory.length === 0 ? 0.5 : 1,
            }}
          >
            {t('undo')}
          </button>
          <button
            onClick={undoToStart}
            disabled={moveHistory.length === 0}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              cursor: moveHistory.length === 0 ? 'not-allowed' : 'pointer',
              marginRight: 8,
              opacity: moveHistory.length === 0 ? 0.5 : 1,
            }}
          >
            {t('undoToStart')}
          </button>
        </div>

        {gameHistory.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <label style={{ fontSize: 14, marginRight: 8 }}>
              {t('gameHistory')}:
            </label>
            <select
              value={selectedHistoryGame || ''}
              onChange={(e) => e.target.value && loadGameFromHistory(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <option value="">{t('selectGameHistory')}</option>
              {gameHistory.map(game => (
                <option key={game.id} value={game.id}>
                  {game.date} - {game.result} ({game.moves.length} {language === 'zh' ? '步' : language === 'fr' ? 'coups' : 'moves'})
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: 'left', maxHeight: 200, overflowY: 'auto' }}>
          <strong>{t('moveHistory')}:</strong>
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
