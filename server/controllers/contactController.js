const { run, get } = require('../config/db');

// Get contact settings
exports.getContactSettings = async (req, res) => {
  try {
    const settings = await get('SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1');
    if (!settings) {
      return res.json(null);
    }
    // Parse JSON fields before sending
    const parsed = {
      ...settings,
      backgroundImage: settings.backgroundImage ? JSON.parse(settings.backgroundImage) : [],
      address: settings.address ? JSON.parse(settings.address) : [],
      otherLinks: settings.otherLinks ? JSON.parse(settings.otherLinks) : [],
    };
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact settings
exports.updateContactSettings = async (req, res) => {
  try {
    // We expect only one contact settings row. If it exists, update it;
    // otherwise create a new one. We store arrays and objects as JSON strings.
    const existing = await get('SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1');
    const {
      backgroundImage = existing?.backgroundImage ? JSON.parse(existing.backgroundImage) : [],
      address = existing?.address ? JSON.parse(existing.address) : [],
      instagram = existing?.instagram || null,
      facebook = existing?.facebook || null,
      whatsapp = existing?.whatsapp || null,
      otherLinks = existing?.otherLinks ? JSON.parse(existing.otherLinks) : [],
    } = req.body;
    // Serialize arrays/objects back to JSON strings for storage
    const serializedBg = JSON.stringify(backgroundImage);
    const serializedAddr = JSON.stringify(address);
    const serializedLinks = JSON.stringify(otherLinks);
    if (existing) {
      await run(
        'UPDATE contact_settings SET backgroundImage = ?, address = ?, instagram = ?, facebook = ?, whatsapp = ?, otherLinks = ?, updatedAt = datetime("now") WHERE id = ?',
        [serializedBg, serializedAddr, instagram, facebook, whatsapp, serializedLinks, existing.id]
      );
      const updated = await get('SELECT * FROM contact_settings WHERE id = ?', [existing.id]);
      const parsed = {
        ...updated,
        backgroundImage: updated.backgroundImage ? JSON.parse(updated.backgroundImage) : [],
        address: updated.address ? JSON.parse(updated.address) : [],
        otherLinks: updated.otherLinks ? JSON.parse(updated.otherLinks) : [],
      };
      res.json(parsed);
    } else {
      const result = await run(
        'INSERT INTO contact_settings (backgroundImage, address, instagram, facebook, whatsapp, otherLinks, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
        [serializedBg, serializedAddr, instagram, facebook, whatsapp, serializedLinks]
      );
      const created = await get('SELECT * FROM contact_settings WHERE id = ?', [result.id]);
      const parsed = {
        ...created,
        backgroundImage: created.backgroundImage ? JSON.parse(created.backgroundImage) : [],
        address: created.address ? JSON.parse(created.address) : [],
        otherLinks: created.otherLinks ? JSON.parse(created.otherLinks) : [],
      };
      res.json(parsed);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
