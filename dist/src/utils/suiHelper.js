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
exports.getLayerImageUrls = getLayerImageUrls;
const client_1 = require("@mysten/sui/client");
const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)("testnet") });
function getLayerImageUrls(baseObjectId, collectionId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const dynamicFields = yield client.getDynamicFields({
            parentId: baseObjectId,
        });
        const objectIds = dynamicFields.data.map((f) => f.objectId);
        const objects = yield client.multiGetObjects({
            ids: [collectionId, ...objectIds],
            options: { showContent: true },
        });
        const content = (_b = (_a = objects[0].data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.fields;
        const layerTypes = content.layer_types.fields.contents.map((entry) => entry.fields.type);
        const imageUrls = objects
            .map((obj) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            try {
                const layer = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = obj.data) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.fields) === null || _e === void 0 ? void 0 : _e.socket) === null || _f === void 0 ? void 0 : _f.fields.type) === null || _g === void 0 ? void 0 : _g.fields) === null || _h === void 0 ? void 0 : _h.type;
                const imgUrl = (_q = (_p = (_o = (_m = (_l = (_k = (_j = obj.data) === null || _j === void 0 ? void 0 : _j.content) === null || _k === void 0 ? void 0 : _k.fields) === null || _l === void 0 ? void 0 : _l.value) === null || _m === void 0 ? void 0 : _m.fields) === null || _o === void 0 ? void 0 : _o.socket) === null || _p === void 0 ? void 0 : _p.fields) === null || _q === void 0 ? void 0 : _q.img_url;
                return { layer, imgUrl };
            }
            catch (e) {
                console.error("Failed to extract img_url:", e);
                return null;
            }
        })
            .filter((url) => url !== null);
        const orderedImageUrls = layerTypes
            .map((layerType) => {
            const found = imageUrls.find((image) => image.layer === layerType);
            return found ? found.imgUrl : null;
        })
            .filter((url) => url !== null);
        return orderedImageUrls;
    });
}
