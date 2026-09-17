import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(currentDirectory, '../../uploads/qualifications');

fs.mkdirSync(uploadDirectory, { recursive: true });

const extensionByMimeType = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
};

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, file, callback) => {
    const extension = extensionByMimeType[file.mimetype];
    callback(null, `qualification-${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (file.fieldname === 'avatar' && !['image/png', 'image/jpeg'].includes(file.mimetype)) {
    return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'avatar'));
  }
  if (!extensionByMimeType[file.mimetype]) {
    return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  }
  callback(null, true);
};

export const qualificationUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const lawyerRegistrationUpload = qualificationUpload.fields([
  { name: 'qualificationDocument', maxCount: 1 },
  { name: 'avatar', maxCount: 1 },
]);
