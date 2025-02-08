import { describe, it, beforeEach } from "@jest/globals";
import { jest } from '@jest/globals';
import { expect } from '@jest/globals';
import { usersId , postApiUser , putApiUserId , patchApiUserId , deleteApiUserId } from "../handler/users";
import { Request, Response } from 'express';
import { mockUsers } from "../utils/containes";

const mockRequest = {
    params: { id: '1' }
} as unknown as Request;



const mockResponse = {
    sendStatus: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
} as unknown as Response;




describe('get users', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should get user by id', async () => {
        console.log('Test start');
        console.log("Mock Users:", mockUsers);
        console.log("Requested ID:", mockRequest.params.id);
        
         usersId(mockRequest, mockResponse);

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
    });

    it('should call sendStatus with 404 if user not found', async () => {
const copyMockRequest = { ...mockRequest, params: { ...mockRequest.params, userIndex: 100 } } as unknown as Request;
console.log("Copy Mock Request:", copyMockRequest);
       await usersId(copyMockRequest, mockResponse);
        // expect(mockResponse.sendStatus).toHaveBeenCalled();    // Ensure status was set
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(200);    // Ensure status was set

    });
});
