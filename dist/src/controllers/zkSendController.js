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
exports.ZkSendController = void 0;
const EnokiClient_1 = require("../EnokiClient");
const zksend_1 = require("@mysten/zksend");
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const transactions_1 = require("@mysten/sui/transactions");
const client_1 = require("@mysten/sui/client");
const keypair = ed25519_1.Ed25519Keypair.fromSecretKey(process.env.SUI_PRIVATE_KEY);
const suiClient = new client_1.SuiClient({ url: "https://rpc-testnet.suiscan.xyz:443" });
// --- 컨트롤러 정의
exports.ZkSendController = {
    mintPami: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const tx = new transactions_1.Transaction();
        const link = new zksend_1.ZkSendLinkBuilder({
            host: "https://dokpami.onrender.com/event",
            sender: keypair.getPublicKey().toSuiAddress(),
            network: "testnet",
        });
        link.addClaimableMist(BigInt(60000000));
        try {
            yield link.create({
                signer: keypair,
                // Wait until the new link is ready to be indexed so it is claimable
                waitForTransaction: true,
            });
            res.status(200).json(link.getLink());
        }
        catch (error) {
            console.error("createLink error:", error);
            res.status(500).json({ error: "Could not create link." });
        }
    })),
    executeSponsoredTransaction: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { digest, signature } = req.body;
        try {
            const result = yield EnokiClient_1.enokiClient.executeSponsoredTransaction({
                digest,
                signature,
            });
            res.status(200).json({ digest: result.digest });
        }
        catch (error) {
            console.error("executeSponsoredTransaction error:", error);
            res
                .status(500)
                .json({ error: "Could not execute sponsored transaction block." });
        }
    })),
    createSponsoredTransaction: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { network, txBytes, sender, allowedAddresses } = req.body;
        try {
            const result = yield EnokiClient_1.enokiClient.createSponsoredTransaction({
                network,
                transactionKindBytes: txBytes,
                sender,
                allowedAddresses,
            });
            res.status(200).json(result);
        }
        catch (error) {
            console.error("createSponsoredTransaction error:", error);
            res
                .status(500)
                .json({ error: "Could not create sponsored transaction block." });
        }
    })),
    balanceGame: ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, name } = req.body;
        const suiClient = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)("mainnet") });
        const packageId = "0x97d5691c660a2c7876868ff30a057749d921b2c54579c9972c7f080b349c669d";
        const imageUrl = `https://dokpaminft-season2.s3.us-east-1.amazonaws.com/balanceGame/${name}.png`;
        const tx = new transactions_1.Transaction();
        tx.moveCall({
            target: `${packageId}::simple_nft::mint`,
            arguments: [
                tx.pure.string(name),
                tx.pure.string(imageUrl),
                tx.pure.address(user),
            ],
        });
        const result = yield suiClient.signAndExecuteTransaction({
            signer: keypair,
            transaction: tx,
        });
        yield suiClient.waitForTransaction({ digest: result.digest });
        res.status(200).json({ digest: result.digest });
    })),
};
