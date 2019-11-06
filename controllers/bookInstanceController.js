const mongoose = require('mongoose');
const BookInstance = require('../models/bookInstance');

module.exports = {
    getList: async (req, res, next) => {
        try {
            const listBookInstance = await BookInstance.find({})
                .populate('book')
                .exec();
            res.render('bookInstanceList', {
                title: 'Book Instance List',
                bookInstanceList: listBookInstance,
            });
        } catch (err) {
            next(err);
        }
    },
    getDetails: async (req, res, next) => {
        const id = mongoose.Schema.Types.ObjectId(req.params.id);
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
    getCreate: (req, res) => {
        res.send('TODO: book instance create GET');
    },
    postCreate: (req, res) => {
        res.send('TODO: book instance create POST');
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
