import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { mockUsers } from "../utils/containes";
import { Usere } from "./schemas/user";
import { comparePassword } from "../utils/helpers";
// import GoogleStrategy from "passport-google-oauth20";

// serializeUser 
passport.serializeUser((user: any, done) => {
    console.log("serializeUser ---");
    console.log("serializeUser user ---",user);   
    done(null, user.id);
});

// deserializeUser 
passport.deserializeUser(async(id, done) => {
    console.log("deserializeUser ---");
    console.log("deserializeUser id ---",id);   
    try{
        const findUser = await Usere.findById(id);  
        if (!findUser) throw new Error("user not found");
        done(null, findUser);
    }catch(error){
        done(error, false);
}  
});


export default passport.use(
    new LocalStrategy(
        {
        usernameField: "name",
        passwordField: "password",
        },
        async (name, password, done) => {
            console.log("name ----- :",name);
            console.log("password ----- :",password);
            try{
                const findUser = await Usere.findOne({ name }); 
                if (!findUser) throw new Error("User not found");
                if (!comparePassword(password, findUser.password)) throw new Error("password is incorrect");
                done(null, findUser);
            }catch(error){
                done(error, false);
        }
    }
    )
);