var socket = io.connect(siteIP);
socket.on('connect', function(data) {
  console.log('Client Connected')
  status.innerHTML = "Connected!"
})

socket.on('results', function (data) {
  //console.log('new tweets: ')
  updateDisplay(data)
});

socket.on('response', function (data) {
  console.log('response', data)
});

socket.on('disconnect', function (data) {
  console.log('scoket disconnected');
  console.dir(data);
});

document.getElementById('searchFor').addEventListener('click', function(){
  document.getElementById('searchErr').innerHTML = "";
}, false);

var updateDisplay = function(data) {
  if (!data) { 
    console.log('missing data in updateDisplay')
    return;
  }
  console.log(data)
  var container = document.createElement('div');
  container.classList.add('tweet');
  container.setAttribute('id', data.id);

  var textDiv = document.createElement('div');
  textDiv.classList.add('text');

  var tweetText = data.text;
  if(data.retweeted_status) {
    tweetText = data.retweeted_status.text;
  }

  var textNode = document.createTextNode(tweetText);
  textDiv.appendChild(textNode);

  var createdAt = document.createElement('p');
  createdAt.classList.add('createdAt');

  var createdAtTextNode = document.createTextNode(data.created_at);
  createdAt.appendChild(createdAtTextNode);

  var authorDiv = document.createElement('div');
  authorDiv.classList.add('author');

  var nameNode = document.createTextNode(data.user.name);
  var nameSpan = document.createElement('p');
  nameSpan.classList.add('name');
  nameSpan.appendChild(nameNode);

  var screenNameSpan = document.createElement('p');
  var screenNameNode = document.createTextNode('@' + data.user.screen_name);
  screenNameSpan.classList.add('screenName');
  screenNameSpan.appendChild(screenNameNode);

  var profileImage = document.createElement('img');
  profileImage.classList.add('profile_image')
  profileImage.setAttribute('src', data.user.profile_image_url);

  var submenu = document.createElement('p');
  submenu.classList.add('submenu')
  var saveLink = document.createElement('a');
  var saveLinkText = document.createTextNode('Save');
  saveLink.appendChild(saveLinkText);
  submenu.appendChild(saveLink);

  var pipe = document.createTextNode(' | ');
  submenu.appendChild(pipe)

  var postLink = document.createElement('a');
  var postLinkText = document.createTextNode('Post it now');
  postLink.appendChild(postLinkText);
  submenu.appendChild(postLink);

  
  authorDiv.appendChild(profileImage);
  authorDiv.appendChild(nameSpan);
  authorDiv.appendChild(screenNameSpan);

  container.appendChild(authorDiv);
  container.appendChild(createdAt);
  container.appendChild(textDiv);
  container.appendChild(submenu)

  document.getElementById('results').appendChild(container);
  saveLink.addEventListener('click', function() { saveIt(data.id)}, false)
  postLink.addEventListener('click', function() { postIt(data.id)}, false)

} 

var getIt = function(t) {
  var el = document.getElementById(t);
  var name = el.getElementsByClassName('name')[0].textContent;
  var screenName = el.getElementsByClassName('screenName')[0].textContent;
  var text = el.getElementsByClassName('text')[0].textContent;
  var createdAt = el.getElementsByClassName('createdAt')[0].textContent;
  var profileImage = el.getElementsByClassName('profile_image')[0].getAttribute('src')

  var tweet = {
    'id': t,
    'name' : name,
    'screenName' : screenName,
    'text' : text,
    'createdAt': createdAt, 
    'profileImage' : profileImage
  }

  return tweet;
}

var saveIt = function(t) {
  console.log('saveIt', t);
  var saveTweet = getIt(t);
  console.dir(saveTweet);
  socket.emit('save', saveTweet)
}

var postIt = function(t) {
  console.log('postIt', t)
  var postTweet = getIt(t);
  console.dir(postTweet)
  socket.emit('post', postTweet)
}