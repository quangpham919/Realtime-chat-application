import controllers from "./admin.controllers";
import express from "express";

const router = express.Router();

// api/admin
router.route("/").get(controllers.getMany).post(controllers.createOne);

// api/admin/:id
router
  .route("/:id")
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne);

export default router;
