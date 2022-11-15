const express = require("express");
const {
    getCategories,
    getReviews,
    getReviewById,
    getReviewComments
} = require("./controllers/bg.controller");

const app = express()

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewById)
app.get("/api/reviews/:review_id/comments", getReviewComments)



app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.sendStatus(500);
});

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Route not found" });
});



module.exports = app;