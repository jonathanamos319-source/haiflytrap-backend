import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadAssets() {
  console.log('Uploading email assets to Cloudinary...');

  const assets = [
    {
      name: 'logo',
      path: path.resolve(__dirname, '../../../app/public/haifly/logo.webp'),
      options: { folder: 'haifly_email', format: 'png', public_id: 'logo' },
    },
    {
      name: 'website_logo',
      path: path.resolve(__dirname, '../../../app/public/products/HAIFLYLOGO.webp'),
      options: { folder: 'haifly_email', format: 'png', public_id: 'haifly_official_logo' },
    },
    {
      name: 'trap',
      path: path.resolve(__dirname, '../../../app/public/haifly/hai-fly-trap.png'),
      options: { folder: 'haifly_email', format: 'png', public_id: 'hai_fly_trap' },
    },
    {
      name: 'broadkiller',
      path: path.resolve(__dirname, '../../../app/public/haifly/broadkiller.png'),
      options: { folder: 'haifly_email', format: 'png', public_id: 'broadkiller' },
    },
  ];

  const results: Record<string, string> = {};

  for (const asset of assets) {
    try {
      console.log(`Uploading ${asset.name}...`);
      const res = await cloudinary.uploader.upload(asset.path, asset.options);
      console.log(`✅ ${asset.name} uploaded: ${res.secure_url}`);
      results[asset.name] = res.secure_url;
    } catch (err) {
      console.error(`❌ Failed to upload ${asset.name}:`, err);
    }
  }

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log(JSON.stringify(results, null, 2));
}

uploadAssets();
