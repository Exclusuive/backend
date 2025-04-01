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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeImages = mergeImages;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
function mergeImages(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        const width = 512;
        const height = 512;
        const buffers = yield Promise.all(urls.map((url) => __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(url, { responseType: "arraybuffer" });
            return (0, sharp_1.default)(response.data).resize(width, height).toBuffer();
        })));
        const composite = buffers.map((buffer) => ({ input: buffer }));
        const mergedImage = yield (0, sharp_1.default)({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite(composite)
            .png()
            .toBuffer();
        return mergedImage;
    });
}
