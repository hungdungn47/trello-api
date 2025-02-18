/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from "express";
import { boardValidation } from "~/validations/boardValidation";
import { boardController } from "~/controllers/boardController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/")
  .get(authMiddleware.isAuthorized, boardController.getAllBoards)
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew);

Router.route("/:id")
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update);

Router.route("/supports/move_card").put(
  authMiddleware.isAuthorized, boardValidation.moveCardToDifferentColumn,
  authMiddleware.isAuthorized, boardController.moveCardToDifferentColumn
);
export const boardRoute = Router;
