"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enokiClient = void 0;
const enoki_1 = require("@mysten/enoki");
exports.enokiClient = new enoki_1.EnokiClient({
    apiKey: process.env.ENOKI_SECRET_KEY,
});
