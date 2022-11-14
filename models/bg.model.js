const db = require("../db/connection");

exports.fetchCategories = () => {
    console.log(1)
    return db
        .query(
            `select * from categories`
        )
        .then((categories) => {
            console.log(2)
            return categories.rows
        })
}