// src/controllers/collectionController.ts
import { Request, Response, RequestHandler } from "express";
import { CollectionModel } from "../models/collectionModel";

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

  // **Create New Collection**
  createCollection: (async (req: Request, res: Response) => {
    try {
      const collectionData = req.body;
      const newCollection = await CollectionModel.createCollection(
        collectionData
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
        updateData
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
};
