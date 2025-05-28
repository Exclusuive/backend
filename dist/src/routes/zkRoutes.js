"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zkSendController_1 = require("../controllers/zkSendController");
const router = express_1.default.Router();
router.get("/test", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});
router.post("/zk-send/sponsor", zkSendController_1.ZkSendController.createSponsoredTransaction);
router.post("/zk-send/execute", zkSendController_1.ZkSendController.executeSponsoredTransaction);
router.post("/zk-send/mintPami", zkSendController_1.ZkSendController.mintPami);
router.post("/zk-send/balanceGame", zkSendController_1.ZkSendController.balanceGame);
exports.default = router;
