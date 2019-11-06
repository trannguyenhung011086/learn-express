const mongoose = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');

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
    authorDetails: async (req, res, next) => {
        const id = mongoose.Schema.Types.ObjectId(req.params.id);
        try {
            const author = await Author.findById(id).exec();
            if (!author) {
                res.status(404).send('Author not found!');
                return;
            }
            const books = await Book.find({ author: id }).exec();
            res.render('authorDetails', {
                title: 'Author Details',
                author,
                books,
            });
        } catch (err) {
            next(err);
        }
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
