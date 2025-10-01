const path = require('path');
const fs = require('fs');
// Import helper functions from the SQLite wrapper. We'll use these to run
// queries instead of relying on Mongoose.
const { run, get, all } = require('../config/db');

exports.getAllSections = async (req, res) => {
  try {
    // Fetch all about sections ordered by creation time ascending
    const sections = await all(
      'SELECT * FROM about_sections ORDER BY datetime(createdAt) ASC'
    );
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    const {
      title_en = null,
      title_ar = null,
      description_en = null,
      description_ar = null,
      imageURL = '',
      order,
    } = req.body;
    if (order === undefined) {
      return res.status(400).json({ message: 'order is required' });
    }
    // Insert the new section
    const result = await run(
      'INSERT INTO about_sections (title_en, title_ar, description_en, description_ar, imageURL, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
      [title_en, title_ar, description_en, description_ar, imageURL, order]
    );
    // Retrieve the inserted row
    const newSection = await get(
      'SELECT * FROM about_sections WHERE id = ?',
      [result.id]
    );
    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const id = req.params.id;
    // First check if section exists
    const existing = await get('SELECT * FROM about_sections WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: 'Not found' });
    }
    const {
      title_en = existing.title_en,
      title_ar = existing.title_ar,
      description_en = existing.description_en,
      description_ar = existing.description_ar,
      imageURL = existing.imageURL,
      order = existing.order,
    } = req.body;
    await run(
      'UPDATE about_sections SET title_en = ?, title_ar = ?, description_en = ?, description_ar = ?, imageURL = ?, "order" = ?, updatedAt = datetime("now") WHERE id = ?',
      [title_en, title_ar, description_en, description_ar, imageURL, order, id]
    );
    const updated = await get('SELECT * FROM about_sections WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const id = req.params.id;
    // Find the section to get the image URL
    const section = await get('SELECT * FROM about_sections WHERE id = ?', [id]);
    if (!section) {
      return res.status(404).json({ success: false, message: 'القسم غير موجود' });
    }
    // Delete associated image file if present
    if (section.imageURL) {
      try {
        const filename = path.basename(section.imageURL);
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log('تم حذف الملف بنجاح:', filename);
        } else {
          console.warn('الملف غير موجود:', filePath);
        }
      } catch (fileError) {
        console.error('حدث خطأ أثناء حذف الملف:', fileError);
      }
    }
    // Delete the record
    await run('DELETE FROM about_sections WHERE id = ?', [id]);
    res.json({ success: true, message: 'تم حذف القسم والملف بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف القسم:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
