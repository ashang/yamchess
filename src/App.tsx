import React from 'react';
import './App.css';
import ChessGame from './ChessGame';
import { LanguageProvider } from './i18n/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <main>
          <ChessGame />
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
