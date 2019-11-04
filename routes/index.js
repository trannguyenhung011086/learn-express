const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator/check');

const Post = require('../database/models/Post');

router.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('home', { title: 'Post List', data: posts });
});

router.get('/posts/new', (req, res) => {
    res.render('form', { title: 'Post Form' });
});

router.post(
    '/posts/store',
    [
        body('title')
            .isLength({ min: 1 })
            .withMessage('Please enter a title'),
        body('description')
            .isLength({ min: 1 })
            .withMessage('Please enter description'),
        body('content')
            .isLength({ min: 1 })
            .withMessage('Please enter content'),
    ],
    async (req, res) => {
        const errors = await validationResult(req);
        if (errors.isEmpty()) {
            await Post.create(req.body);
            res.redirect('/');
        } else {
            res.render('form', {
                title: 'Post Form',
                errors: errors.array(),
                data: req.body,
            });
        }
    },
);

router.get('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('post', {
        title: 'Post Details',
        data: post,
    });
});

module.exports = router;
