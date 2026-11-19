"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
dotenv_1.default.config();
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function uploadAssets() {
    console.log('Uploading email assets to Cloudinary...');
    const assets = [
        {
            name: 'logo',
            path: path_1.default.resolve(__dirname, '../../../app/public/haifly/logo.webp'),
            options: { folder: 'haifly_email', format: 'png', public_id: 'logo' },
        },
        {
            name: 'website_logo',
            path: path_1.default.resolve(__dirname, '../../../app/public/products/HAIFLYLOGO.webp'),
            options: { folder: 'haifly_email', format: 'png', public_id: 'haifly_official_logo' },
        },
        {
            name: 'trap',
            path: path_1.default.resolve(__dirname, '../../../app/public/haifly/hai-fly-trap.png'),
            options: { folder: 'haifly_email', format: 'png', public_id: 'hai_fly_trap' },
        },
        {
            name: 'broadkiller',
            path: path_1.default.resolve(__dirname, '../../../app/public/haifly/broadkiller.png'),
            options: { folder: 'haifly_email', format: 'png', public_id: 'broadkiller' },
        },
    ];
    const results = {};
    for (const asset of assets) {
        try {
            console.log(`Uploading ${asset.name}...`);
            const res = await cloudinary_1.v2.uploader.upload(asset.path, asset.options);
            console.log(`✅ ${asset.name} uploaded: ${res.secure_url}`);
            results[asset.name] = res.secure_url;
        }
        catch (err) {
            console.error(`❌ Failed to upload ${asset.name}:`, err);
        }
    }
    console.log('\n--- UPLOAD SUMMARY ---');
    console.log(JSON.stringify(results, null, 2));
}
uploadAssets();
//# sourceMappingURL=uploadEmailAssets.js.map