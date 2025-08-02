"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const user_1 = require("./schemas/user");
const helpers_1 = require("../utils/helpers");
const passport_discord_1 = require("passport-discord");
const discord_user_1 = require("./schemas/discord-user");
// import GoogleStrategy from "passport-google-oauth20";
// SECRET_KEY = 'secure-validation'; // Replace with a strong secret key
// ########################## Passport Strategies ########################################
passport_1.default.use(new passport_discord_1.Strategy({
    clientID: "1335533852529004574",
    clientSecret: "KgV2rwX7uTV2cwZnrbFoO6QYf74wViUf",
    callbackURL: "http://localhost:4000/api/auth/discord/redirect",
    scope: ["identify", "guilds", "email"],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("profile ===== : ", profile);
    let findUser;
    try {
        findUser = yield discord_user_1.discordUser.findOne({ discordId: profile.id });
    }
    catch (error) {
        return done(error, false);
    }
    try {
        if (!findUser) {
            const newUser = new discord_user_1.discordUser({
                discordId: profile.id,
                name: profile.username,
                email: profile.email,
            });
            const newSavedUser = yield newUser.save();
            return done(null, newSavedUser);
        }
        return done(null, findUser);
    }
    catch (error) {
        return done(error, false);
    }
})));
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
passport_1.default.serializeUser((user, done) => {
    console.log("serializeUser ---");
    console.log("serializeUser user ---", user);
    done(null, user.id);
});
// deserializeUser 
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("deserializeUser ---");
    console.log("deserializeUser id ---", id);
    try {
        // const findUser = await Usere.findById(id);  
        const findUser = yield discord_user_1.discordUser.findById(id);
        return findUser ?
            done(null, findUser) : done(null, null);
    }
    catch (error) {
        done(error, false);
    }
}));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "name",
    passwordField: "password",
}, (name, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("name ----- :", name);
    console.log("password ----- :", password);
    try {
        const findUser = yield user_1.Usere.findOne({ name });
        if (!findUser)
            throw new Error("User not found");
        if (!(0, helpers_1.comparePassword)(password, findUser.password))
            throw new Error("password is incorrect");
        done(null, findUser);
    }
    catch (error) {
        done(error, false);
    }
})));
exports.default = passport_1.default;
