"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/collectionRoutes.ts
const express_1 = require("express");
const collectionController_1 = require("../controllers/collectionController");
const router = (0, express_1.Router)();
// **Collection Routes**
router.get("/collections", collectionController_1.CollectionController.getAllCollections);
router.get("/collections/:id", collectionController_1.CollectionController.getCollectionById);
router.post("/collections", collectionController_1.CollectionController.createCollection);
router.put("/collections/:id", collectionController_1.CollectionController.updateCollection);
router.delete("/collections/:id", collectionController_1.CollectionController.deleteCollection);
exports.default = router;
