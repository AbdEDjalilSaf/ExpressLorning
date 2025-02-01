import bcrypt from 'bcrypt';

const saltRounds = 10;


export const hashPassword = (password: string): Promise<string> => {
const salt = bcrypt.genSaltSync(saltRounds);
console.log("salt ---",salt);
return bcrypt.hash(password, salt);
};

export const comparePassword = (password:string, hash: string):Promise<boolean> => {
    return bcrypt.compare(password, hash);
};