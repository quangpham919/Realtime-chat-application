import express from "express";
import controllers from "./room.controller";

const router = express.Router();

//api/room
router.route("/").get(controllers.getMany).post(controllers.createOne);

//api/room/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;
