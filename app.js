require('dotenv').config();
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const twitterClient = require('./twitterClient'),
      mongoClient = require('mongodb').MongoClient,
      expressValidator = require('express-validator'),
      bodyParser = require('body-parser'),
      ip = require('ip');


const post = require('./routes/post');
var socket, db, collection;

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
  if(!twitterClient) {
    console.log('Error connecting to Twitter.')
  }
  
  mongoClient.connect('mongodb://localhost:27017/apologizr', (err, database) => {
    if(err) {
      console.log('error connecting to mongodb', err)
    } else {
      console.log('connected to mongo')
      db = database;
      collection = db.collection('storedTweets');
    }
  })
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

    socket.on('save', (t) => {
      console.log('Saving Tweet')
      let result = saveTweet(t)
      socket.emit('response', result)
    })

    socket.on('post', (t) => {
      console.log('Posting Tweet')
      let result = postTweet(t)
      socket.emit('response', result)
    })
  })

  twitterClient.stream('statuses/filter', {track: searchFor}, (stream) => {

    stream.on('data', (tweets) => {
      //console.log('got new tweets')
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

app.get('/view', (req, res) => {

  collection.find({}).toArray((err, docs) => {
    console.log(docs)
    if(err) {
      return res.render('view', {label: 'Stored Tweets', err: err})
    }

    return res.render('view', {label: 'Stored Tweets', storedTweets: docs} )
  });

  

})

const saveTweet = (t) => {

  if(!t) { return 'Missing tweet data'; }
  
  const tweet = {
    'tid': t.id,
    'name': t.name,
    'screenName': t.screenName,
    'text' : t.text,
    'createdAt' : t.createdAt,
    'profileImage' : t.profileImage
  }

  collection.insertOne(tweet, (err, result) => {
    if(err) {
      console.log('error saving tweets: ', err)
      return err;
    } 

    console.log("saved tweet with id: ", result.insertedId);
    return result.insertedId;
  });
} 

const postTweet = (t) => {

  if(!t) { return 'Missing tweet data'; }
  if(!t.text ) { return 'Missing tweet content'; }

  twitterClient.post('statuses/update', {status: t.text}, (error, tweet, response) => {
    if(error) { return error; }

    return 'tweet posted';
    console.log(tweet);  // Tweet body. 
    console.log(response);  // Raw response object. 
  });
}