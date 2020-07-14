import controllers from "./user.controllers";
import express from "express";

const router = express.Router();

// api/user
router.route("/").get(controllers.getMany).post(controllers.createOne);

// api/user/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;
