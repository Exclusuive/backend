// src/routes/collectionRoutes.ts
import { Router } from "express";
import { CollectionController } from "../controllers/collectionController";

const router = Router();

// **Collection Routes**
router.get("/collections", CollectionController.getAllCollections);
router.get("/collections/:id", CollectionController.getCollectionById);
router.post(
  "/collections/by-object-ids",
  CollectionController.getCollectionsByObjectIds
);
router.post("/collections", CollectionController.createCollection);
router.put("/collections/:id", CollectionController.updateCollection);
router.delete("/collections/:id", CollectionController.deleteCollection);

export default router;
