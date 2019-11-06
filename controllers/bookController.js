const mongoose = require('mongoose');
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookInstance');

module.exports = {
    index: async (req, res) => {
        try {
            const bookCount = await Book.countDocuments({}).exec();
            const bookInstanceCount = await BookInstance.countDocuments(
                {},
            ).exec();
            const bookInstanceAvailableCount = await BookInstance.countDocuments(
                { status: 'available' },
            ).exec();
            const authorCount = await Author.countDocuments({}).exec();
            const genreCount = await Genre.countDocuments({}).exec();

            res.render('index', {
                title: 'Local Library Home',
                data: {
                    bookCount,
                    bookInstanceCount,
                    bookInstanceAvailableCount,
                    authorCount,
                    genreCount,
                },
            });
        } catch (err) {
            console.log(err);
            return res.render('index', {
                title: 'Local Library Home',
                error: err,
            });
        }
    },
    getList: async (req, res, next) => {
        try {
            const bookList = await Book.find({})
                .populate('author')
                .exec();
            res.render('bookList', { title: 'Book List', bookList });
        } catch (err) {
            next(err);
        }
    },
    getDetails: async (req, res, next) => {
        const id = mongoose.Schema.Types.ObjectId(req.params.id);
        try {
            const book = await Book.findById(id)
                .populate('author')
                .populate('genre')
                .exec();
            if (!book) {
                res.status(404).send('Book not found!');
                return;
            }
            const bookInstances = await BookInstance.find({
                book: id,
            }).exec();
            res.render('bookDetails', {
                title: 'Book Details',
                book,
                bookInstances,
            });
        } catch (err) {
            next(err);
        }
    },
    getCreate: (req, res) => {
        res.send('TODO: book create GET');
    },
    postCreate: (req, res) => {
        res.send('TODO: book create POST');
    },
    getDelete: (req, res) => {
        res.send('TODO: book delete GET');
    },
    postDelete: (req, res) => {
        res.send('TODO: book delete POST');
    },
    getUpdate: (req, res) => {
        res.send('TODO: book update GET');
    },
    postUpdate: (req, res) => {
        res.send('TODO: book update POST');
    },
};
