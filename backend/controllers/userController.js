const db = require('../config/db');
const transporter = require('../config/mailer');
const fs = require('fs');
const path = require('path');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const profile_picture = req.file ? req.file.path.replace('\\', '/') : null;

   
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const [result] = await db.execute(
      'INSERT INTO users (name, email, phone, profile_picture) VALUES (?, ?, ?, ?)',
      [name, email, phone, profile_picture]
    );

    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registration Successful',
      html: `<h2>Greetings ${name}!</h2><p>Your registration at University Management System is successful.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registered and confirmation email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const profile_picture = req.file ? req.file.path.replace('\\', '/') : null;

    
    const [existing] = await db.execute('SELECT profile_picture FROM users WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'User not found' });

    if (profile_picture && existing[0].profile_picture) {
      fs.unlink(path.resolve(existing.profile_picture), (err) => {
        if (err) console.log('Failed to delete old file:', err);
      });
    }

    let query = 'UPDATE users SET name = ?, email = ?, phone = ?';
    const params = [name, email, phone];
    if (profile_picture) {
      query += ', profile_picture = ?';
      params.push(profile_picture);
    }
    query += ' WHERE id = ?';
    params.push(req.params.id);

    await db.execute(query, params);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    
    const [existing] = await db.execute('SELECT profile_picture FROM users WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'User not found' });

    if (existing[0].profile_picture) {
      fs.unlink(path.resolve(existing.profile_picture), (err) => {
        if (err) console.log('Failed to delete file:', err);
      });
    }

    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};
