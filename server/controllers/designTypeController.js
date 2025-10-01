// controllers/designTypeController.js
const path = require('path');
const fs = require('fs');
const { run, get, all } = require('../config/db');

exports.getAllDesignTypes = async (req, res) => {
  try {
    const types = await all('SELECT * FROM design_types ORDER BY datetime(createdAt) DESC');
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDesignTypeById = async (req, res) => {
  try {
    const type = await get('SELECT * FROM design_types WHERE id = ?', [req.params.id]);
    if (!type) return res.status(404).json({ message: 'لم يتم العثور على النوع' });
    res.json(type);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDesignType = async (req, res) => {
  try {
    const { name_en = null, name_ar = null, imageURL = null } = req.body;
    if (!name_en || !name_ar || !imageURL) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await run(
      'INSERT INTO design_types (name_en, name_ar, imageURL, createdAt, updatedAt) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
      [name_en, name_ar, imageURL]
    );
    const newType = await get('SELECT * FROM design_types WHERE id = ?', [result.id]);
    res.status(201).json(newType);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDesignType = async (req, res) => {
  try {
    const id = req.params.id;
    const designType = await get('SELECT * FROM design_types WHERE id = ?', [id]);
    if (!designType) {
      return res.status(404).json({ message: 'نوع التصميم غير موجود' });
    }
    if (designType.imageURL) {
      try {
        const filename = path.basename(designType.imageURL);
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
    await run('DELETE FROM design_types WHERE id = ?', [id]);
    res.json({ message: 'تم حذف نوع التصميم والملف بنجاح' });
  } catch (err) {
    console.error('خطأ في حذف نوع التصميم:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateDesignType = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await get('SELECT * FROM design_types WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: 'لم يتم العثور على النوع' });
    }
    const {
      name_en = existing.name_en,
      name_ar = existing.name_ar,
      imageURL = existing.imageURL,
    } = req.body;
    await run(
      'UPDATE design_types SET name_en = ?, name_ar = ?, imageURL = ?, updatedAt = datetime("now") WHERE id = ?',
      [name_en, name_ar, imageURL, id]
    );
    const updated = await get('SELECT * FROM design_types WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
