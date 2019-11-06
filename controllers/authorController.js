const Author = require('../models/author');

module.exports = {
    authorList: async (req, res, next) => {
        try {
            const authorList = await Author.find({})
                .sort([['firstName', 'ascending']])
                .exec();
            res.render('authorList', { title: 'Author List', authorList });
        } catch (err) {
            next(err);
        }
    },
    authorDetails: (req, res) => {
        res.send('TODO: author details ' + req.params.id);
    },
    authorCreateGet: (req, res) => {
        res.send('TODO: author create GET');
    },
    authorCreatePost: (req, res) => {
        res.send('TODO: author create POST');
    },
    authorDeleteGet: (req, res) => {
        res.send('TODO: author delete GET');
    },
    authorDeletePost: (req, res) => {
        res.send('TODO: author delete POST');
    },
    authorUpdateGet: (req, res) => {
        res.send('TODO: author update GET');
    },
    authorUpdatePost: (req, res) => {
        res.send('TODO: author update POST');
    },
};
