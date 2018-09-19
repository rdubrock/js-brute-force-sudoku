class Square {
  constructor(value, possibles = [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    this.possibles = possibles;
    this.value = value;
  }
}

const solveString = (inputString) => {
  const grid = inputString
    .split('')
    .map((char) => {
      if (char === '.') {
        return new Square(null);
      } else {
        const value = parseInt(char);
        return new Square(value);
      }
    });

    return solvePuzzle(grid);
}

const solvePuzzle = (grid) => {
  const guesses = [];
  let currentPuzzleState = 'inProgress';
  let currentPuzzle = grid;
  while (true) {
    currentPuzzleState = puzzleLoop(currentPuzzle);
    if (currentPuzzleState === 'solved') {
      break;
    }
    if (currentPuzzleState === 'needsGuess') {
      applyGuesses(currentPuzzle, guesses);
      currentPuzzle = guesses.pop();
    } else if (currentPuzzleState = 'invalid') {
      currentPuzzle = guesses.pop();
    }
  }
  return currentPuzzle.map((square) => square.value).join('');
}

const puzzleLoop = (grid) => {
  grid.forEach((square, index) => {
    console.log('checking square', index);
    checkRow(square, index, grid);
    console.log('checked row', index);
    checkColumn(square, index, grid);
    console.log('checked column', index);
    checkBlock(square, index, grid);
    console.log('checked block', index);
  });
  let valuesApplied = applyValues(grid);
  console.log('values applied');
  if (valuesApplied) {
    return puzzleLoop(grid);
  } else {
    return checkPuzzleStatus(grid);
  }
}

const applyValues = grid => {
  let valuesApplied = false;
  grid.forEach((square) => {
    if(!square.value && square.possibles.length === 1) {
      square.value = square.possibles.pop();
      valuesApplied = true;
    }
  });
  return valuesApplied;
}

const trimPossibles = (value, square) => {
  square.possibles = square.possibles.filter((possible) => possible !== value);
}


const getRowByIndex = (index) => {
  switch (Math.floor(index / 9)) {
    case 0:
      return [0, 8];
    case 1:
      return [9, 17];
    case 2:
      return [18, 26];
    case 3:
      return [27, 35];
    case 4:
      return [36, 44];
    case 5:
      return [45, 53];
    case 6:
      return [54, 62];
    case 7:
      return [63, 71];
    case 8:
      return [72, 80];
  }
}


const getBlockByIndex = (index) => {
  let row = Math.floor(index / 9);
  let column = index % 9;
  if(row < 3 && column < 3) {
    return [0, 1, 2, 9, 10, 11, 18, 19, 20];
  }
  if(row < 3 && column < 6) {
    return [ 3, 4, 5, 12, 13, 14, 21, 22, 23];
  }
  if(row < 3 && column < 9) {
    return [6, 7, 8, 15, 16, 17, 24, 25, 26];
  }
  if(row < 6 && column < 3) {
    return [27, 28, 29, 36, 37, 38, 45, 46, 47];
  } 
  if(row < 6 && column < 6) {
    return [30, 31, 32, 39, 40, 41, 48, 49, 50];
  }
  if(row < 6 && column < 9) {
    return [33, 34, 35, 42, 43, 44, 51, 52, 53];
  }
  if(row < 9 && column < 3) {
    return [54, 55, 56, 63, 64, 65, 72, 73, 74];
  }
  if(row < 9 && column < 6) {
    return [57, 58, 59, 66, 67, 68, 75, 76, 77];
  }
  if(row < 9 && column < 9) {
    return [60, 61, 62, 69, 70, 71, 78, 79, 80];
  }
}

const checkRow = (square, index, grid) => {
  let indices = getRowByIndex(index);
  for (i = indices[0]; i <= indices[1]; i++) {
    trimPossibles(grid[i].value, square);
  }
}

const checkColumn = (square, index, grid) => {
  let start = index % 9;
  for (i = start; i < grid.length; i = i + 9) {
    trimPossibles(grid[i].value, square);
  }
}

const checkBlock = (square, index, grid) => {
  let indices = getBlockByIndex(index);
  indices.forEach((i) => {
    trimPossibles(grid[i].value, square);
  });
}

const checkPuzzleStatus = (grid) => {
  let invalid = false;
  let solved = true;
  let needsGuess = true;
  grid.forEach((square) => {
    if (square.possibles.length === 0 && !square.value) {
      invalid = true;
    } 
    if (!square.value && square.possibles.length === 1) {
      solved = false;
      needsGuess = false;
    }
    if (!square.value)  {
      solved = false;
    }
  });
  if (invalid) {
    return 'invalid';
  }
  if (solved) {
    return 'solved';
  }
  if (needsGuess) {
    return 'needsGuess';
  }
  return 'inProgress';
}

const applyGuesses = (grid, guesses) => {
  let minGuesses = 9
  let minGuessesIndex;
  grid.forEach((square, index) => {
    console.log('square.possibles', square.possibles.length);
    if (square.possibles.length < minGuesses) {
      console.log('found min guesses', index);
      minGuesses = square.possibles.length;
      minGuessesIndex = index;
    }
  });
  let guessSquare = grid[minGuessesIndex];
  guessSquare.possibles.forEach((possible) => {
    const newSquare = new Square(possible, []);
    let guessGrid = grid.map((square, index) => {
      if (index === minGuessesIndex) {
        return newSquare;
      } else {
        return new Square(square.value, square.possibles);
      }
    });
    guesses.push(guessGrid);
  });
}

let testString = ".389...5775..84.1...65.748..6..9574.519.43..8.7.6..3.5941.3.5..3.54..1.9...159.34";

try {
  let solution = solveString(testString);
  console.log('solved', solution);
} catch (e) {
  console.error(e);
}