"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchemas = void 0;
exports.validationSchemas = {
    name: {
        isString: true,
        isLength: {
            errorMessage: 'Name should be between 3 and 50 characters',
            options: { min: 3, max: 50 },
        },
        errorMessage: 'Name is required',
        notEmpty: {
            errorMessage: 'Name cannot be empty',
        },
    },
    email: {
        isEmail: true,
        errorMessage: 'Email is required',
        notEmpty: {
            errorMessage: 'Email cannot be empty',
        },
    },
    password: {
        isString: true,
        isLength: {
            errorMessage: 'Password should be between 8 and 50 characters',
            options: { min: 5, max: 50 },
        },
        errorMessage: 'Password is required',
        notEmpty: {
            errorMessage: 'Password cannot be empty',
        },
    },
};
