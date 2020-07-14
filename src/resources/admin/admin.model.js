import mongoose from 'mongoose'
import moment from 'moment'

const adminSchema = new mongoose.Schema({
    name: {
      type: String, 
      required: true, 
      max: 255  
    },
    email: {
        type: String,
        required: true,
        unique: true,
       
    },
    password: {
        type: String,
        required: true, 
       
    },
    joined_at: {
        type: String,
        default: moment().format("LLL")
    }
})

export const Admin = mongoose.model("admin", adminSchema)