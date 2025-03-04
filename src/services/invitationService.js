import { StatusCodes } from "http-status-codes"
import { boardModel } from "~/models/boardModel"
import { invitationModel } from "~/models/invitationModel"
import { userModel } from "~/models/userModel"
import ApiError from "~/utils/ApiError"
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from "~/utils/constants"
import { pickUser } from "~/utils/formatters"

const createNewBoardInvitation = async (reqBody, invitorId) => {
  const invitor = await userModel.findOneById(invitorId)

  const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)

  const board = await boardModel.findOneById(reqBody.boardId)

  if (!invitor || !invitee || !board) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Invitor, invitee or board not found')
  }

  const newInvitationData = {
    invitorId: invitor._id.toString(),
    inviteeId: invitee._id.toString(),
    type: INVITATION_TYPES.BOARD_INVITATION,

    boardInvitation: {
      boardId: board._id.toString(),
      status: BOARD_INVITATION_STATUS.PENDING
    }
  }

  console.log('invitation data in service: ', newInvitationData)

  const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
  const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId.toString())

  const result = {
    ...getInvitation,
    board: board,
    invitor: pickUser(invitor),
    invitee: pickUser(invitee)
  }

  return result
}

const getInvitations = async (userId) => {
  const invitationsList = await invitationModel.findByUser(userId)
  console.log('invitations:', invitationsList)

  const result = invitationsList.map(i => {
    return {
      ...i,
      invitor: i.invitor[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }
  })
  return result
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations
}