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
var socket, db, collection, emitThis;

app.use(express.static(__dirname + '/public'));
app.engine('pug', require('pug').__express)
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.disable('x-powered-by')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator())

server.listen(8081, (err, response) => {
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

  io.on('connection', (socket) => {
    console.log('Connected')

    socket.on('searchRequest', (searchFor) => {
      console.log('Searching Twitter', searchFor)

      twitterClient.stream('statuses/filter', {track: searchFor}, (stream) => {

        stream.on('data', (tweets) => {
          console.log('got new tweets')
          if(!socket.emit) {
            console.log('No socket connection')
          } else {
            socket.emit('searchResponse', tweets)
          }
        });
        
        stream.on('error', (error) => {
          console.log(error);
          
        });
        
        stream.on("end", () => {
            console.log('stream end: ', buffer);
        });
      })

    })
    socket.on('post', (t) => {
      console.log('Posting Tweet')
      postTweet(t)
    })

    emitThis = (msg) => {
      socket.emit('response', msg)
    }

  })

})

//app.use(post)
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
      saveTweet(t)
    })

    socket.on('post', (t) => {
      console.log('Posting Tweet')
      postTweet(t)
    })

    emitThis = (msg) => {
      socket.emit('response', msg)
    }

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
    
    stream.on("end", () => {
        console.log('stream end: ', buffer);
    });

    return res.render('search', {label: 'What are you looking for?', search:'Search'})

  });

})
/*
app.get('/view', (req, res) => {

  collection.find({}).toArray((err, docs) => {
    // console.dir(docs)
    if(err) {
      return res.render('view', {label: 'Stored Tweets', err: err})
    }

    return res.render('view', {label: 'Stored Tweets', storedTweets: docs} )
  });

})

app.get('/remove/:tid', (req, res) => {
  let tid = parseInt(req.params.tid);
  console.log('tid is ', tid)
  collection.remove( {'tid' : tid}, (err, result) => {
    if(err) {
      console.log('error removing tweets: ', err)
      return res.redirect('/view'); 
    } 

    console.log("removed tweet: ", result.result.n);
    // /console.dir(result)
    return res.redirect('/view')    
  })

})

const saveTweet = (t) => {

  if(!t) { socket.emit('response', 'Missing tweet data'); return; }
  
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
      socket.emit('response', err);
      return;
    } 

    console.log("saved tweet with id: ", result.insertedId);
    socket.emit('response', 'saved with id of ' + result.insertedId);
  });
} 

const postTweet = (t) => { 

  if(!t) { socket.emit('response', 'Missing tweet data'); return; }
  if(!t.text ) { socket.emit('response', 'Missing tweet content'); return; }

  twitterClient.post('statuses/update', {status: t.text})
    .then( (tweet) => {
      console.log('post callback called: ',tweet.text)

      emitThis(tweet.text);
    })
    .catch( (error) => {
      console.log('post error', error)
      socket.emit('response ', error); 
    });
}

*/