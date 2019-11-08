const mongoose = require('mongoose');
const yup = require('yup');
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
        const id = mongoose.Types.ObjectId(req.params.id);
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
        res.render('authorForm', { title: 'Author Form', author: req.body });
    },
    postCreate: async (req, res, next) => {
        const body = req.body;
        try {
            const schema = yup.object().shape({
                firstName: yup
                    .string()
                    .trim()
                    .max(100)
                    .required(),
                lastName: yup
                    .string()
                    .trim()
                    .max(100)
                    .required(),
                dateOfBirth: yup.date(),
                dateOfDeath: yup.date(),
            });

            try {
                await schema.validate(body);
            } catch (err) {
                res.render('authorForm', {
                    title: 'Author Form',
                    author: body,
                    errors: err.errors,
                });
                return;
            }

            const author = await Author.findOne({
                firstName: body.firstName.trim(),
                lastName: body.lastName.trim(),
            }).exec();

            if (author) {
                res.redirect(author.url);
            } else {
                const newAuthor = await Author.create(body);
                res.redirect(newAuthor.url);
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
            const author = await Author.findById(req.params.id).exec();
            if (!author) {
                res.redirect('/catalog/authors');
            }
            const books = await Book.find({ author: req.params.id }).exec();
            res.render('authorDelete', {
                title: 'Author Delete',
                author,
                books,
            });
        } catch (err) {
            next(err);
        }
    },
    postDelete: async (req, res, next) => {
        try {
            const author = await Author.findById(req.params.id).exec();
            const books = await Book.find({ author: req.params.id }).exec();

            if (books.length > 0) {
                res.render('authorDelete', {
                    title: 'Author Delete',
                    author,
                    books,
                });
            }

            await Author.findByIdAndRemove(req.params.id).exec();
            res.redirect('/catalog/authors');
        } catch (err) {
            next(err);
        }
    },
    getUpdate: async (req, res, next) => {
        try {
            const author = await Author.findById(req.params.id).exec();
            res.render('authorForm', {
                title: 'Author Form',
                author,
            });
        } catch (err) {
            next(err);
        }
    },
    postUpdate: async (req, res, next) => {
        try {
            const schema = yup.object().shape({
                firstName: yup
                    .string()
                    .trim()
                    .max(100)
                    .required(),
                lastName: yup
                    .string()
                    .trim()
                    .max(100)
                    .required(),
                dateOfBirth: yup.date(),
                dateOfDeath: yup.date(),
            });
            try {
                await schema.validate(req.body);
            } catch (err) {
                res.render('authorForm', {
                    title: 'Author Form',
                    author: req.body,
                    errors: err.errors,
                });
            }

            const updatedAuthor = await Author.findByIdAndUpdate(
                req.params.id,
                req.body,
            ).exec();
            res.redirect('/catalog/authors');
        } catch (err) {
            next(err);
        }
    },
};
