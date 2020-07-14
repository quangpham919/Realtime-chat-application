import mongoose from "mongoose";
import moment from "moment";

const chatSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    require: true,
  },
  created_at: {
    type: String,
    default: moment().format("LLL"),
  },
});

export const Chat = mongoose.model("chat", chatSchema);
