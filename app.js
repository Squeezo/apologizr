require('dotenv').config();
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const twitterClient = require('./twitterClient'),
      expressValidator = require('express-validator'),
      bodyParser = require('body-parser'),
      ip = require('ip');

const post = require('./routes/post');
var socket;

app.use(express.static(__dirname + '/public'));
app.engine('pug', require('pug').__express)
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.disable('x-powered-by')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator())

server.listen(80, (err, response) => {
  if (err) console.log(err.stack)
  const port = server.address().port
  console.log('apologizr listening at port %s', port)
})

app.use(post)
//app.use(search)


app.get('/search', (req, res) => {
  res.render('search', {label: 'What are you looking for?', search:'Search', siteIP : req.protocol + '://' + ip.address()})

})

app.post('/search', (req, res) => {

  let searchFor = req.body.searchFor;
  req.sanitize('searchFor').escape();
  console.log('santized search query', req.body.searchFor)

  io.on('connection', (sock) => {
    console.log('Connected')
    socket = sock;
  })



  twitterClient.stream('statuses/filter', {track: searchFor}, (stream) => {

    stream.on('data', (tweets) => {
      console.log('got new tweets')
      if(!socket.emit) {
        console.log('No socket connection')
      } else {
        socket.emit('results',tweets)
      }
    });
    
    stream.on('error', (error) => {
      console.log(error);
      
    });
    
    return res.render('search', {label: 'What are you looking for?', search:'Search'})

  });

})


app.on('listening', () => { 
  console.log('Initializing Twitter instance')
  const client = require('twitterClient');
  if(!client) { 
    console.log('Error connecting to Twitter.')
  }
})
