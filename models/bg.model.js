const db = require("../db/connection");

exports.fetchCategories = () => {
    return db
        .query(
            `select * from categories`
        )
        .then((categories) => {
            return categories.rows
        })
}

exports.fetchReviews = () => {
    return db
        .query(
            `select reviews.*, (select count(*) from comments where comments.review_id = reviews.review_id) as comment_count from reviews full outer join comments on reviews.review_id = comments.review_id order by reviews.created_at desc`
        )
        .then((reviews) => {
            return reviews.rows
        })
}

exports.fetchReviewById = (review_id) => {
    return db
        .query(
            `SELECT * FROM reviews WHERE review_id = $1;`,
            [review_id]
        )
        .then((review) => {
            if (review.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "review does not exist" });
            } else {
                return review.rows;
            }
        });
};