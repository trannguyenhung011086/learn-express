const BookInstance = require('../models/bookInstance');

module.exports = {
    bookInstanceList: async (req, res, next) => {
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
    bookInstanceDetails: (req, res) => {
        res.send('TODO: book instance details ' + req.params.id);
    },
    bookInstanceCreateGet: (req, res) => {
        res.send('TODO: book instance create GET');
    },
    bookInstanceCreatePost: (req, res) => {
        res.send('TODO: book instance create POST');
    },
    bookInstanceDeleteGet: (req, res) => {
        res.send('TODO: book instance delete GET');
    },
    bookInstanceDeletePost: (req, res) => {
        res.send('TODO: book instance delete POST');
    },
    bookInstanceUpdateGet: (req, res) => {
        res.send('TODO: book instance update GET');
    },
    bookInstanceUpdatePost: (req, res) => {
        res.send('TODO: book instance update POST');
    },
};
