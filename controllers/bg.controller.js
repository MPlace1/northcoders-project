const {
    fetchCategories,
    fetchReviews,
    fetchReviewById,
    fetchReviewComments
} = require("../models/bg.model");

exports.getCategories = (req, res, next) => {
    fetchCategories()
        .then((categories) => {
            res.status(200).send({ categories })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getReviews = (req, res, next) => {
    fetchReviews()
        .then((reviews) => {
            res.status(200).send({ reviews })
        })
        .catch((err) => {
            next(err)
        })
}

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewById(review_id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getReviewComments = (req, res, next) => {
    const { review_id } = req.params;
    fetchReviewComments(review_id)
        .then((review) => {
            res.status(200).send({ review });
        })
        .catch((err) => {
            next(err);
        });
};