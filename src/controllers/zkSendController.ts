import { Request, Response, RequestHandler } from "express";
import { enokiClient } from "../EnokiClient";
import { ZkSendLinkBuilder } from "@mysten/zksend";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Inputs, Transaction } from "@mysten/sui/transactions";
import { v4 as uuidv4 } from "uuid";
import { uploadImageBufferToS3 } from "../utils/uploadToS3";
import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

const keypair = Ed25519Keypair.fromSecretKey(
  process.env.SUI_PRIVATE_KEY as string
);

const suiClient = new SuiClient({ url: "https://rpc-testnet.suiscan.xyz:443" });

export interface CreateSponsoredTransactionApiResponse {
  bytes: string;
  digest: string;
}

export interface ExecuteSponsoredTransactionApiInput {
  digest: string;
  signature: string;
}

export interface SponsorTxRequestBody {
  network: "mainnet" | "testnet";
  txBytes: string;
  sender: string;
  allowedAddresses?: string[];
}

// --- 컨트롤러 정의
export const ZkSendController = {
  mintPami: (async (req: Request, res: Response) => {
    const tx = new Transaction();

    const link = new ZkSendLinkBuilder({
      host: "https://dokpami.onrender.com/event",
      sender: keypair.getPublicKey().toSuiAddress(),
      network: "testnet",
    });

    link.addClaimableMist(BigInt(60000000));

    try {
      await link.create({
        signer: keypair,
        // Wait until the new link is ready to be indexed so it is claimable
        waitForTransaction: true,
      });

      res.status(200).json(link.getLink());
    } catch (error) {
      console.error("createLink error:", error);
      res.status(500).json({ error: "Could not create link." });
    }
  }) as RequestHandler,

  executeSponsoredTransaction: (async (req: Request, res: Response) => {
    const { digest, signature }: ExecuteSponsoredTransactionApiInput = req.body;

    try {
      const result = await enokiClient.executeSponsoredTransaction({
        digest,
        signature,
      });

      res.status(200).json({ digest: result.digest });
    } catch (error) {
      console.error("executeSponsoredTransaction error:", error);
      res
        .status(500)
        .json({ error: "Could not execute sponsored transaction block." });
    }
  }) as RequestHandler,

  createSponsoredTransaction: (async (req: Request, res: Response) => {
    const { network, txBytes, sender, allowedAddresses }: SponsorTxRequestBody =
      req.body;

    try {
      const result = await enokiClient.createSponsoredTransaction({
        network,
        transactionKindBytes: txBytes,
        sender,
        allowedAddresses,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("createSponsoredTransaction error:", error);
      res
        .status(500)
        .json({ error: "Could not create sponsored transaction block." });
    }
  }) as RequestHandler,

  balanceGame: (async (req: Request, res: Response) => {
    const { user, name } = req.body;

    const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
    const packageId =
      "0x001f103ed04b5e380e1c69f6c60bbe5cfbd5676ec7a1142203271dc2acdc2d1b";
    const imageUrl = `https://dokpaminft-season2.s3.us-east-1.amazonaws.com/balanceGame/${name}.png`;
    const tx = new Transaction();

    tx.moveCall({
      target: `${packageId}::simple_nft::mint`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(imageUrl),
        tx.pure.address(user),
      ],
    });

    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });
    await suiClient.waitForTransaction({ digest: result.digest });

    res.status(200).json({ digest: result.digest });
  }) as RequestHandler,
};
