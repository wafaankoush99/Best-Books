DROP TABLE IF EXISTS books;
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  img VARCHAR(255),
  description TEXT
);


INSERT INTO books (title, author, isbn, img, description) 
VALUES('Wafa','wafa','142587','http://books.google.com/books/content?id=A_YV8MfwCdEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','lorem poem ..');