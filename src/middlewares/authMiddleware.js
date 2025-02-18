import { env } from "~/config/environment"
import { jwtProvider } from "~/providers/jwtProvider"

const { StatusCodes } = require("http-status-codes")
const { default: ApiError } = require("~/utils/ApiError")

const isAuthorized = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken

  console.log(accessToken)
  if (!accessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Missing token!'))
    return
  }

  try {
    const decodedToken = jwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_KEY)

    req.decodedToken = decodedToken

    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'JWT expired!'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }

}

export const authMiddleware = {
  isAuthorized
}