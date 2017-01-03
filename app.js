require('dotenv').config();
const express = require('express'),
      app = express(),
      post = require('./routes/post'),
      expressValidator = require('express-validator'),
      bodyParser = require('body-parser');
      
app.engine('pug', require('pug').__express)
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.disable('x-powered-by')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator())

const server = app.listen(80, (err, response) => {
  if (err) console.log(err.stack)
  const port = server.address().port
  console.log('apologizr listening at port %s', port)
})


app.use(post)

app.on('listening', () => { 
  console.log('Initializing Twitter instance')
  const client = require('twitterClient');
  if(!client) { 
    console.log('Error connecting to Twitter.')
    server.close();
  }
})

exports.close = () => {
  console.log('apologizr exiting.')
  server.close()
}
