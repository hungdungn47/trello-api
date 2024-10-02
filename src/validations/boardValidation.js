import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(250).trim().strict()
  })

  try {
    //eslint-disable-next-line no-console
    console.log('Request body: ', req.body)

    await correctCondition.validateAsync(req.body, { abortEarly: false })

    // next()

    res.status(StatusCodes.CREATED).json({ message: 'API create board' })
  } catch (error) {
    //eslint-disable-next-line no-console
    console.log(error)
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: new Error(error).message
    })
  }
}

export const boardValidation = {
  createNew
}