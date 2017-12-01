const generateWord = () => {
  const words = [
    'copper',
    'explain',
    'illfated',
    'truck',
    'neat',
    'unite',
    'branch',
    'educated',
    'tenuous',
    'hum',
    'decisive',
    'notice',
  ]

  return words[Math.floor(Math.random() * words.length)];
}

const convertWordToPureForm = (word) => {
  const arr = word.split('')
  return arr.filter((item, index, inputArray) =>inputArray.indexOf(item) == index)
}

let games = {}

export const getWord = gameId => {
  const { word } = games[gameId]
  return word
}

export const checkLetter = (gameId, letter) => {
  const { word, pureWord, correctLetters, wrongLetters } = games[gameId]
  const alreadyGuessed = correctLetters.indexOf(letter) > -1 || wrongLetters.indexOf(letter) > -1

  let correct
  if (alreadyGuessed) {
    correct = correctLetters.indexOf(letter) > -1
  } else {
    correct = pureWord.indexOf(letter) > -1
    if (correct) {
      correctLetters.push(letter)
    } else {
      wrongLetters.push(letter)
    }
  }

  const finished = pureWord.length == correctLetters.length

  return {
    word,
    alreadyGuessed,
    correct,
    finished,
  }
}

export const getState = gameId => {
  const { word, correctLetters } = games[gameId]
  return word.split('').map(letter => correctLetters.indexOf(letter) === -1 ? 'blank' : letter).join(' ')
}

export const newGame = () => {
  const gameId = Object.keys(games).length + 1
  const word = generateWord()
  const game = {
    gameId: gameId,
    word,
    pureWord: convertWordToPureForm(word),
    correctLetters: [],
    wrongLetters: [],
  }
  games = {
    ...games,
    [gameId]: game,
  }

  return game
}
