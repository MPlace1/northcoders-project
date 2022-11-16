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

exports.fetchReviewComments = (review_id) => {
    return db
        .query(
            `SELECT comments.* FROM comments full outer join reviews on comments.review_id = reviews.review_id WHERE reviews.review_id = $1 ORDER BY comments.created_at desc;`,
            [review_id]
        )
        .then((review) => {
            if (review.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "review does not exist" });
            } else {
                for (let i = 0; i < review.rows.length; i++) {
                    if (review.rows[i].comment_id === undefined || review.rows[i].comment_id === null) {
                        return review.rows = [];
                    } else {
                        return review.rows;
                    }
                }
            }
        });
};

exports.addReviewComment = (review_id, reqBody) => {
    const { username, body } = reqBody;
    if (Object.keys(reqBody).length === 2) {
        const reqKeys = [
            "username",
            "body",
        ];
        bool = Object.keys(reqBody).every((key) => reqKeys.includes(key));
        if (!bool) {
            return Promise.reject({ status: 400, msg: "Invalid comment" });
        }
        return db
            .query(
            `INSERT INTO comments
            (author, body, review_id)
            VALUES ($1, $2, $3)
            RETURNING *;`,
                [username, body, review_id]
            )
            .then((comment) => { 
                return comment.rows;
            });
    } else {
        return Promise.reject({ status: 400, msg: "Invalid comment" });
    }
};
