import path from 'path'
import dotenv from 'dotenv'
dotenv.config({path: path.join(__dirname, "../.env")})

const serverPort = process.env.PORT || 4000
module.exports = {
  version: '0.0.1',
  serverPort,
  tokens: {
    sentry: process.env.SENTRY_KEY,
  },
  googleHome: {
    actions: {
      ACTION_WELCOME: 'welcome',
      ACTION_HANDLE_GUESS: 'handle_guess',
      ACTION_START_NEW_GAME: 'start_new_game',
      ACTION_END_GAME: 'end_game',
      ACTION_CURRENT_STATE: 'current_state',
    },
    arguments: {
      ARGUMENT_LETTER: 'letter',
    }
  }
}
