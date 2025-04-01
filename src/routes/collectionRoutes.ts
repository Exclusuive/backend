// src/routes/collectionRoutes.ts
import { Router } from "express";
import { CollectionController } from "../controllers/collectionController";

const router = Router();

// **Collection Routes**
router.get("/", CollectionController.getAllCollections);
router.get("/:id", CollectionController.getCollectionById);
router.post("/by-object-ids", CollectionController.getCollectionsByObjectIds);
router.post("/", CollectionController.createCollection);
router.put("/:id", CollectionController.updateCollection);
router.delete("/:id", CollectionController.deleteCollection);
router.get(
  "/generate-image/:baseObjectId",
  CollectionController.createDynamicImage,
);

export default router;
