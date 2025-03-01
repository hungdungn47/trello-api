import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const cardSchema = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict()
  })

  try {
    await cardSchema.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    next(customError)
  }
}

const update = async (req, res, next) => {
  const cardSchema = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().optional,
    cover: Joi.string().optional,
    description: Joi.string().optional()
  })

  try {
    await cardSchema.validateAsync(req.body, { abortEarly: false })

    next()
  } catch (error) {
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    next(customError)
  }
}

export const cardValidation = {
  createNew, update
}