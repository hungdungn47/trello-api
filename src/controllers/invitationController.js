import { StatusCodes } from "http-status-codes"
import { invitationService } from "~/services/invitationService"

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const invitorId = req.decodedToken._id
    const invitation = await invitationService.createNewBoardInvitation(req.body, invitorId)
    res.status(StatusCodes.CREATED).json(invitation)
  } catch (error) {
    next(error)
  }
}

const getInvitations = async (req, res, next) => {
  try {
    const userId = req.decodedToken._id
    const result = await invitationService.getInvitations(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.decodedToken._id
    const { invitationId } = req.params
    const { status } = req.body

    const result = await invitationService.updateBoardInvitation(userId, invitationId, status)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}