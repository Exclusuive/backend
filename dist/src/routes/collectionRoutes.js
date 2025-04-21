"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/collectionRoutes.ts
const express_1 = require("express");
const collectionController_1 = require("../controllers/collectionController");
const router = (0, express_1.Router)();
// **Collection Routes**
// router.get("/", CollectionController.getAllCollections);
// router.get("/:id", CollectionController.getCollectionById);
// router.post("/by-object-ids", CollectionController.getCollectionsByObjectIds);
// router.post("/", CollectionController.createCollection);
// router.put("/:id", CollectionController.updateCollection);
// router.delete("/:id", CollectionController.deleteCollection);
router.get("/update-image/:baseObjectId", collectionController_1.CollectionController.updateDynamicImage);
exports.default = router;
