const express = require('express');
const router = express.Router();

const bookController = require('../controllers/bookController');
const bookInstanceController = require('../controllers/bookInstanceController');
const authorController = require('../controllers/authorController');
const genreController = require('../controllers/genreController');

const authMiddleware = require('../middlewares/authMiddleware');

// index route
router.get('/', bookController.index);

// book routes
router.get('/book/create', bookController.getCreate);
router.post('/book/create', bookController.postCreate);

router.get(
    '/book/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    bookController.getDelete,
);
router.post(
    '/book/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    bookController.postDelete,
);

router.get('/book/:id/update', bookController.getUpdate);
router.post('/book/:id/update', bookController.postUpdate);

router.get('/book/:id', bookController.getDetails);
router.get('/books', bookController.getList);

// author routes
router.get('/author/create', authorController.getCreate);
router.post('/author/create', authorController.postCreate);

router.get(
    '/author/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    authorController.getDelete,
);
router.post(
    '/author/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    authorController.postDelete,
);

router.get('/author/:id/update', authorController.getUpdate);
router.post('/author/:id/update', authorController.postUpdate);

router.get('/author/:id', authorController.getDetails);
router.get('/authors', authorController.getList);

// genre routes
router.get('/genre/create', genreController.getCreate);
router.post('/genre/create', genreController.postCreate);

router.get(
    '/genre/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    genreController.getDelete,
);
router.post(
    '/genre/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    genreController.postDelete,
);

router.get('/genre/:id/update', genreController.getUpdate);
router.post('/genre/:id/update', genreController.postUpdate);

router.get('/genre/:id', genreController.getDetails);
router.get('/genres', genreController.getList);

// book instance routes
router.get('/bookinstance/create', bookInstanceController.getCreate);
router.post('/bookinstance/create', bookInstanceController.postCreate);

router.get(
    '/bookinstance/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    bookInstanceController.getDelete,
);
router.post(
    '/bookinstance/:id/delete',
    authMiddleware.checkPermision('all:delete'),
    bookInstanceController.postDelete,
);

router.get('/bookinstance/:id/update', bookInstanceController.getUpdate);
router.post('/bookinstance/:id/update', bookInstanceController.postUpdate);

router.get('/bookinstance/:id', bookInstanceController.getDetails);
router.get('/bookinstances', bookInstanceController.getList);

module.exports = router;
