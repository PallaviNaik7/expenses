import { Request, Response, NextFunction } from 'express'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {

    const apiKey = req.headers.authorization

    if (!apiKey) {
        res.status(401).send({ message: "Api key not provided" })
    } else if (apiKey !== process.env.API_KEY) {
        res.status(401).send({ message: "Unauthorized access" })
    } else {
        next();
    }
}