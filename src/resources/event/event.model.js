import mongoose from "mongoose";
import moment from "moment";

const eventSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    default: moment().format("LLLL"),
  },
});

export const Event = mongoose.model("event", eventSchema);
