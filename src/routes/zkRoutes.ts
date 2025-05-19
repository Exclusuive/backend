import express from "express";
import { ZkSendController } from "../controllers/zkSendController";

const router = express.Router();
router.get("/test", (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});
router.post("/zk-send/sponsor", ZkSendController.createSponsoredTransaction);
router.post("/zk-send/execute", ZkSendController.executeSponsoredTransaction);
router.post("/zk-send/mintPami", ZkSendController.mintPami);

export default router;
