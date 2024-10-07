import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(250).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required()
  })

  try {

    await correctCondition.validateAsync(req.body, { abortEarly: false })

    next()

  } catch (error) {
    //eslint-disable-next-line no-console
    const customeError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    next(customeError)
  }
}

export const boardValidation = {
  createNew
}