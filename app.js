'use strict'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import { DialogflowApp } from 'actions-on-google'

import { initSentry, sendException } from './services/sentry'
import { version, googleHome, serverPort } from './config/constants'
import {
  welcome,
  handleGuess,
  startNewGame,
  endGame,
  currentState,
} from './controllers/hangmanController'

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(async (req, res) => {
  const {
    ACTION_WELCOME,
    ACTION_HANDLE_GUESS,
    ACTION_START_NEW_GAME,
    ACTION_END_GAME,
    ACTION_CURRENT_STATE,
  } = googleHome.actions

  const assistant = new DialogflowApp({
    request: req,
    response: res,
  })

  try {
    let actionMap = new Map()
    actionMap.set(ACTION_WELCOME, welcome)
    actionMap.set(ACTION_HANDLE_GUESS, handleGuess)
    actionMap.set(ACTION_START_NEW_GAME, startNewGame)
    actionMap.set(ACTION_END_GAME, endGame)
    actionMap.set(ACTION_CURRENT_STATE, currentState)

    return await assistant.handleRequest(actionMap)
  } catch (e) {
    sendException(e)
    return assistant.tell(`Something very bad happened!`)
  }
})

if (!module.parent) {
  app.listen(serverPort)
  initSentry()

  console.log(`Server is now running on port ${serverPort}`)
  console.log(`Version: ${version}`)
  console.log(`Environment: ${(process.env.NODE_ENV || 'dev')}`)
}

