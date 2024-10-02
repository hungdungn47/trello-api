/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import { closeDb, connectDb, getDb } from '~/config/mongodb'
import { env } from './config/environment'

const startServer = () => {
  const app = express()

  app.get('/', async (req, res) => {
    console.log(await getDb().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Trung Quan Dev, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
  })
}

connectDb()
  .then(() => {
    console.log('Connected to MongoDB localhost server')
  })
  .then(() => {
    startServer()
  })
  .catch(err => {
    console.error(err)
    process.exit(0)
  })