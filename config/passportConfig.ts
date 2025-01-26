import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { mockUsers } from "../utils/containes";
// import GoogleStrategy from "passport-google-oauth20";

passport.serializeUser((user: any, done) => {
    console.log("serializeUser ---");
    console.log("serializeUser user ---",user);   
    done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
    console.log("deserializeUser ---");
    console.log("deserializeUser id ---",id);   
    try{
        const findUser = mockUsers.find((user) => user.id === id); 
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
        function (name, password, done) {
            console.log("name ----- :",name);
            console.log("password ----- :",password);
            try{
                const findUser = mockUsers.find((user) => user.name === name); 
                if (!findUser) throw new Error("user not found");
                if(findUser.password !== password) throw new Error("password is incorrect");
                done(null, findUser);
            }catch(error){
                done(error, false);
        }
    }
    )
);