require('dotenv').config();
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const twitterClient = require('./twitterClient'),
      mongoClient = require('mongodb').MongoClient;

var socket, db, collection, emitThis;

app.disable('x-powered-by')


server.listen(8081, (err, response) => {
  if (err) console.log(err.stack)
  const port = server.address().port
  console.log('apologizr listening at port %s', port)
  if(!twitterClient) {
    console.log('Error connecting to Twitter.')
  }
  
  mongoClient.connect('mongodb://localhost:27017/apologizr', (err, db) => {
    if(err) {
      console.log('error connecting to mongodb', err)
    } else {
      console.log('connected to mongo') 
      collection = db.collection('storedTweets');
    }
  })

  io.on('connection', (sock) => {
    socket = sock;
    console.log('Connected')

    socket.on('searchRequest', (searchFor) => {
      //console.log('Searching Twitter', searchFor)

      twitterClient.stream('statuses/filter', {track: searchFor}, (stream) => {

        stream.on('data', (tweets) => {
          socket.emit('searchResponse', tweets)
        });
        
        stream.on('error', (error) => {
          console.log(error);
        });
        
        stream.on('end', () => {
          console.log('stream end');
        });

        socket.on('stopStream', () => {
          stream.destroy();
        })
      })

    })

    emitThis = (msg) => {
      socket.emit('response', msg)
    }

    socket.on('postTweet', (t) => {
      postTweet(t)
    })

    socket.on('saveTweet', (t) => {
      saveTweet(t)
    })

    socket.on('savedRequest', () => {
      collection.find({}).toArray((err, docs) => {
        if(err) {
          throw (err);
        }

        socket.emit('savedResponse', docs);
      });
    })

  })

})

const saveTweet = (t) => {

  if(!t) { socket.emit('response', 'Missing tweet data'); return; }
  
  const tweet = {
    id: t.id,
    text: t.text,
    created_at: t.created_at,
    user: { 
      name: t.user.name,
      screen_name: t.user.screen_name,
      profile_image_url: t.user.profile_image_url
    }
  }

  collection.insertOne(t, (err, result) => {
    if(err) {
      console.log('error saving tweets: ', err)
      socket.emit('response', err);
      return;
    } 

    console.log("saved tweet with id: ", result.insertedId);
    socket.emit('response', result.insertedId);

  });
} 

const postTweet = (t) => { 

  if(!t) { socket.emit('response', 'Missing tweet data'); return; }

  twitterClient.post('statuses/update', {status: t})
    .then( (tweet) => {
      console.log('post callback called: ',tweet.text)

      socket.emit('response', tweet.id)
    })
    .catch( (error) => {
      console.log('post error', error)
      socket.emit('response ', error); 
    });
}