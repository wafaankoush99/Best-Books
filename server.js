'use strict';

const express = require('express');

require('dotenv').config();

const cors = require('cors');

const server = express();

const superagent = require('superagent');

const pg = require('pg');

const PORT = process.env.PORT || 4000;

server.use(cors());

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));

server.set('view engine', 'ejs');

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
    // , ssl: { rejectUnauthorized: false }
});

// server.get('/', (req, res) => {
//     res.render('./pages/index');
// });



server.get('/', (req, res) => {
    let SQL = `SELECT * FROM books;`;
    client.query(SQL)
        .then(result=>{
            // console.log(result.body);
            res.render('./pages/index', {booksResults: result.rows});
        });
});




server.get('/searches/new', (req, res) => {
    res.render('./pages/searches/new');
});


server.post('/searches', (req, res) => {
    // console.log(req.body);
    let search = req.body.search;
    let term = req.body.intitle;
    // let SQL = `INSERT INTO books (title, author, isbn, img, description) VALUES ($1,$2,$3,$4,$5);`;
    // let safeValues = [req.body.title,req.body.author,req.body.identifier,req.body.image,req.body.description];
    let url = `https://www.googleapis.com/books/v1/volumes?q=+${term}:${search}`;
    superagent.get(url)
        .then(data => {
            let books = data.body.items.map(book => new Book(book));
            console.log(books);
            res.render('pages/searches/show', { books: books });
        });
});


function Book(data) {

    this.title = (data.volumeInfo.title) ? data.volumeInfo.title : 'Title N/A' ;
    this.author = (data.volumeInfo.authors)? data.volumeInfo.authors: 'Author N/A' ;
    this.description = (data.volumeInfo.description)? data.volumeInfo.description: 'Description N/A' ;
    this.identifier = (data.volumeInfo.industryIdentifiers)?data.volumeInfo.industryIdentifiers[0].identifier : 'ISBN N/A' ;
    this.image = (data.volumeInfo.imageLinks) ? data.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';

}



server.get('*',(req,res)=>{
    let errorObject = {
        status: 500,
        responseText: 'Sorry, something went wrong'
    };
    res.render('./pages/error',{errorObject});
});




client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Listening to PORT ${PORT}`);
        });
    });
