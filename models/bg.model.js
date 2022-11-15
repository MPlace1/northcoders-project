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
            `select reviews.*, count(comments.review_id) as comment_count from reviews outer join comments on reviews.review_id = comments.review_id order by reviews.created_at desc`
        )
        .then((reviews) => {
            return reviews.rows
        })
}