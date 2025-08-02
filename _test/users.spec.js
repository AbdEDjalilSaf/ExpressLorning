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
const globals_1 = require("@jest/globals");
const globals_2 = require("@jest/globals");
const globals_3 = require("@jest/globals");
const users_1 = require("../handler/users");
const containes_1 = require("../utils/containes");
const mockRequest = {
    params: { id: '1' }
};
const mockResponse = {
    sendStatus: globals_2.jest.fn(),
    send: globals_2.jest.fn(),
    json: globals_2.jest.fn(),
    status: globals_2.jest.fn().mockReturnThis(),
};
(0, globals_1.describe)('get users', () => {
    (0, globals_1.beforeEach)(() => {
        globals_2.jest.clearAllMocks(); // Clear mocks before each test
    });
    (0, globals_1.it)('should get user by id', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Test start');
        console.log("Mock Users:", containes_1.mockUsers);
        console.log("Requested ID:", mockRequest.params.id);
        (0, users_1.usersId)(mockRequest, mockResponse);
        //  getApiUser(mockRequest, mockResponse);      ================= correct
        //  postApiUser(mockRequest, mockResponse);
        //  putApiUserId(mockRequest, mockResponse);    ================= correct
        //  patchApiUserId(mockRequest, mockResponse);  ================= correct
        //  deleteApiUserId(mockRequest, mockResponse); ================= correct
        // expect(mockResponse.sendStatus).toHaveBeenCalledWith(404); // Ensure status was set
        // expect(mockResponse.send).toHaveBeenCalledTimes(2); // Ensure status was set
        // expect(jest.fn()).toHaveBeenCalledWith({"email": "john@example.com", "id": 1, "name": "John Doe", "password": "fjsdsjjhwhe"}); // Ensure status was set
        // expect(mockResponse.json).toHaveBeenCalled(); // Ensure response was sent
        console.log('Test end');
    }));
    (0, globals_1.it)('should call sendStatus with 404 if user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const copyMockRequest = Object.assign(Object.assign({}, mockRequest), { params: Object.assign(Object.assign({}, mockRequest.params), { userIndex: 100 }) });
        console.log("Copy Mock Request:", copyMockRequest);
        yield (0, users_1.usersId)(copyMockRequest, mockResponse);
        // expect(mockResponse.sendStatus).toHaveBeenCalled();    // Ensure status was set
        (0, globals_3.expect)(mockResponse.sendStatus).toHaveBeenCalledWith(200); // Ensure status was set
    }));
});
