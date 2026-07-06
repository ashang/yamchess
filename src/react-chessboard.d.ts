import { ChessboardProps } from 'react-chessboard';

declare module 'react-chessboard' {
  export interface ChessboardProps {
    position?: string;
    onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
    boardWidth: number;
    boardOrientation?: 'white' | 'black';
    customBoardStyle?: React.CSSProperties;
    customDarkSquareStyle?: React.CSSProperties;
    customLightSquareStyle?: React.CSSProperties;
  }
}
