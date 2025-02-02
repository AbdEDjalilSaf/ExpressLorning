import { describe, it, test , before , beforeEach } from "node:test";
import { jest } from '@jest/globals';
// import { expect } from '@jest/globals';
import { usersId } from "../handler/users";


const mockRequist = { 
    userIndex: 1
};

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    json: jest.fn()
};


describe('get users', () => {
    it('should get user by id', () => {
        usersId(mockRequist as any, mockResponse as any)
    });
    });

