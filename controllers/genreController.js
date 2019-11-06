const mongoose = require('mongoose');
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
        const id = mongoose.Schema.Types.ObjectId(req.params.id);
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
        res.send('TODO: genre create GET');
    },
    postCreate: (req, res) => {
        res.send('TODO: genre create POST');
    },
    getDelete: (req, res) => {
        res.send('TODO: genre delete GET');
    },
    postDelete: (req, res) => {
        res.send('TODO: genre delete POST');
    },
    getUpdate: (req, res) => {
        res.send('TODO: genre update GET');
    },
    postUpdate: (req, res) => {
        res.send('TODO: genre update POST');
    },
};
