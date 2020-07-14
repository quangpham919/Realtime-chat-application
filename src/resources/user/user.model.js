import mongoose from "mongoose";
import moment from "moment";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous",
  },
  joined_at: {
    type: String,
    default: moment().format("LLL"),
  },
});

export const User = mongoose.model("user", userSchema);
