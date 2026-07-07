# YamChess, Yet Another Multi-mode Chess game

## Design

- Interactive Chessboard: A responsive chessboard with drag-and-drop functionality.
- Game Logic: Full implementation of chess rules, including special moves like castling and en passant.
- AI Opponent: A simple AI that makes random valid moves.
- Game State Management: Tracks game status, turn, and move history.
- Responsive Design: Adapts to different screen sizes.
- User Interface: Clean and intuitive interface with game status, turn indicator, and move history.

## Features

- Move Validation: Ensures all moves follow standard chess rules.
- Game Status: Displays check, checkmate, and draw conditions.
- Move History: Tracks and displays all moves made in the game.
- Responsive Design: Works on both desktop and mobile devices.
- Visual Feedback: Highlights valid moves and provides visual cues for game state.

## Future Enhancements

- Improved AI: Implement a more sophisticated AI using algorithms like Minimax with Alpha-Beta pruning.
- Game Persistence: Save and load games using local storage.
- Move Animation: Add smooth animations for piece movements.
- Sound Effects: Add sound effects for moves, captures, and game events.
- Themes: Allow users to choose different board and piece themes.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`


Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Deno

### lint

```sh
deno lint --rules-tags=recommended
```
