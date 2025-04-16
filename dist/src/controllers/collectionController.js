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
const client_1 = require("@mysten/sui/client");
const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)("testnet") });
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
    updateDynamicImage: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { baseObjectId } = req.params;
        try {
            const object = yield client.getObject({
                id: baseObjectId,
                options: { showContent: true },
            });
            const imgUrl = (_c = (_b = (_a = object.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c.img_url;
            if (!imgUrl)
                throw new Error("img_url not found in base object");
            const imageUrls = yield (0, suiHelper_1.getLayerImageUrls)(baseObjectId, (_h = (_g = (_f = (_e = (_d = object === null || object === void 0 ? void 0 : object.data) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.fields) === null || _f === void 0 ? void 0 : _f.type) === null || _g === void 0 ? void 0 : _g.fields) === null || _h === void 0 ? void 0 : _h.collection_id);
            if (imageUrls.length === 0)
                throw new Error("No image URLs found");
            console.log(imageUrls);
            const imageBuffer = yield (0, imageMerge_1.mergeImages)(imageUrls);
            const url = new URL(imgUrl);
            const s3Key = decodeURIComponent(url.pathname.slice(1));
            yield (0, uploadToS3_1.uploadImageBufferToS3)(imageBuffer, s3Key);
            res.status(200).json({
                message: "Image updated successfully",
                imageUrl: imgUrl,
            });
        }
        catch (error) {
            console.error("updateDynamicImage error:", error);
            res.status(500).json({ error: "Failed to update image" });
        }
    })),
};
