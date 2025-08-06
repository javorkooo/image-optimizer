const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = `uploads/optimized-${Date.now()}.webp`;

    await sharp(inputPath)
      .resize({ width: 800 }) 
      .toFormat('webp')
      .webp({ quality: 70 }) 
      .toFile(outputPath);

    const optimizedImage = fs.readFileSync(outputPath);
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    res.set('Content-Type', 'image/webp');
    res.send(optimizedImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
