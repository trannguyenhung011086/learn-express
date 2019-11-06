const mongoose = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');

module.exports = {
    getList: async (req, res, next) => {
        try {
            const authorList = await Author.find({})
                .sort([['firstName', 'ascending']])
                .exec();
            res.render('authorList', { title: 'Author List', authorList });
        } catch (err) {
            next(err);
        }
    },
    getDetails: async (req, res, next) => {
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
    getCreate: (req, res) => {
        res.send('TODO: author create GET');
    },
    postCreate: (req, res) => {
        res.send('TODO: author create POST');
    },
    getDelete: (req, res) => {
        res.send('TODO: author delete GET');
    },
    postDelete: (req, res) => {
        res.send('TODO: author delete POST');
    },
    getUpdate: (req, res) => {
        res.send('TODO: author update GET');
    },
    postUpdate: (req, res) => {
        res.send('TODO: author update POST');
    },
};
