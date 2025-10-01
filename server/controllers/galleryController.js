const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { run, get, all } = require('../config/db');

// Create new image
exports.createImage = async (req, res) => {
  try {
    const {
      title_en = null,
      title_ar = null,
      description_en = null,
      description_ar = null,
      imageURL = null,
      roomType,
      designType,
      album = null,
    } = req.body;
    if (!imageURL || !roomType || !designType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await run(
      'INSERT INTO gallery_images (title_en, title_ar, description_en, description_ar, imageURL, roomType, designType, album, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
      [title_en, title_ar, description_en, description_ar, imageURL, roomType, designType, album]
    );
    const newImage = await get('SELECT * FROM gallery_images WHERE id = ?', [result.id]);
    res.status(201).json(newImage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all images
exports.getAllImages = async (req, res) => {
  try {
    const filters = [];
    const params = [];
    if (req.query.designType) {
      filters.push('gi.designType = ?');
      params.push(req.query.designType);
    }
    if (req.query.roomType) {
      filters.push('gi.roomType = ?');
      params.push(req.query.roomType);
    }
    let query = `SELECT
      gi.id AS id,
      gi.title_en,
      gi.title_ar,
      gi.description_en,
      gi.description_ar,
      gi.imageURL,
      gi.roomType AS roomTypeId,
      gi.designType AS designTypeId,
      gi.album,
      gi.batchId,
      gi.createdAt,
      gi.updatedAt,
      rt.id AS roomType_id,
      rt.name_en AS roomType_name_en,
      rt.name_ar AS roomType_name_ar,
      rt.imageURL AS roomType_imageURL,
      dt.id AS designType_id,
      dt.name_en AS designType_name_en,
      dt.name_ar AS designType_name_ar,
      dt.imageURL AS designType_imageURL
      FROM gallery_images gi
      LEFT JOIN room_types rt ON gi.roomType = rt.id
      LEFT JOIN design_types dt ON gi.designType = dt.id`;
    if (filters.length) {
      query += ' WHERE ' + filters.join(' AND ');
    }
    query += ' ORDER BY datetime(gi.createdAt) DESC';
    const rows = await all(query, params);
    // Transform joined rows into nested objects similar to Mongoose populate
    const images = rows.map((row) => ({
      id: row.id,
      title_en: row.title_en,
      title_ar: row.title_ar,
      description_en: row.description_en,
      description_ar: row.description_ar,
      imageURL: row.imageURL,
      album: row.album,
      batchId: row.batchId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      roomType: row.roomType_id
        ? {
            id: row.roomType_id,
            name_en: row.roomType_name_en,
            name_ar: row.roomType_name_ar,
            imageURL: row.roomType_imageURL,
          }
        : null,
      designType: row.designType_id
        ? {
            id: row.designType_id,
            name_en: row.designType_name_en,
            name_ar: row.designType_name_ar,
            imageURL: row.designType_imageURL,
          }
        : null,
    }));
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get image by ID
exports.getImageById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = `SELECT
      gi.id AS id,
      gi.title_en,
      gi.title_ar,
      gi.description_en,
      gi.description_ar,
      gi.imageURL,
      gi.roomType AS roomTypeId,
      gi.designType AS designTypeId,
      gi.album,
      gi.batchId,
      gi.createdAt,
      gi.updatedAt,
      rt.id AS roomType_id,
      rt.name_en AS roomType_name_en,
      rt.name_ar AS roomType_name_ar,
      rt.imageURL AS roomType_imageURL,
      dt.id AS designType_id,
      dt.name_en AS designType_name_en,
      dt.name_ar AS designType_name_ar,
      dt.imageURL AS designType_imageURL
      FROM gallery_images gi
      LEFT JOIN room_types rt ON gi.roomType = rt.id
      LEFT JOIN design_types dt ON gi.designType = dt.id
      WHERE gi.id = ?`;
    const row = await get(query, [id]);
    if (!row) return res.status(404).json({ message: 'Image not found' });
    const image = {
      id: row.id,
      title_en: row.title_en,
      title_ar: row.title_ar,
      description_en: row.description_en,
      description_ar: row.description_ar,
      imageURL: row.imageURL,
      album: row.album,
      batchId: row.batchId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      roomType: row.roomType_id
        ? {
            id: row.roomType_id,
            name_en: row.roomType_name_en,
            name_ar: row.roomType_name_ar,
            imageURL: row.roomType_imageURL,
          }
        : null,
      designType: row.designType_id
        ? {
            id: row.designType_id,
            name_en: row.designType_name_en,
            name_ar: row.designType_name_ar,
            imageURL: row.designType_imageURL,
          }
        : null,
    };
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createImagesBatch = async (req, res) => {
  try {
    const {
      images,
      roomType,
      designType,
      title_en = null,
      title_ar = null,
      description_en = null,
      description_ar = null,
      album = null,
    } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'images array is required' });
    }
    if (!roomType || !designType) {
      return res.status(400).json({ message: 'roomType and designType are required' });
    }
    // Generate a batchId using a UUID so that images uploaded together share the same identifier
    const batchId = crypto.randomUUID();
    const insertedRows = [];
    for (const url of images) {
      const result = await run(
        'INSERT INTO gallery_images (title_en, title_ar, description_en, description_ar, imageURL, roomType, designType, album, batchId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
        [title_en, title_ar, description_en, description_ar, url, roomType, designType, album, batchId]
      );
      const row = await get('SELECT * FROM gallery_images WHERE id = ?', [result.id]);
      insertedRows.push(row);
    }
    res.status(201).json(insertedRows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getBatchesByDesignType = async (req, res) => {
  try {
    const { designType } = req.query;
    if (!designType) {
      return res.status(400).json({ message: 'designType query parameter is required' });
    }
    const rows = await all(
      'SELECT * FROM gallery_images WHERE designType = ? ORDER BY batchId ASC, datetime(createdAt) ASC',
      [designType]
    );
    // Group images by batchId
    const groups = rows.reduce((acc, img) => {
      const key = img.batchId || '';
      if (!acc[key]) acc[key] = [];
      acc[key].push(img);
      return acc;
    }, {});
    res.json(Object.values(groups));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update image
exports.updateImage = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await get('SELECT * FROM gallery_images WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const {
      title_en = existing.title_en,
      title_ar = existing.title_ar,
      description_en = existing.description_en,
      description_ar = existing.description_ar,
      imageURL = existing.imageURL,
      roomType = existing.roomType,
      designType = existing.designType,
      album = existing.album,
    } = req.body;
    await run(
      'UPDATE gallery_images SET title_en = ?, title_ar = ?, description_en = ?, description_ar = ?, imageURL = ?, roomType = ?, designType = ?, album = ?, updatedAt = datetime("now") WHERE id = ?',
      [title_en, title_ar, description_en, description_ar, imageURL, roomType, designType, album, id]
    );
    const updated = await get('SELECT * FROM gallery_images WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete image
exports.deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    // 1. Find the image first to get the file path
    const image = await get('SELECT * FROM gallery_images WHERE id = ?', [id]);
    if (!image) {
      return res.status(404).json({ success: false, message: 'الصورة غير موجودة' });
    }
    // 2. Delete the actual file if it exists
    if (image.imageURL) {
      try {
        const filename = path.basename(image.imageURL);
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`تم حذف الملف: ${filePath}`);
        } else {
          console.log(`الملف غير موجود: ${filePath}`);
        }
      } catch (fileError) {
        console.error('خطأ في حذف الملف:', fileError);
      }
    }
    // 3. Delete the record from the database
    await run('DELETE FROM gallery_images WHERE id = ?', [id]);
    res.json({ success: true, message: 'تم حذف الصورة بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
