import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'

const userRouter = express.Router()

userRouter.route('/register')
  .post(userValidation.createNew, userController.createNew)

export const userRoute = userRouter