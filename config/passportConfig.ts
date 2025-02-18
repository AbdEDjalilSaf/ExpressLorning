import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { mockUsers } from "../utils/containes";
import { Usere } from "./schemas/user";
import { comparePassword } from "../utils/helpers";
import { Strategy } from "passport-discord"
import { discordUser } from "./schemas/discord-user";
import jwt from "jsonwebtoken";

// import GoogleStrategy from "passport-google-oauth20";

// SECRET_KEY = 'secure-validation'; // Replace with a strong secret key

// ########################## Passport Strategies ########################################
passport.use( new Strategy({ 
    clientID: "1335533852529004574",
    clientSecret: "KgV2rwX7uTV2cwZnrbFoO6QYf74wViUf",
    callbackURL: "http://localhost:4000/api/auth/discord/redirect",
    scope: ["identify","guilds", "email"],
}, async (accessToken, refreshToken, profile, done) => {
    console.log("profile ===== : ",profile);

    let findUser;

    try {
        findUser = await discordUser.findOne({ discordId: profile.id });
    }catch(error){
        return done(error, false);
    }

    try{
    if (!findUser){
const newUser = new discordUser({
    discordId: profile.id,
    name: profile.username,
    email: profile.email,
});
const newSavedUser = await newUser.save();
    return done(null, newSavedUser);
    }
    return done(null, findUser);
}catch(error){
    return done(error, false);
}

}));


// passport.use(new GoogleStrategy({ 
//     clientID: "1335533852529004574",
//     clientSecret: "KgV2rwX7uTV2cwZnrbFoO6QYf74wViUf",
//     callbackURL: "http://localhost:4000/api/auth/google/redirect",
// }, (accessToken, refreshToken, profile, done) => {
//     console.log("profile ---",profile);
//     return done(null, profile);
// }));


// ########################## Serialization & Deserialization #############################

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
        // const findUser = await Usere.findById(id);  
        const findUser = await discordUser.findById(id);
        return findUser ? 
        done(null, findUser) : done(null, null);
    }catch(error){
        done(error, false);
}  
});


passport.use(
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

export default passport;