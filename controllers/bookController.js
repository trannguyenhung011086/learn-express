const mongoose = require('mongoose');
const yup = require('yup');
const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const Genre = require('../models/genreModel');
const BookInstance = require('../models/bookInstanceModel');

module.exports = {
    index: (req, res) => {
        res.redirect('/');
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
            if (!Array.isArray(body.genre)) {
                body.genre = new Array(body.genre);
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
                    .of(yup.string()),
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
    getDelete: async (req, res, next) => {
        try {
            const book = await Book.findById(req.params.id)
                .populate('author')
                .exec();
            if (!book) {
                res.status(404).send('Book not found!');
                return;
            }
            const bookInstances = await BookInstance.find({
                book: req.params.id,
            }).exec();
            res.render('bookDelete', {
                title: 'Book Delete',
                book,
                bookInstances,
            });
        } catch (err) {
            next(err);
        }
    },
    postDelete: async (req, res, next) => {
        try {
            const book = await Book.findById(req.params.id)
                .populate('author')
                .exec();
            const bookInstances = await BookInstance.find({
                book: req.params.id,
            }).exec();
            if (bookInstances.length > 0) {
                res.render('bookDelete', {
                    title: 'Book Delete',
                    book,
                    bookInstances,
                });
            }

            await Book.findByIdAndRemove(req.params.id).exec();
            res.redirect('/catalog/books');
        } catch (err) {
            next(err);
        }
    },
    getUpdate: async (req, res, next) => {
        try {
            const book = await Book.findById(req.params.id)
                .populate('author')
                .populate('genre')
                .exec();
            if (!book) {
                res.status(404).send('Book not found!');
                return;
            }

            const authors = await Author.find({}).exec();
            const genres = await Genre.find({}).exec();

            for (const genre of genres) {
                for (const bookGenre of book.genre) {
                    if (genre._id.toString() === bookGenre._id.toString()) {
                        genre.checked = true;
                    }
                }
            }

            res.render('bookForm', {
                title: 'Book Update',
                book,
                authors,
                genres,
            });
        } catch (err) {
            next(err);
        }
    },
    postUpdate: async (req, res, next) => {
        const body = req.body;
        try {
            if (body.genre === undefined) {
                body.genre = [];
            }
            if (!Array.isArray(body.genre)) {
                body.genre = new Array(body.genre);
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
                    .of(yup.string()),
            });

            try {
                await schema.validate(body);
            } catch (err) {
                for (const genre of genres) {
                    for (const bookGenre of body.genre) {
                        if (genre._id.toString() === bookGenre._id.toString()) {
                            genre.checked = true;
                        }
                    }
                }

                res.render('bookForm', {
                    title: 'Book Update',
                    authors,
                    genres,
                    book: body,
                    errors: err.errors,
                });
            }

            const updatedBook = await Book.findByIdAndUpdate(
                req.params.id,
                body,
            ).exec();
            res.redirect(updatedBook.url);
        } catch (err) {
            next(err);
        }
    },
};
