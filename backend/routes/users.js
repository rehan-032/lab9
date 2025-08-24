const express = require('express');
const multer = require('multer');
const {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('profile_picture'), registerUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', upload.single('profile_picture'), updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
