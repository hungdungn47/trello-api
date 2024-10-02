/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import { connectDb } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'

const startServer = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  // Use APIs V1
  app.use('/v1', APIs_V1)

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Trung Quan Dev, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
  })
}

connectDb()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to MongoDB localhost server')
  })
  .then(() => {
    startServer()
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(0)
  })