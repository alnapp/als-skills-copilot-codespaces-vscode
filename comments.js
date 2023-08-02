// Create web server
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const db = require('../lib/db');
const template = require('../lib/template.js');
const sanitizeHtml = require('sanitize-html');

router.get('/create', (request, response) => {
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, (error2, authors) => {
      if(error2){
        throw error2;
      }
      const title = 'Create';
      const list = template.list(topics);
      const html = template.HTML(title, list, `
        <form action="/comment/create_process" method="post">
          <p><input type="text" name="comment" placeholder="comment"></p>
          <p>
            <select name="topic">
              ${template.topicSelect(topics)}
            </select>
          </p>
          <p>
            <select name="author">
              ${template.authorSelect(authors)}
            </select>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      response.send(html);
    });
  });
});

router.post('/create_process', upload.single('comment'), (request, response) => {
  const post = request.body;
  db.query(`
    INSERT INTO comment (comment, created, author_id, topic_id) 
      VALUES(?, NOW(), ?, ?)`,
    [post.comment, post.author, post.topic],
    (error, result) => {
      if(error){
        throw error;
      }
      response.redirect(`/comment/${result.insertId}`);
    }
  );
});

router.get('/update/:commentId', (request, response) => {
  const commentId = request.params.commentId;
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM author`, (error2, authors) => {
      if(error2){
        throw error2;
      }
      db.query(`SELECT * FROM comment WHERE id=?`, [commentId], (error3, comment) => {
        if(error3){
          throw error3;
        }