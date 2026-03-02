const multer = require('multer');

// Memory storage exclusively to remove local disk dependency
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for safe memory handling
});

const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'agentCode', maxCount: 1 },
    { name: 'gallery', maxCount: 3 }
]);

module.exports = { upload, cpUpload };
