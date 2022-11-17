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

describe("GET /api/reviews/", () => {
    test("should return an array of review objects ordered by created date (descending)", () => {
        return request(app)
            .get("/api/reviews/")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy("created_at", { descending: true, coerce: true })
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number),
                        })
                    );
                    expect({ review }).toEqual(
                        expect.not.objectContaining({ review_body: expect.anything() })
                    );
                });
            });
    });

    test("should return an array of review objects ordered by created date (ascending) if the order parameter is given as asc", () => {
        return request(app)
            .get("/api/reviews?order=asc")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy("created_at", { ascending: true });
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            designer: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number),
                        })
                    );
                    expect({ review }).toEqual(
                        expect.not.objectContaining({ review_body: expect.anything() })
                    );
                });
            });
    });

    test("should return a sorted reviews array if sort_by is given", () => {
        return request(app)
            .get("/api/reviews?sort_by=designer&order=asc")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toBeSortedBy("designer", { asc: true });
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(Number),
                        })
                    );
                    expect({ review }).toEqual(
                        expect.not.objectContaining({ review_body: expect.anything() })
                    );
                });
            });
    });

    test("should return a filtered reviews array if the category parameter is given", () => {
        return request(app)
            .get("/api/reviews?category=social deduction")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toHaveLength(11);
                reviews.forEach((review) => {
                    expect(review).toEqual(
                        expect.objectContaining({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: 'social deduction',
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(Number),
                        })
                    );
                    expect({ review }).toEqual(
                        expect.not.objectContaining({ review_body: expect.anything() })
                    );
                });
            });
    });

    test("should return a 400 status code if an invalid sort_by query is entered", () => {
        return request(app)
            .get("/api/reviews?sort_by=a")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toEqual("Bad Request");
            });
    });

    test("should return a 400 status code if an invalid order_by query is entered", () => {
        return request(app)
            .get("/api/reviews?order=a")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toEqual("Bad Request");
            });
    });

    test("should return a 400 status if a category that doesn't exist is entered", () => {
        return request(app)
            .get("/api/reviews?category=nonExistentCategory")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("Category not found");
            });
    });
});

