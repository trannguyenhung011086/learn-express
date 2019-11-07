const mongoose = require('mongoose');
const yup = require('yup');
const BookInstance = require('../models/bookInstance');
const Book = require('../models/book');

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
        const body = req.body;
        const books = await Book.find({}).exec();

        try {
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
    getDelete: (req, res) => {
        res.send('TODO: book instance delete GET');
    },
    postDelete: (req, res) => {
        res.send('TODO: book instance delete POST');
    },
    getUpdate: (req, res) => {
        res.send('TODO: book instance update GET');
    },
    postUpdate: (req, res) => {
        res.send('TODO: book instance update POST');
    },
};
