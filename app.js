require('dotenv').config();
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const sentiment = require('sentiment'); 
const twitterClient = require('./twitterClient'),
      mongoClient = require('mongodb').MongoClient;
const tweetFilter = require('./TweetFilter');

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
      filters = db.collection('tweetFilters');
    }
  })

  io.on('connection', (sock) => {
    socket = sock;
    console.log('Connected')

    socket.on('searchRequest', (searchFor) => {
      //console.log('Searching Twitter', searchFor)

      twitterClient.stream('statuses/filter', {track: searchFor}, (stream) => {

        stream.on('data', (tweets) => {

          if(tweetFilter.check(tweets)) {
            tweets.sentiment = sentiment(tweets.text)
            socket.emit('searchResponse', tweets)
          }
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

    socket.on('deleteTweet', (t) => {
      deleteTweet(t)
    })

    socket.on('savedRequest', () => {
      fetchTweets();
    })

    socket.on('fetchFilters', () => {
      fetchFilters();
    })

    socket.on('addFilter', (f) => {
      addFilter(f);
    })

    socket.on('editFilter', (f) => {
      editFilter(f);
    })

    socket.on('deleteFilter', (fid) => {
      deleteFilter(fid);
    })

  })

})

const fetchTweets = () => {
    collection.find({}).toArray((err, docs) => {
      if(err) {
        throw (err);
      }

      socket.emit('savedResponse', docs);
    });
}

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
      socket.emit('saveResponse', err);
      return;
    } 

    console.log("saved tweet with id: ", result.insertedId);
    socket.emit('saveResponse', result.insertedId);

  });
} 

const postTweet = (t) => { 

  if(!t) { socket.emit('response', 'Missing tweet data'); return; }

  twitterClient.post('statuses/update', {status: t})
    .then( (tweet) => {
      console.log('post callback called: ',tweet.text)

      socket.emit('postResponse', tweet.id)
    })
    .catch( (error) => {
      console.log('post error', error)
      socket.emit('postResponse ', error); 
    });
}

const deleteTweet = (t) => { 

  if(!t) { socket.emit('response', 'Missing tweet data'); return; }

  collection.remove({id: t}, (err, result) => {
    if(err) {
      console.log('error deleting tweet: ', err)
      socket.emit('deleteResponse', err);
      return;
    } 

    console.log("deleted tweet with id: ", t);
    socket.emit('deleteResponse', 'success');
    fetchTweets()

  });
}

const fetchFilters = () => {
  filters.find({}).toArray((err, docs) => {
    if(err) {
      throw (err);
    }

    socket.emit('filtersResponse', docs);
  });
}

const addFilter = (f) => {
  console.log('addFilter', f)
  if(!f) { socket.emit('addFilterResponse', 'Missing filter data'); return; }
  
  let createdDate = new Date()
   const filter = {
    text: f,
    created_at: createdDate.toTimeString(),
    hits: { count:0}
  }

  filters.insertOne(filter, (err, result) => {
    if(err) {
      console.log('error saving filter: ', err)
      socket.emit('addFilterResponse', err);
      return;
    } 

    console.log("saved filter with id: ", result.insertedId);
    socket.emit('addFilterResponse', result.insertedId);
    fetchFilters();

  });
} 


const editFilter = (filter) => {
  
}

const deleteFilter = (fid) => {
  console.log('deleteFilter', fid._id)
  if(!fid) { socket.emit('deleteFilterResponse', 'Missing filter data'); return; }

  collection.remove({_id: fid}, (err, result) => {
    if(err) {
      console.log('error deleting filter: ', err)
      socket.emit('deleteFilterResponse', err);
      return;
    } 

    console.log("deleted filter with id: ", fid._id);
    socket.emit('deleteFilterResponse', 'success');
    fetchFilters()

  });
}
