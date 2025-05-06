"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const authenticate = (req, res, next) => {
    const apiKey = req.headers.authorization;
    if (!apiKey) {
        res.status(401).send({ message: "Api key not provided" });
    }
    else if (apiKey !== process.env.API_KEY) {
        res.status(401).send({ message: "Unauthorized access" });
    }
    else {
        next();
    }
};
exports.authenticate = authenticate;
