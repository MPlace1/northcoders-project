const {
    fetchCategories,
    fetchReviews,
    fetchReviewById,
    fetchReviewComments,
    addReviewComment,
    updateReviewById
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

exports.postReviewComment = (req, res, next) => {
    const { review_id } = req.params;
    const body = req.body;
    addReviewComment( review_id, body)
        .then((review) => {
            res.status(201).send({ Comment: review[0] });
        })
        .catch((err) => {
            if (err.code === '23503' && err.constraint === 'comments_author_fkey') {
                return next ({
                    status: 404,
                    msg: "This user doesn't exist"
                })
            }
            if (err.code === '23503' && err.constraint === 'comments_review_id_fkey') {
                return next ({
                    status: 404,
                    msg: "Invalid review ID"
                })
            }
            next(err);
        });
};

exports.patchReviewById = (req, res, next) => {
    const { review_id } = req.params
    const { inc_votes } = req.body
    updateReviewById(review_id, inc_votes)
        .then((review) => {
            res.status(200).send({ review })
        })
        .catch((err) => {
            next(err)
        })
}