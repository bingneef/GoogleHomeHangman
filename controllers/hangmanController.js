import { sendException } from './../services/sentry'
import { googleHome } from './../config/constants'
import { newGame, checkLetter, getWord } from './../helpers/hangman'

export const handleGuess = async app => {

  const { parameters: { gameId } } = app.getContext('game')
  const { ARGUMENT_LETTER } = googleHome.arguments

  const letter = app.getArgument(ARGUMENT_LETTER).toLowerCase()

  if (typeof letter !== 'string' || letter.length !== 1) {
    return app.ask(`That is not a letter, please try again.`)
  }

  try {
    const { word, correct, alreadyGuessed, finished } = checkLetter(gameId, letter)

    if (alreadyGuessed) {
      return app.ask(`You already guessed ${letter}! It was ${correct ? 'correct' : 'wrong'}`)
    } else if (correct) {
      if (finished) {
        app.setContext('game_finished', 1, {state: true});
        return app.ask(`You guessed all the letters of ${word}! Good job! Play a new game?`)
      } else {
        return app.ask(`${letter} is correct!`)
      }
    } else {
      return app.ask(`${letter} is wrong!`)
    }
  } catch (e) {
    sendException(e)
    return app.tell(`Oops, something went wrong..`)
  }
}

export const welcome = async app => {
  const gameId = newGame()
  app.setContext('game', 10, { gameId });
  return app.ask(`Welcome to hangman! What is your first letter?`)
}

export const startNewGame = async app => {
  let payload = `What is your first letter?`
  try {
    const { parameters: { gameId } } = app.getContext('game')
    const word = getWord(gameId)
    payload = `The word was ${word}. Starting a new game, what is your first letter?`
  } catch (_) { }

  const gameId = newGame()
  app.setContext('game', 10, { gameId });
  return app.ask(payload)
}

export const endGame = async app => {
  return app.tell(`Ok, see you soon!`)
}
