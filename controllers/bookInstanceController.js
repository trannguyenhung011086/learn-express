const BookInstance = require('../models/bookInstance');

module.exports = {
    bookInstanceList: (req, res) => {
        res.send('TODO: book instance list');
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
