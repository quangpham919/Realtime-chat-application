import mongoose from "mongoose";
import moment from "moment";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  created_at: {
    type: String,
    default: moment().format("LLL"),
  },
});

export const Room = mongoose.model("room", roomSchema);
