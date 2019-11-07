const mongoose = require('mongoose');
const yup = require('yup');
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
            res.render('index', {
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
        const id = mongoose.Types.ObjectId(req.params.id);
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
    getCreate: async (req, res, next) => {
        try {
            const authors = await Author.find({}).exec();
            const genres = await Genre.find({}).exec();
            res.render('bookForm', {
                title: 'Book Form',
                authors,
                genres,
                book: req.body,
            });
        } catch (err) {
            next(err);
        }
    },
    postCreate: async (req, res, next) => {
        const body = req.body;
        try {
            if (body.genre === undefined) {
                body.genre = [];
            }

            const authors = await Author.find({}).exec();
            const genres = await Genre.find({}).exec();

            const schema = yup.object().shape({
                title: yup.string().required(),
                author: yup.string().required(),
                summary: yup.string().required(),
                isbn: yup.string().required(),
                genre: yup
                    .array()
                    .min(1)
                    .of(yup.string().required()),
            });
            try {
                await schema.validate(body);
            } catch (err) {
                res.render('bookForm', {
                    title: 'Book Form',
                    authors,
                    genres,
                    errors: err.errors,
                });
                return;
            }

            // for (let i = 0; i < genres.length; i++) {
            //     if (body.genre.includes(genres[i]._id)) {
            //         genres[i].checked = true;
            //     }
            // }

            const book = await Book.findOne({
                title: body.title.trim(),
            }).exec();

            if (book) {
                res.redirect(book.url);
            } else {
                const newBook = await Book.create(body);
                res.redirect(newBook.url);
            }
        } catch (err) {
            if (err.name === 'ValidationError') {
                next(new Error('validation error with Mongo'));
            }
            next(err);
        }
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
