import mongoose, { model } from 'mongoose';


const userSchema = new mongoose.Schema({
    name:{
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    email:{
        type: mongoose.Schema.Types.String, 
        required: true,
        unique: true,
    },
    password:{
        type: mongoose.Schema.Types.String,
        required: true,
        // unique: true,
    },
    roles:{
        // type: [mongoose.Schema.Types.String],
        // required: true,
        User:{
        type: mongoose.Schema.Types.Number,
        },
        Admin:{
        type: mongoose.Schema.Types.Number,
        }
    },
    refreshToken: {
        type: [mongoose.Schema.Types.String],
        required: false,
    }
}, { timestamps: true });

export const Usere = model("User", userSchema);
