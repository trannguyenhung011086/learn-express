const mongoose = require('mongoose');
const Book = require('../models/book');
const Genre = require('../models/genre');

module.exports = {
    genreList: async (req, res, next) => {
        try {
            const genreList = await Genre.find({})
                .sort([['name', 'ascending']])
                .exec();
            res.render('genreList', { title: 'Genre List', genreList });
        } catch (err) {
            next(err);
        }
    },
    genreDetails: async (req, res, next) => {
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
    genreCreateGet: (req, res) => {
        res.send('TODO: genre create GET');
    },
    genreCreatePost: (req, res) => {
        res.send('TODO: genre create POST');
    },
    genreDeleteGet: (req, res) => {
        res.send('TODO: genre delete GET');
    },
    genreDeletePost: (req, res) => {
        res.send('TODO: genre delete POST');
    },
    genreUpdateGet: (req, res) => {
        res.send('TODO: genre update GET');
    },
    genreUpdatePost: (req, res) => {
        res.send('TODO: genre update POST');
    },
};
