const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const data = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe('should return a 404 error if an incorrect URL is entered', () => {
    test('should fail if an incorrect URL is entered', () => {
        return request(app)
            .get("/api/category")
            .expect(404)
    });
});

describe('/api/categories', () => {
    describe('GET', () => {
        test('should return an array of category objects', () => {
            return request(app)
                .get("/api/categories")
                .expect(200)
                .then(({ body }) => {
                    expect(body.categories.length).toBeGreaterThan(0)
                    for (let i = 0; i < body.categories.length; i++) {
                        expect(body.categories[i]).toMatchObject({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    }
                })
        });
    });
});

describe('/api/reviews', () => {
    describe('GET', () => {
        test('should return an array of review objects', () => {
            return request(app)
                .get("/api/reviews")
                .expect(200)
                .then(({ body }) => {
                    expect(body.reviews.length).toBeGreaterThan(0)
                    for (let i = 0; i < body.reviews.length; i++) {
                        expect(body.reviews[i]).toMatchObject({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(String)
                        })

                    }
                })
        });

        test('should return an array sorted by created date', () => {
            return request(app)
                .get("/api/reviews")
                .expect(200)
                .then(({ body }) => {
                    expect(body.reviews).toBeSortedBy('created_at', { descending: true, coerce: true, })
                })
        })
    });
});

describe('/api/reviews/:review_id', () => {
    describe("GET", () => {
        test("should return the review from the table if the Id is valid", () => {
            return request(app)
                .get("/api/reviews/1")
                .expect(200)
                .then(({ body }) => {
                    expect(body.review.length).toBeGreaterThan(0)
                    expect(body.review[0]).toMatchObject({
                        review_id: 1,
                        title: 'Agricola',
                        designer: 'Uwe Rosenberg',
                        owner: 'mallionaire',
                        review_img_url:
                            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Farmyard fun!',
                        category: 'euro game',
                        created_at: '2021-01-18T10:00:20.514Z',
                        votes: 1
                    })

                })
        });
        test("should return a 404 status if the Id is invalid", () => {
            return request(app)
                .get("/api/reviews/10000")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toEqual("review does not exist");
                });
        });
        test("should return a 404 status if the Id is invalid", () => {
            return request(app)
                .get("/api/reviews/a")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toEqual("Bad request");
                });
        });
    });
});

describe('/api/reviews/:review_id/comments', () => {
    describe("GET", () => {
        test("should return the review from the table if the Id is valid", () => {
            return request(app)
                .get("/api/reviews/2/comments")
                .expect(200)
                .then(({ body }) => {

                    //expect(body.review.length).toBeGreaterThan(0)
                    expect(body.review[0]).toMatchObject({
                        comment_id: 1,
                        body: 'I loved this game too!',
                        review_id: 2,
                        author: 'bainesface',
                        votes: 16,
                        created_at: '2017-11-22T12:43:33.389Z'
                    })

                })
        });
        test("should return an empty array if there are no comments for the given review", () => {
            return request(app)
                .get("/api/reviews/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.review.length).toEqual(0)
                    expect(body.review).toEqual([])
                })
        });
        test("should return a 404 status if the Id is invalid", () => {
            return request(app)
                .get("/api/reviews/10000/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toEqual("review does not exist");
                });
        });
        test("should return a 404 status if the Id is invalid", () => {
            return request(app)
                .get("/api/reviews/a/comments")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toEqual("Bad request");
                });
        });
    });
});