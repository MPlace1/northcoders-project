# Project for northcoders

This project was to create an app for board game reviews where users are able to have their input.

Users are able to add comments to reviews as well add a vote showing if they liked the review or not. Hopefully, there will be more features in the future.

---------

There are a few steps that need to be done in order to set this up:

## 1. CLONE THE REPO

to clone the repo, run this comand in the terminal:
```
$ git clone https://github.com/MPlace1/northcoders-project.git
```

## 2. INSTALL DEPENDENCIES

to install the dependencies, run the command:
```
$ npm ci
```

## 3. DOTENV

in order to successfully use the project locally two files need to be made:
```
.env.test
.env.development
```

These will need to have 
`PGDATABASE=<databse_name_here>`
entered in, with each each file having the correct database name enetered for that environment.
The database names can be found in `db/setup.sql`

## 4. SEED THE LOCAL DATABASE

to seed the local database run these following commands:

```
$ npm run setup-dbs
$ npm run seed
```

## 5. RUNNING TESTS

To run a test, you can use either of the following commands:
```
$ npm t
```
OR
```
$ npm test
```
---
### Requirements

This project was created using:
```
$ node -v | v17.8.0
$ psql -V | 12.9
```
you can use the commands above to check the versions on your systems.


---
If you want to access the app online use the link below
```
https://be-board-game-reviews-project.cyclic.app/api
```
