import controllers from "./chat.controllers";
import express from "express";

const router = express.Router();

// api/chat/room/:roomname
router.route("/room/:roomname").get(controllers.getChatByRoom);

// api/chat
router.route("/").get(controllers.getMany).post(controllers.createOne);

// api/chat/:id
router.route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;
