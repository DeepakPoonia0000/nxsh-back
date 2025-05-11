import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import path from "path";

const { v2 } = cloudinary;

cloudinary.config({
  cloud_name: "dhdk9yop5",
  api_key: "126739441976649",
  api_secret: "hDe9rnUIzmc96__HGmP2-pkeJ6A",
});

// export const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     // Check if file exists before trying to delete it
//     try {
//       await fs.access(localFilePath); // Verifies if the file exists
//       await fs.unlink(localFilePath); // Deletes the file if it exists
//     } catch (accessError) {
//       console.warn(`File ${localFilePath} does not exist or is already deleted.`);
//     }

//     return response;
//   } catch (error) {
//     console.error(`Cloudinary upload failed for ${localFilePath}:`, error);
//     throw error;
//   }
// };


export const uploadOnCloudinary = async (localFilePath, resourceType = "image") => {
  try {
    if (!localFilePath) return null;

    // Cloudinary fails with Windows-style paths sometimes, use forward slashes
    const normalizedPath = localFilePath.replace(/\\/g, "/");

    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: resourceType,
      upload_preset: "localShop", // MUST include this if your preset is signed
      folder: "localShop/productImages"
    });

    try {
      await fs.access(localFilePath);
      await fs.unlink(localFilePath);
    } catch (accessError) {
      console.warn(`File ${localFilePath} does not exist or is already deleted.`);
    }

    return response;
  } catch (error) {
    console.error(`Cloudinary upload failed for ${localFilePath}:`, error);
    throw error;
  }
};


export const destroyFromCloudinary = async (fileLink) => {
  try {
    if (!fileLink) throw new Error("File link is required to delete from Cloudinary");

    // Extract public_id from the URL
    const urlParts = fileLink.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const publicId = fileNameWithExtension.split('.')[0];

    const folderPath = urlParts.slice(urlParts.indexOf('upload') + 1, -1).join('/');
    const fullPublicId = folderPath ? `${folderPath}/${publicId}` : publicId;

    const result = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: 'image',
    });

    if (result.result !== 'ok') {
      console.warn(`Failed to delete image:`, result);
    }

    return result;
  } catch (error) {
    console.error(`Error deleting file from Cloudinary:`, error);
    throw error;
  }
};
