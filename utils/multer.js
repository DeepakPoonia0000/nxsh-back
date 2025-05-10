import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // Max 25MB globally
  },
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype;

    // Check and apply size limit based on field
    if (file.fieldname === 'productImages') {
      if (!mime.startsWith('image/')) {
        return cb(new Error('Only image files are allowed for productImages'));
      }
      if (file.size > 10 * 1024 * 1024) {
        return cb(new Error('Image size must be less than 10MB'));
      }
    }

    if (file.fieldname === 'productVideo') {
      if (!mime.startsWith('video/')) {
        return cb(new Error('Only video files are allowed for productVideo'));
      }
      if (file.size > 25 * 1024 * 1024) {
        return cb(new Error('Video size must be less than 25MB'));
      }
    }

    cb(null, true); // Accept file
  }
});

export default upload;