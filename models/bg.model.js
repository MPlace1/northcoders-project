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
            `select * from reviews order by created_at desc`
        )
        .then((categories) => {
            return categories.rows
        })
}