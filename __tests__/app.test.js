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
        test('should return a array of category objects', () => {
            return request(app)
                .get("/api/categories")
                .expect(200)
                .then(({ body }) => {
                    expect(body).toEqual([{ slug: 'euro game', description: 'Abstact games that involve little luck' },
                    {
                        slug: 'social deduction',
                        description: "Players attempt to uncover each other's hidden role"
                    },
                    { slug: 'dexterity', description: 'Games involving physical skill' },
                    { slug: "children's games", description: 'Games suitable for children' }])
                })
        });
    });
});