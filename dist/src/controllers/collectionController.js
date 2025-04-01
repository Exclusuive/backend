"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionController = void 0;
const collectionModel_1 = require("../models/collectionModel");
const suiHelper_1 = require("../utils/suiHelper");
const imageMerge_1 = require("../utils/imageMerge");
const uploadToS3_1 = require("../utils/uploadToS3");
exports.CollectionController = {
    // **Get All Collections**
    getAllCollections: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const collections = yield collectionModel_1.CollectionModel.getAllCollections();
            res.status(200).json(collections);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch collections." });
        }
    })),
    // **Get Collection by ID**
    getCollectionById: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const collection = yield collectionModel_1.CollectionModel.getCollectionById(id);
            if (!collection)
                return res.status(404).json({ error: "Collection not found." });
            res.status(200).json(collection);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch collection." });
        }
    })),
    // **Get Collections by objectIds**
    getCollectionsByObjectIds: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { objectIds } = req.body;
            if (!Array.isArray(objectIds)) {
                return res.status(400).json({ error: "objectIds must be an array." });
            }
            const collections = yield collectionModel_1.CollectionModel.getCollectionsByObjectIds(objectIds);
            res.status(200).json(collections);
        }
        catch (error) {
            console.error("Error in getCollectionsByObjectIds:", error);
            res
                .status(500)
                .json({ error: "Failed to fetch collections by objectIds." });
        }
    })),
    // **Create New Collection**
    createCollection: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const collectionData = req.body;
            const newCollection = yield collectionModel_1.CollectionModel.createCollection(collectionData);
            res.status(201).json(newCollection);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create collection." });
        }
    })),
    // **Update Collection**
    updateCollection: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedCollection = yield collectionModel_1.CollectionModel.updateCollection(id, updateData);
            if (!updatedCollection)
                return res.status(404).json({ error: "Collection not found." });
            res.status(200).json(updatedCollection);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update collection." });
        }
    })),
    // **Delete Collection**
    deleteCollection: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deletedCollection = yield collectionModel_1.CollectionModel.deleteCollection(id);
            if (!deletedCollection)
                return res.status(404).json({ error: "Collection not found." });
            res.status(200).json(deletedCollection);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete collection." });
        }
    })),
    createDynamicImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { baseObjectId } = req.params;
        try {
            const imageUrls = yield (0, suiHelper_1.getLayerImageUrls)(baseObjectId);
            const imageBuffer = yield (0, imageMerge_1.mergeImages)(imageUrls);
            const fileUrl = yield (0, uploadToS3_1.uploadImageBufferToS3)(imageBuffer, `Base/${baseObjectId}.png`);
            res.status(200).json({
                message: "Image generated and uploaded",
                imageUrl: fileUrl,
            });
        }
        catch (error) {
            console.error("generateDynamicImage error:", error);
            res.status(500).json({ error: "Failed to generate image" });
        }
    }),
};
