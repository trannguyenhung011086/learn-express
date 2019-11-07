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
        res.render('genreForm', { title: 'Genre Form' });
    },
    postCreate: async (req, res, next) => {
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

            const genre = await Genre.findOne({
                name: req.body.name.trim(),
            }).exec();

            if (genre) {
                res.redirect(genre.url);
            } else {
                const newGenre = await Genre.create({
                    name: req.body.name.toLowerCase(),
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
