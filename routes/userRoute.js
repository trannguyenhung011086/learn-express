const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', userController.index);

router.get(
    '/register',
    authMiddleware.isLoginRedirect,
    userController.getRegister,
);
router.post(
    '/register',
    authMiddleware.isLoginRedirect,
    userController.postRegister,
);

router.get('/active/:userId&:activeCode', userController.getActive);

router.get('/login', authMiddleware.isLoginRedirect, userController.getLogin);
router.post('/login', authMiddleware.isLoginRedirect, userController.postLogin);

router.get('/logout', userController.postLogout);

router.get(
    '/forgotpassword',
    authMiddleware.isLoginRedirect,
    userController.getForgotPassword,
);
router.post(
    '/forgotpassword',
    authMiddleware.isLoginRedirect,
    userController.postForgotPassword,
);

router.get('/reset/:id', userController.getResetPassword);
router.post('/reset/:id', userController.postResetPassword);

router.post(
    '/:id/logout',
    authMiddleware.validateToken,
    userController.postLogout,
);

router.get(
    '/:id/update',
    authMiddleware.validateToken,
    userController.getUpdate,
);
router.post(
    '/:id/update',
    authMiddleware.validateToken,
    userController.postUpdate,
);

router.get(
    '/:id/delete',
    authMiddleware.validateToken,
    authMiddleware.checkPermision('all:delete'),
    userController.getDelete,
);
router.post(
    '/:id/delete',
    authMiddleware.validateToken,
    authMiddleware.checkPermision('all:delete'),
    userController.postDelete,
);

router.get('/:id', authMiddleware.validateToken, userController.getDetails);

module.exports = router;
