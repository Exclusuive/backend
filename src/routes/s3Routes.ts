import express, { Request, Response } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

router.post("/requestS3Permission", async (req: any, res: any) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ error: "fileName and fileType are required" });
    }
    console.log(fileName);
    const key = `${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 1분 유효

    res.json({
      uploadUrl: signedUrl,
      fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (error: any) {
    console.error("❌ Error creating S3 presigned URL:", error);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

export default router;
