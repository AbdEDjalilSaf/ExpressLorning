import mongoose, { model } from 'mongoose';

// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     password: string;
// }

const userSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.Number,
        required: true,
    },
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
        unique: true,
    },
});

export const Usere = model("User", userSchema);
