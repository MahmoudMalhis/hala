const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { get, run } = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    // Lookup user by name
    const user = await get('SELECT * FROM users WHERE LOWER(name) = LOWER(?)', [name]);
    if (!user) return res.status(401).json({ message: 'بيانات غير صحيحة' });
    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'بيانات غير صحيحة' });
    // Generate JWT using the numeric user ID
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // req.user.id is set by auth middleware from the JWT payload
    const user = await get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    // Hash the new password and update the user record
    const hashed = await bcrypt.hash(newPassword, 10);
    await run('UPDATE users SET password = ?, updatedAt = datetime("now") WHERE id = ?', [hashed, user.id]);
    res.json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
