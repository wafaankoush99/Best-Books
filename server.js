'use strict';

const express = require('express');

require('dotenv').config();

const cors = require('cors');

const server = express();

const superagent = require('superagent');

const PORT = process.env.PORT || 5000;

server.use(cors());

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));

server.set('view engine', 'ejs');

// server.use(express.static('public'));

server.get('/', (req, res) => {
    res.render('./pages/index');
});

server.post('/searches', (req, res) => {
    // console.log(req.query);
    let searchBy = req.body.words;
    let words = req.body.searchBy;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${searchBy}+${words}`;
    superagent.get(url)
        .then(data => {
            let books = data.body.items.map(book => new Book(book));
            console.log(books);
            res.render('./pages/searches/show', { books: books });
        });
});


function Book(data) {
    this.title = data.volumeInfo.title;
    this.author = data.volumeInfo.authors;
    this.description = data.volumeInfo.description;
    this.image = data.volumeInfo.imageLinks.thumbnail;
}

// server.get( '*',( req,res )=>{
//     let errorObject = {
//       status: 500,
//       responseText: 'Sorry, something went wrong'
//     };
//     res.status( 500 ).send( errorObject );
//   } );


  server.get('*',(req,res)=>{
    let errorObject = {
        status: 500,
        responseText: 'Sorry, something went wrong'
      };
      res.render('./pages/error',{errorObject});
})

server.listen(PORT, () => console.log('Up on port', PORT));