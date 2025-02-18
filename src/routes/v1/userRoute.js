import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'

const userRouter = express.Router()

userRouter.route('/register')
  .post(userValidation.createNew, userController.createNew)

userRouter.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

userRouter.route('/login')
  .post(userValidation.login, userController.login)

userRouter.route('/logout')
  .delete(userController.logout)

userRouter.route('/refresh-token')
  .get(userController.refreshToken)

export const userRoute = userRouter