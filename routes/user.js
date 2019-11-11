const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/', userController.index);

router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

router.get('/forgotpassword', userController.getForgotPassword);
router.post('/forgotpassword', userController.postForgotPassword);

router.get('/:id', userController.getDetails);

router.post('/:id/logout', userController.postLogout);

router.get('/:id/update', userController.getUpdate);
router.post('/:id/update', userController.postUpdate);

router.get('/:id/delete', userController.getDelete);
router.post('/:id/delete', userController.postDelete);

module.exports = router;
