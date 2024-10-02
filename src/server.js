/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import { closeDb, connectDb, getDb } from '~/config/mongodb'

const startServer = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    console.log(await getDb().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Trung Quan Dev, I am running at ${ hostname }:${ port }/`)
  })

  exitHook(() => {
    closeDb()
    console.log('Exiting')
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
  })