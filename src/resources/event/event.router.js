import controllers from "./event.controllers";
import express from "express";

const router = express.Router();

// api/event
router.route("/").get(controllers.getMany).post(controllers.createOne);

// api/event/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;
