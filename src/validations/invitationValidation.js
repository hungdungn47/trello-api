import { StatusCodes } from "http-status-codes"
import Joi from "joi"
import ApiError from "~/utils/ApiError"

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const invitationSchema = Joi.object({
      inviteeEmail: Joi.string().required(),
      boardId: Joi.string().required()
    })

    await invitationSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
  }
}

export const invitationValidation = {
  createNewBoardInvitation
}