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

exports.fetchReviews = (sort_by = "created_at", order = "desc", category) => {
    let queryVal = []
    const canBeSorted = ["owner", "category", "created_at", "review_id", "votes", "comment_count", "designer"]
    let queryStr = `SELECT reviews.owner, reviews.review_id, reviews.created_at, reviews.title, reviews.category, reviews.review_img_url, reviews.votes, reviews.designer, reviews.review_body, CAST (COUNT(comments) AS INTEGER) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id`
    if (category) {
        queryVal.push(category)
        queryStr += ` WHERE category = $${queryVal.length}`;
    }
    queryStr += ` GROUP BY reviews.review_id`;
    if (canBeSorted.includes(sort_by)) {
        if ((order === "asc")) {
            queryStr += ` ORDER BY ${sort_by} ASC`;
        } else if ((order === "desc")) {
            queryStr += ` ORDER BY ${sort_by} DESC`;
        } else {
            return Promise.reject({
                status: 400, msg: "Bad Request",
            });
        }
    } else {
        return Promise.reject({
            status: 400, msg: "Bad Request"
        })
    }
    return db.query(queryStr, queryVal).then((reviews) => {
        return reviews.rows;
    });
};


exports.fetchReviewById = (review_id) => {
    return db
        .query(
            `SELECT reviews.*, CAST(COUNT(comments) AS INT) AS comment_count
            FROM reviews 
            LEFT JOIN comments
            ON reviews.review_id = comments.review_id 
            WHERE reviews.review_id = $1
            GROUP BY reviews.review_id`,
            [review_id]
        )
        .then((review) => {
            if (review.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "review does not exist" });
            } else {
                return review.rows[0];
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

exports.updateReviewById = (review_id, inc_votes) => {
    const votes = inc_votes

    if (!votes && votes !== 0 && votes !== -0) {
        return Promise.reject({
            status: 400, msg: 'votes values was incorrect'
        })
    }
    return this.fetchReviewById(review_id)
        .then(() => {
            if (votes === 0 || votes === -0) {
                return db.query(
                    `SELECT * FROM reviews WHERE review_id = $1;`,
                    [review_id]
                ).then((review) => {
                    return review.rows[0]
                })
            } else {
                return db.query(
                    `update reviews set votes = votes + $1 where review_id = $2 returning *;`, [inc_votes, review_id])
                    .then((review) => {
                        return review.rows[0]
                    })
            }
        })
}

exports.fetchUsers = () => {
    return db
        .query(
            `select * from users`
        )
        .then((users) => {
            return users.rows
        })
}