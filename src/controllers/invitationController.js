import { StatusCodes } from "http-status-codes"
import { invitationService } from "~/services/invitationService"

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const invitorId = req.decodedToken._id
    console.log('reqBody in controller: ', req.body)
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

export const invitationController = {
  createNewBoardInvitation,
  getInvitations
}