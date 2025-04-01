// src/controllers/collectionController.ts
import { Request, Response, RequestHandler } from "express";
import { CollectionModel } from "../models/collectionModel";
import { getLayerImageUrls } from "../utils/suiHelper";
import { mergeImages } from "../utils/imageMerge";
import { uploadImageBufferToS3 } from "../utils/uploadToS3";

export const CollectionController = {
  // **Get All Collections**
  getAllCollections: (async (req: Request, res: Response) => {
    try {
      const collections = await CollectionModel.getAllCollections();
      res.status(200).json(collections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collections." });
    }
  }) as RequestHandler,

  // **Get Collection by ID**
  getCollectionById: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const collection = await CollectionModel.getCollectionById(id);
      if (!collection)
        return res.status(404).json({ error: "Collection not found." });
      res.status(200).json(collection);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collection." });
    }
  }) as unknown as RequestHandler,

  // **Get Collections by objectIds**
  getCollectionsByObjectIds: (async (req: Request, res: Response) => {
    try {
      const { objectIds } = req.body;

      if (!Array.isArray(objectIds)) {
        return res.status(400).json({ error: "objectIds must be an array." });
      }

      const collections = await CollectionModel.getCollectionsByObjectIds(
        objectIds,
      );
      res.status(200).json(collections);
    } catch (error) {
      console.error("Error in getCollectionsByObjectIds:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch collections by objectIds." });
    }
  }) as unknown as RequestHandler,

  // **Create New Collection**
  createCollection: (async (req: Request, res: Response) => {
    try {
      const collectionData = req.body;
      const newCollection = await CollectionModel.createCollection(
        collectionData,
      );
      res.status(201).json(newCollection);
    } catch (error) {
      res.status(500).json({ error: "Failed to create collection." });
    }
  }) as RequestHandler,

  // **Update Collection**
  updateCollection: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedCollection = await CollectionModel.updateCollection(
        id,
        updateData,
      );
      if (!updatedCollection)
        return res.status(404).json({ error: "Collection not found." });
      res.status(200).json(updatedCollection);
    } catch (error) {
      res.status(500).json({ error: "Failed to update collection." });
    }
  }) as unknown as RequestHandler,

  // **Delete Collection**
  deleteCollection: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedCollection = await CollectionModel.deleteCollection(id);
      if (!deletedCollection)
        return res.status(404).json({ error: "Collection not found." });
      res.status(200).json(deletedCollection);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete collection." });
    }
  }) as unknown as RequestHandler,

  updateDynamicImage: async (req, res) => {
    const { baseObjectId } = req.params;
    try {
      const imageUrls = await getLayerImageUrls(baseObjectId);
      const imageBuffer = await mergeImages(imageUrls);
      const fileUrl = await uploadImageBufferToS3(
        imageBuffer,
        `Base/${baseObjectId}.png`,
      );
      res.status(200).json({
        message: "Image generated and uploaded",
        imageUrl: fileUrl,
      });
    } catch (error) {
      console.error("generateDynamicImage error:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  },
};