describe('/api/reviews/:review_id', () => {
    describe("GET", () => {
        test("should return the review from the table if the Id is valid", () => {
            return request(app)
                .get("/api/reviews/1")
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toMatchObject({
                        review_id: 1,
                        title: 'Agricola',
                        designer: 'Uwe Rosenberg',
                        owner: 'mallionaire',
                        review_img_url:
                            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Farmyard fun!',
                        category: 'euro game',
                        created_at: '2021-01-18T10:00:20.514Z',
                        votes: 1,
                        comment_count: 0
                    })

                })
        });
        test("should return a 404 status if the Id is invalid (out of range)", () => {
            return request(app)
                .get("/api/reviews/10000")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("review does not exist");
                });
        });
        test("should return a 400 status if the Id is invalid (not a number)", () => {
            return request(app)
                .get("/api/reviews/a")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad request");
                });
        });
        test("should now show comment count having a value higher than 0 if the review has comments", () => {
            return request(app)
                .get("/api/reviews/2")
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toMatchObject({
                        review_id: 2,
                        title: 'Jenga',
                        designer: 'Leslie Scott',
                        owner: 'philippaclaire9',
                        review_img_url:
                            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                        review_body: 'Fiddly fun for all the family',
                        category: 'dexterity',
                        created_at: '2021-01-18T10:01:41.251Z',
                        votes: 5,
                        comment_count: 3
                    })
                })
        })
    });
    describe('PATCH', () => {
        test('should update the votes of a review (adding)', () => {
            const updateVotes = { inc_votes: 50 }
            return request(app)
                .patch("/api/reviews/1")
                .send(updateVotes)
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toMatchObject({
                        "category": "euro game",
                        "created_at": "2021-01-18T10:00:20.514Z",
                        "designer": "Uwe Rosenberg",
                        "owner": "mallionaire",
                        "review_body": "Farmyard fun!",
                        "review_id": 1,
                        "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                        "title": "Agricola",
                        "votes": 51,
                    })
                })
        });
        test('should update the votes of a review (subracting)', () => {
            const updateVotes = { inc_votes: -50 }
            return request(app)
                .patch("/api/reviews/1")
                .send(updateVotes)
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toMatchObject({
                        "category": "euro game",
                        "created_at": "2021-01-18T10:00:20.514Z",
                        "designer": "Uwe Rosenberg",
                        "owner": "mallionaire",
                        "review_body": "Farmyard fun!",
                        "review_id": 1,
                        "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                        "title": "Agricola",
                        "votes": -49,
                    })
                })
        });
        test("should keep the vote count the same if 0 is entered", () => {
            const updateVotes = { inc_votes: 0 }
            return request(app)
                .patch("/api/reviews/1")
                .send(updateVotes)
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toMatchObject({
                        "category": "euro game",
                        "created_at": "2021-01-18T10:00:20.514Z",
                        "designer": "Uwe Rosenberg",
                        "owner": "mallionaire",
                        "review_body": "Farmyard fun!",
                        "review_id": 1,
                        "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                        "title": "Agricola",
                        "votes": 1,
                    })
                })
        });
        test("should return a 404 if a request is made to a review which doesn't exist", () => {
            const updateVotes = { inc_votes: 50 }
            return request(app)
                .patch("/api/reviews/1000000")
                .send(updateVotes)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('review does not exist')
                })
        });
        test("should return a 400 if the id is not a number", () => {
            const updateVotes = { inc_votes: 50 }
            return request(app)
                .patch("/api/reviews/a")
                .send(updateVotes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')
                })
        });
        test("should return a 400 if inc_votes is not a number", () => {
            const updateVotes = { inc_votes: 'a' }
            return request(app)
                .patch("/api/reviews/1")
                .send(updateVotes)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request')
                })
        });
        test("should return a 400 (votes values was incorrect) error if inc_votes is undefined", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send()
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('votes values was incorrect')
                })
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
                    expect(body.review.length).toBeGreaterThan(0)
                    expect(body.review[0]).toMatchObject({
                        body: 'Now this is a story all about how, board games turned my life upside down',
                        votes: 13,
                        author: 'mallionaire',
                        review_id: 2,
                        created_at: '2021-01-18T10:24:05.410Z'
                    })
                })
        });
        test('should return an array sorted by created date', () => {
            return request(app)
                .get("/api/reviews/2/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toBeSortedBy('created_at', { descending: true, coerce: true, })
                })
        })
        test("should return an empty array if there are no comments for the given review", () => {
            return request(app)
                .get("/api/reviews/1/comments")
                .expect(200)
                .then(({ body }) => {
                    expect(body.review.length).toBe(0)
                    expect(body.review).toEqual([])
                })
        });
        test("should return a 404 status if the Id is invalid (out of range)", () => {
            return request(app)
                .get("/api/reviews/10000/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("review does not exist");
                });
        });
        test("should return a 404 status if the Id is invalid (not a number)", () => {
            return request(app)
                .get("/api/reviews/a/comments")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad request");
                });
        });
    });
    describe("POST", () => {
        test("posts the new comment with a status code of 201", () => {
            const newComment = {
                username: "mallionaire",
                body: 'This is something',
            };
            return request(app)
                .post("/api/reviews/1/comments")
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(body.Comment).toMatchObject({
                        comment_id: 7,
                        body: 'This is something',
                        review_id: 1,
                        author: 'mallionaire',
                        votes: 0,
                        created_at: expect.any(String)
                    });
                });
        });
        test("should return a 404 error if the request is made to a review which doesn't exist", () => {
            const newComment = {
                username: "mallionaire",
                body: 'This is something',
            };
            return request(app)
                .post("/api/reviews/100000/comments")
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid review ID');
                });
        });

        test("should return a 404 if the user doesn't exist", () => {
            const newComment = {
                username: "banana",
                body: 'This is something',
            };
            return request(app)
                .post("/api/reviews/1/comments")
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("This user doesn't exist");
                });
        });

        test("should give a 400 status code if a post request is made with a missing key", () => {
            const newComment = {
                author: "mallionaire"
            };

            return request(app)
                .post("/api/reviews/1/comments")
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid comment");
                });
        });

        test("should return a 400 status code if a post request is made with an incorrect key name", () => {
            const newComment = {
                author: "mallionaire",
                comment: 'This is something',
            };

            return request(app)
                .post("/api/reviews/1/comments")
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid comment");
                });
        });

        test("should return a 400 status code if a post request is made with an incorrect value type", () => {
            const newComment = {
                author: 1,
                body: 'This is something',
            };

            return request(app)
                .post("/api/reviews/1/comments")
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Invalid comment");
                });
        });
    });
});

describe("/api/users", () => {
    describe("GET", () => {
        test("should return a table of user objects which have the correct properties", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    expect(body.users.length).toBeGreaterThan(0)
                    body.users.forEach((user) => {
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    })
                });
        });

        test('should return a 404 error if the URL is input incorrectly', () => {
            return request(app)
                .get("/api/user")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Route not found");
                });
        });
    });
});

describe('/api/comments/:comment_id', () => {
    describe('DELETE', () => {
        test('should return a 204 and return an empty body (meaning it was deleted)', () => {
            return request(app)
                .delete("/api/comments/7").expect(204)
        });
        test('should return a 404 error if a invalid comment_id is given (out of range)', () => {
            return request(app)
                .delete("/api/comments/100000").expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("Comment doesn't exist")
                })
        });
        test('should return a 400 error if a invalid comment_id is given (not a number)', () => {
            return request(app)
                .delete("/api/comments/a").expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid comment ID')
                })
        });
    });
});