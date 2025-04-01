"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/collectionRoutes.ts
const express_1 = require("express");
const collectionController_1 = require("../controllers/collectionController");
const router = (0, express_1.Router)();
// **Collection Routes**
router.get("/", collectionController_1.CollectionController.getAllCollections);
router.get("/:id", collectionController_1.CollectionController.getCollectionById);
router.post("/by-object-ids", collectionController_1.CollectionController.getCollectionsByObjectIds);
router.post("/", collectionController_1.CollectionController.createCollection);
router.put("/:id", collectionController_1.CollectionController.updateCollection);
router.delete("/:id", collectionController_1.CollectionController.deleteCollection);
router.get("/generate-image/:baseObjectId", collectionController_1.CollectionController.createDynamicImage);
exports.default = router;
