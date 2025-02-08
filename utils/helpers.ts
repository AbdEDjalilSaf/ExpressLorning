import bcrypt from 'bcrypt';

const saltRounds = 10;


export const hashPassword = (password: string): Promise<string> => {
    if (!password) {
        throw new Error("Password must be provided");
      }
const salt = bcrypt.genSaltSync(saltRounds);
return bcrypt.hash(password, salt);
};

export const comparePassword = (password:string, hash: string):Promise<boolean> => {
    return bcrypt.compare(password, hash);
};