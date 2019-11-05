const Author = require('../models/author');

module.exports = {
    authorList: (req, res) => {
        res.send('TODO: author list');
    },
    authorDetails: (req, res) => {
        res.send('TODO: author details ' + req.params.id);
    },
    authorCreateGet: (req, res) => {
        res.send('TODO: author create GET');
    },
    authorCreatePost: (req, res) => {
        res.send('TODO: author create POST');
    },
    authorDeleteGet: (req, res) => {
        res.send('TODO: author delete GET');
    },
    authorDeletePost: (req, res) => {
        res.send('TODO: author delete POST');
    },
    authorUpdateGet: (req, res) => {
        res.send('TODO: author update GET');
    },
    authorUpdatePost: (req, res) => {
        res.send('TODO: author update POST');
    },
};
