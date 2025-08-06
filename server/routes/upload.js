const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function to safely delete file with retry
const safeUnlink = async (filePath, maxRetries = 3, delay = 100) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fs.promises.unlink(filePath);
      return;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, consider it successfully deleted
        return;
      }
      if (i === maxRetries - 1) {
        console.error(`Failed to delete file after ${maxRetries} attempts:`, error);
        return;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

router.post('/', upload.single('image'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    inputPath = req.file.path;
    const format = req.body.format || 'webp'; // Get format from request or default to webp
    outputPath = path.join(
      path.dirname(inputPath),
      `optimized-${Date.now()}.${format}`
    );

    // Image processing pipeline
    let imageProcess = sharp(inputPath)
      .resize(800, null, { // Set max width to 800px, maintain aspect ratio
        withoutEnlargement: true,
        fit: 'inside'
      });

    // Format-specific settings
    switch (format) {
      case 'webp':
        imageProcess = imageProcess.webp({ quality: 80 });
        break;
      case 'jpeg':
      case 'jpg':
        imageProcess = imageProcess.jpeg({ quality: 80 });
        break;
      case 'png':
        imageProcess = imageProcess.png({ quality: 80 });
        break;
      default:
        imageProcess = imageProcess.webp({ quality: 80 });
    }

    // Process and save the image
    await imageProcess.toFile(outputPath);

    // Read the optimized file
    const optimizedImage = fs.readFileSync(outputPath);

    // Send response first
    res.set('Content-Type', `image/${format}`);
    res.send(optimizedImage);

    // Cleanup files after response is sent (with delay to ensure file handles are released)
    setTimeout(async () => {
      if (inputPath) {
        await safeUnlink(inputPath);
      }
      if (outputPath) {
        await safeUnlink(outputPath);
      }
    }, 100);

  } catch (err) {
    console.error('Image processing error:', err);
    
    // Cleanup on error with safe deletion
    setTimeout(async () => {
      if (inputPath) {
        await safeUnlink(inputPath);
      }
      if (outputPath) {
        await safeUnlink(outputPath);
      }
    }, 100);

    res.status(500).json({ 
      error: 'Failed to process image',
      details: err.message 
    });
  }
});

module.exports = router;