const mongoose = require('mongoose');
const yup = require('yup');
const Book = require('../models/book');
const Genre = require('../models/genre');

module.exports = {
    getList: async (req, res, next) => {
        try {
            const genreList = await Genre.find({})
                .sort([['name', 'ascending']])
                .exec();
            res.render('genreList', { title: 'Genre List', genreList });
        } catch (err) {
            next(err);
        }
    },
    getDetails: async (req, res, next) => {
        const id = mongoose.Types.ObjectId(req.params.id);
        try {
            const genre = await Genre.findById(id).exec();
            if (!genre) {
                res.status(404).send('Genre not found!');
                return;
            }
            const genreBooks = await Book.find({ genre: id }).exec();
            res.render('genreDetails', {
                title: 'Genre Details',
                genre,
                genreBooks,
            });
        } catch (err) {
            next(err);
        }
    },
    getCreate: (req, res) => {
        res.render('genreForm', { title: 'Genre Form', genre: req.body });
    },
    postCreate: async (req, res, next) => {
        const body = req.body;
        try {
            const schema = yup.object().shape({
                name: yup
                    .string()
                    .trim()
                    .lowercase()
                    .min(3)
                    .max(100)
                    .matches(
                        /poetry|fantasy|fiction|romance|horror|history|textbook/,
                    )
                    .required(),
            });

            try {
                await schema.validate(body);
            } catch (err) {
                res.render('genreForm', {
                    title: 'Genre Form',
                    genre: body.name,
                    errors: err.errors,
                });
                return;
            }

            const genre = await Genre.findOne({
                name: body.name.trim(),
            }).exec();

            if (genre) {
                res.redirect(genre.url);
            } else {
                const newGenre = await Genre.create({
                    name: body.name.toLowerCase(),
                });
                res.redirect(newGenre.url);
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
            const genre = await Genre.findById(req.params.id).exec();
            if (!genre) {
                res.status(404).send('Genre not found!');
            }
            const books = await Book.find({}).exec();

            let usedBooks = [];
            for (const book of books) {
                for (const genreBook of book.genre) {
                    if (genreBook.toString() === genre._id.toString()) {
                        usedBooks.push(book);
                    }
                }
            }

            res.render('genreDelete', {
                title: 'Genre Delete',
                genre,
                usedBooks,
            });
        } catch (err) {
            next(err);
        }
    },
    postDelete: async (req, res, next) => {
        try {
            const genre = await Genre.findById(req.params.id).exec();
            const books = await Book.find({}).exec();

            let usedBooks = [];
            for (const book of books) {
                for (const genreBook of book.genre) {
                    if (genreBook.toString() === genre._id.toString()) {
                        usedBooks.push(book);
                    }
                }
            }

            if (usedBooks.length > 0) {
                res.render('genreDelete', {
                    title: 'Genre Delete',
                    genre,
                    usedBooks,
                });
            }

            await Genre.findByIdAndRemove(req.params.id).exec();
            res.redirect('/catalog/genres');
        } catch (err) {
            next(err);
        }
    },
    getUpdate: async (req, res, next) => {
        try {
            const genre = await Genre.findById(req.params.id).exec();
            res.render('genreForm', { title: 'Genre Form', genre });
        } catch (err) {
            next(err);
        }
    },
    postUpdate: async (req, res, next) => {
        try {
            const schema = yup.object().shape({
                name: yup
                    .string()
                    .trim()
                    .lowercase()
                    .min(3)
                    .max(100)
                    .matches(
                        /poetry|fantasy|fiction|romance|horror|history|textbook/,
                    )
                    .required(),
            });

            try {
                await schema.validate(req.body);
            } catch (err) {
                res.render('genreForm', {
                    title: 'Genre Form',
                    genre: req.body.name,
                    errors: err.errors,
                });
                return;
            }

            const updatedGenre = await Genre.findByIdAndUpdate(
                req.params.id,
                req.body,
            ).exec();
            res.redirect(updatedGenre.url);
        } catch (err) {
            next(err);
        }
    },
};
