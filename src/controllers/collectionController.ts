// src/controllers/collectionController.ts
import { Request, Response, RequestHandler } from "express";
// import { CollectionModel } from "../models/collectionModel";
import { getLayerImageUrls } from "../utils/suiHelper";
import { mergeImages } from "../utils/imageMerge";
import { uploadImageBufferToS3 } from "../utils/uploadToS3";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { ZkSendLinkBuilder } from "@mysten/zksend";

const client = new SuiClient({ url: getFullnodeUrl("testnet") });

export const CollectionController = {
  updateDynamicImage: (async (req: Request, res: Response) => {
    const { baseObjectId } = req.params;

    try {
      const object = await client.getObject({
        id: baseObjectId,
        options: { showContent: true },
      });
      const imgUrl = (object.data?.content as any)?.fields?.img_url;
      if (!imgUrl) throw new Error("img_url not found in base object");

      const imageUrls = await getLayerImageUrls(
        baseObjectId,
        (object?.data?.content as any)?.fields?.type?.fields?.collection_id
      );
      if (imageUrls.length === 0) throw new Error("No image URLs found");

      console.log(imageUrls);
      const imageBuffer = await mergeImages(imageUrls);

      const url = new URL(imgUrl);
      const s3Key = decodeURIComponent(url.pathname.slice(1));

      await uploadImageBufferToS3(imageBuffer, s3Key);

      res.status(200).json({
        message: "Image updated successfully",
        imageUrl: imgUrl,
      });
    } catch (error) {
      console.error("updateDynamicImage error:", error);
      res.status(500).json({ error: "Failed to update image" });
    }
  }) as RequestHandler,
};
