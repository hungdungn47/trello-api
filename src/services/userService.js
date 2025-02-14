import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcrypt from 'bcryptjs'
import { pickUser } from '~/utils/formatters'

const createNew = async (reqBody) => {
  // Check if user is already in database
  const checkUser = await userModel.findOneByEmail(reqBody.email)
  if (checkUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'This email is already registered!')
  }

  // Create data to save
  const usernameFromEmail = reqBody.email.split('@')[0]
  const newUser = {
    email: reqBody.email,
    password: bcrypt.hashSync(reqBody.password, 8),
    username: usernameFromEmail,
    displayName: usernameFromEmail
  }

  // Save data into database
  await userModel.createNew(newUser)
  const getCreatedUser = await userModel.findOneByEmail(reqBody.email)

  return pickUser(getCreatedUser)
}

export const userService = {
  createNew
}