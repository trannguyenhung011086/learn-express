const mongoose = require('mongoose');
const yup = require('yup');
const BookInstance = require('../models/bookInstanceModel');
const Book = require('../models/bookModel');

module.exports = {
    getList: async (req, res, next) => {
        try {
            const bookInstanceList = await BookInstance.find({})
                .populate('book')
                .exec();
            res.render('bookInstanceList', {
                title: 'Book Instance List',
                bookInstanceList,
            });
        } catch (err) {
            next(err);
        }
    },
    getDetails: async (req, res, next) => {
        const id = mongoose.Types.ObjectId(req.params.id);
        try {
            const bookInstance = await BookInstance.findById(id)
                .populate('book')
                .exec();
            if (!bookInstance) {
                res.status(404).send('Book copy not found!');
                return;
            }
            res.render('bookInstanceDetails', {
                title: `Copy: ${bookInstance.book.title}`,
                bookInstance,
            });
        } catch (err) {
            next(err);
        }
    },
    getCreate: async (req, res, next) => {
        try {
            const books = await Book.find({}).exec();
            res.render('bookInstanceForm', {
                title: 'Book Instance Form',
                books,
            });
        } catch (err) {
            next(err);
        }
    },
    postCreate: async (req, res, next) => {
        try {
            const body = req.body;
            const books = await Book.find({}).exec();

            const schema = yup.object().shape({
                book: yup.string().required(),
                imprint: yup.string().required(),
                status: yup
                    .string()
                    .required()
                    .matches(/available|maintenance|borrowed|reserved/),
                dueBack: yup.date(),
            });
            try {
                await schema.validate(body);
            } catch (err) {
                res.render('bookInstanceForm', {
                    title: 'Book Instance Form',
                    books,
                    bookInstance: body,
                    errors: err.errors,
                });
                return;
            }

            const bookInstance = await BookInstance.create(body);
            res.redirect(bookInstance.url);
        } catch (err) {
            if (err.name === 'ValidationError') {
                next(new Error('validation error with Mongo'));
            }
            next(err);
        }
    },
    getDelete: async (req, res, next) => {
        try {
            const bookInstance = await BookInstance.findById(req.params.id)
                .populate('book')
                .exec();
            if (!bookInstance) {
                res.status(404).send('Book copy not found!');
                return;
            }
            res.render('bookInstanceDelete', {
                title: 'Book Instance Delete',
                bookInstance,
            });
        } catch (err) {
            next(err);
        }
    },
    postDelete: async (req, res, next) => {
        try {
            const bookInstance = await BookInstance.findById(req.params.id)
                .populate('book')
                .exec();
            if (
                bookInstance.status === 'available' ||
                bookInstance.status === 'maintenance'
            ) {
                await BookInstance.findByIdAndRemove(req.params.id).exec();
                res.redirect('/catalog/bookinstances');
            } else {
                res.render('bookInstanceDelete', {
                    title: 'Book Instance Delete',
                    bookInstance,
                    error:
                        'Can only delete copy with status Available or Maintenance!',
                });
            }
        } catch (err) {
            next(err);
        }
    },
    getUpdate: async (req, res, next) => {
        try {
            const books = await Book.find({}).exec();
            const bookInstance = await BookInstance.findById(
                req.params.id,
            ).exec();
            res.render('bookInstanceForm', {
                title: 'Book Instance Form',
                books,
                bookInstance,
            });
        } catch (err) {
            next(err);
        }
    },
    postUpdate: async (req, res, next) => {
        try {
            const body = req.body;
            const books = await Book.find({}).exec();

            const schema = yup.object().shape({
                book: yup.string().required(),
                imprint: yup.string().required(),
                status: yup
                    .string()
                    .required()
                    .matches(/available|maintenance|borrowed|reserved/),
                dueBack: yup.date(),
            });
            try {
                await schema.validate(body);
            } catch (err) {
                res.render('bookInstanceForm', {
                    title: 'Book Instance Form',
                    books,
                    bookInstance: body,
                    errors: err.errors,
                });
                return;
            }

            const updatedBookInstance = await BookInstance.findByIdAndUpdate(
                req.params.id,
                body,
            ).exec();
            res.redirect(updatedBookInstance.url);
        } catch (err) {
            if (err.name === 'ValidationError') {
                next(new Error('validation error with Mongo'));
            }
            next(err);
        }
    },
};
