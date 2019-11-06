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
    genreDetails: (req, res) => {
        res.send('TODO: genre details ' + req.params.id);
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
