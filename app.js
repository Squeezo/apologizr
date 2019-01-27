require('dotenv').config();
const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: '*:*'});

const sentiment = require('sentiment'); 
const cors = require('cors');
const twitterClient = require('./twitterClient'),
      mongoClient = require('mongodb').MongoClient;
const tweetFilter = require('./TweetFilter');
const Scraper = require ('images-scraper');
const bingClient = require('./bingClient');
const https = require('https');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var socket, db, collection, emitThis, filterList;

app.disable('x-powered-by')

server.listen(8081, (err, response) => {
  if (err) console.log(err.stack)
  const port = server.address().port
  console.log('apologizr listening at port %s', port)
  if(!twitterClient) {
    console.log('Error connecting to Twitter.')
  }
  
  mongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {
      console.log('error connecting to mongodb', err)
    } else {
      console.log('connected to mongo')
      const db = client.db('grimshackle') 
      collection = db.collection('savedImages');
      filters = db.collection('tweetFilters');
    }
  })

  io.on('connection', (sock) => {
    socket = sock;
    console.log('Connected')

    socket.on('searchRequest', (searchFor) => {
      console.log('Searching Twitter', searchFor)

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

    socket.on('imageRequest', (terms) => {
      searchImages(terms);
    })

    socket.on('saveImage', (t) => {
      saveImage(t)
    })

  })

})


const searchImages = (terms) => {
  console.log('searchImages', terms);

  let offset=0;
  if(terms.offset) {
    offset= terms.offset;
  }

  let count = terms.count || 5; 

  let request_params = {
    method : 'GET',
    hostname : 'api.cognitive.microsoft.com',
    path : '/bing/v7.0/images/search?q=' + encodeURIComponent(terms.keyword),
    count : count, 
    offset : offset,
    headers : {
    'Ocp-Apim-Subscription-Key' : process.env.BING_SEARCH_API_1
    }
  };

  let response_handler = function (response) {
    let body = '';

    response.on('data', function (d) {
      body += d;
    });

    response.on('end', function () {
      const res = JSON.parse(body);
      console.log('nextOffset', res.nextOffset)
      socket.emit('nextOffset', res.nextOffset)
      if(res.value) {
        res.value.forEach( item => {
          socket.emit('imageResponse', item)
        })      
      }
    });

  };



  let req = https.request(request_params, response_handler);
  req.end();

    
}

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

const postImage = (t) => { 

  if(!t) { socket.emit('response', 'Missing image data'); return; }
  console.log('postImage not implemented yet')

  // twitterClient.post('statuses/update', {status: t})
  //   .then( (tweet) => {
  //     console.log('post callback called: ',tweet.text)

  //     socket.emit('postResponse', tweet.id)
  //   })
  //   .catch( (error) => {
  //     console.log('post error', error)
  //     socket.emit('postResponse ', error); 
  //   });
}

const saveImage = (t) => {

  if(!t) { socket.emit('response', 'Missing image data'); return; }
  
  collection.insertOne(t, (err, result) => {
    if(err) {
      console.log('error saving image: ', err)
      socket.emit('saveImageResponse', err);
      return;
    } 

    console.log("saved image with id: ", result.insertedId);
    socket.emit('saveImageResponse', result.insertedId);

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
    hash: f.hashCode(),
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
  console.log('editFilter called', filter)
  filters.update({hash: filter.hash}, {$set:{text:filter.value, hash: filter.value.hashCode()}}, (err,result) => {
    if(err) {
      console.log('error updating filter: ', err)
      socket.emit('editFilterResponse', err);
      return;
    }

    console.log("edited filter: ", result.result.nModified);
    socket.emit('editFilterResponse', 'success');
    fetchFilters()
  });
}

const deleteFilter = (filter) => {
  console.log('deleteFilter', filter.hash)
  if(!filter.hash) { console.log('missing hash', filter.hash); socket.emit('deleteFilterResponse', 'Missing filter data'); return; }

  filters.remove({hash: filter.hash}, (err, result) => {
    if(err) {
      console.log('error deleting filter: ', err)
      socket.emit('deleteFilterResponse', err);
      return;
    } 

    console.log("deleted filter with id: ", result.result.n);
    socket.emit('deleteFilterResponse', 'success');
    fetchFilters()

 });
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};