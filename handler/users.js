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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApiUserId = exports.patchApiUserId = exports.putApiUserId = exports.postApiUser = exports.usersId = void 0;
const user_1 = require("../config/schemas/user");
const helpers_1 = require("../utils/helpers");
const express_validator_1 = require("express-validator");
const usersId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Assuming the user ID is passed as a URL parameter
    if (!id) {
        res.status(400).json({ error: 'User ID is required.' });
        return;
    }
    try {
        const user = yield user_1.Usere.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.json(user); // Send the user data as a JSON response
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.usersId = usersId;
const postApiUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    // const { body } = req;
    const data = (0, express_validator_1.matchedData)(req);
    const result = (0, express_validator_1.validationResult)(req);
    console.log("result", result);
    if (!result.isEmpty()) {
        res.status(400).send({ errors: result.array() });
        return;
    }
    const newAddUser = new user_1.Usere(data);
    data.password = yield (0, helpers_1.hashPassword)(data.password);
    console.log("data", data);
    try {
        yield newAddUser.save()
            .then(() => console.log("User saved successfully"))
            .catch((err) => console.error("Error saving user:", err));
        res.status(201).send(newAddUser);
    }
    catch (err) {
        console.log("Error ---------------- ", err);
        res.status(400).send({ error: err.message });
        return;
    }
    // const { body } = req;
    // // console.log("=============== matchedData ==================",data);
    // const newUser: User = {id:mockUsers[mockUsers.length - 1].id + 1 as number, name: data.name, email: data.email,password: data.password};
    // mockUsers.push(newUser);
    // res.status(201).send(newUser);
});
exports.postApiUser = postApiUser;
const putApiUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Extract the user ID from the URL parameters
    const newUserData = req.body; // Extract the new user data from the request body
    console.log("User ID:", id);
    console.log("New User Data:", newUserData);
    if (!id) {
        res.status(400).json({ error: 'User ID is required.' });
        return;
    }
    if (!newUserData || Object.keys(newUserData).length === 0) {
        res.status(400).json({ error: 'New user data is required.' });
        return;
    }
    try {
        // Replace the user document with the new data
        const updatedUser = yield user_1.Usere.findByIdAndUpdate(id, newUserData, { new: true, runValidators: true, overwrite: true } // Replace the entire document
        );
        if (!updatedUser) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.status(200).json(updatedUser); // Send the updated user as a response
        console.log("---------------------------------------PUT----------------------------------------");
    }
    catch (err) {
        console.error("The error is:", err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.putApiUserId = putApiUserId;
const patchApiUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Extract the user ID from the URL parameters
    const updateData = req.body; // Extract the update data from the request body
    console.log("User ID:", id);
    console.log("Update Data:", updateData);
    if (!id) {
        res.status(400).json({ error: 'User ID is required.' });
        return;
    }
    if (!updateData || Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'Update data is required.' });
        return;
    }
    try {
        // Find the user by ID and update the specified fields
        const updatedUser = yield user_1.Usere.findByIdAndUpdate(id, updateData, { new: true, runValidators: true } // Return the updated document and run schema validators
        );
        if (!updatedUser) {
            res.status(404).json({ error: 'User not found.' });
            return;
        }
        res.status(200).json(updatedUser); // Send the updated user as a response
        console.log("---------------------------------------PATCH----------------------------------------");
    }
    catch (err) {
        console.error("The error is:", err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.patchApiUserId = patchApiUserId;
const deleteApiUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("userIndex", id);
    if (!id) {
        res.status(400).json({ error: 'User ID is required.' });
        return;
    }
    try {
        const deletedUser = yield user_1.Usere.findByIdAndDelete(id);
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found.' });
        }
        res.sendStatus(200);
        console.log("---------------------------------------DELETE----------------------------------------");
    }
    catch (err) {
        console.log(" the error is ", err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
exports.deleteApiUserId = deleteApiUserId;
