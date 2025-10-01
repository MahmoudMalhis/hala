const { run, get } = require('../config/db');

exports.getHomeSettings = async (req, res) => {
  try {
    // We expect at most one settings row. Fetch the latest by id.
    const settings = await get('SELECT * FROM home_settings ORDER BY id DESC LIMIT 1');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHomeSettings = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await get('SELECT * FROM home_settings WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ message: 'Not found' });
    }
    const {
      mainTitle_en = existing.mainTitle_en,
      mainTitle_ar = existing.mainTitle_ar,
      subTitle_en = existing.subTitle_en,
      subTitle_ar = existing.subTitle_ar,
      backgroundImage = existing.backgroundImage,
    } = req.body;
    await run(
      'UPDATE home_settings SET mainTitle_en = ?, mainTitle_ar = ?, subTitle_en = ?, subTitle_ar = ?, backgroundImage = ?, updatedAt = datetime("now") WHERE id = ?',
      [mainTitle_en, mainTitle_ar, subTitle_en, subTitle_ar, backgroundImage, id]
    );
    const updated = await get('SELECT * FROM home_settings WHERE id = ?', [id]);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createHomeSettings = async (req, res) => {
  try {
    const {
      mainTitle_en = null,
      mainTitle_ar = null,
      subTitle_en = null,
      subTitle_ar = null,
      backgroundImage = null,
    } = req.body;
    const result = await run(
      'INSERT INTO home_settings (mainTitle_en, mainTitle_ar, subTitle_en, subTitle_ar, backgroundImage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
      [mainTitle_en, mainTitle_ar, subTitle_en, subTitle_ar, backgroundImage]
    );
    const created = await get('SELECT * FROM home_settings WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
