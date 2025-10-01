const fs = require('fs');
const path = require('path');
const { run, get, all } = require('../config/db');

// Create new room type
exports.createRoomType = async (req, res) => {
  try {
    const { name_en = null, name_ar = null, imageURL = null } = req.body;
    if (!name_en || !name_ar || !imageURL) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const result = await run(
      'INSERT INTO room_types (name_en, name_ar, imageURL, createdAt, updatedAt) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
      [name_en, name_ar, imageURL]
    );
    const newRoom = await get('SELECT * FROM room_types WHERE id = ?', [result.id]);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all room types
exports.getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await all('SELECT * FROM room_types ORDER BY datetime(createdAt) DESC');
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get room type by ID
exports.getRoomTypeById = async (req, res) => {
  try {
    const roomType = await get('SELECT * FROM room_types WHERE id = ?', [req.params.id]);
    if (!roomType) return res.status(404).json({ message: 'Not found' });
    res.json(roomType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room type
exports.updateRoomType = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await get('SELECT * FROM room_types WHERE id = ?', [id]);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const {
      name_en = existing.name_en,
      name_ar = existing.name_ar,
      imageURL = existing.imageURL,
    } = req.body;
    await run(
      'UPDATE room_types SET name_en = ?, name_ar = ?, imageURL = ?, updatedAt = datetime("now") WHERE id = ?',
      [name_en, name_ar, imageURL, id]
    );
    const updated = await get('SELECT * FROM room_types WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete room type
exports.deleteRoomType = async (req, res) => {
  try {
    const id = req.params.id;
    // 1. Find the room type first to get the image data
    const room = await get('SELECT * FROM room_types WHERE id = ?', [id]);
    if (!room) {
      return res.status(404).json({ success: false, message: 'نوع الغرفة غير موجود' });
    }
    // 2. Delete the associated image file if it exists
    if (room.imageURL) {
      try {
        const filename = path.basename(room.imageURL);
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
    // 3. Delete the record from the database
    await run('DELETE FROM room_types WHERE id = ?', [id]);
    res.json({ success: true, message: 'تم حذف نوع الغرفة والملف بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف نوع الغرفة:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
