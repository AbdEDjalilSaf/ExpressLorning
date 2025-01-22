import { Router, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

const router = Router();

router.get("/api/products", (req: Request, res: Response) => {
    // Log cookies for debugging
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);

    res.cookie("name", "hello", { maxAge: 1000 * 60 * 60 });
    // Check if the cookie exists and has the correct value
    if (req.cookies?.name === "hello") {
        // Send the products if the cookie is valid
        res.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
    }else{
   // Send a 403 error if the cookie is missing or incorrect
   res.status(403).send({ msg: "Sorry. You need the correct cookie." });
    }

});

export default router;