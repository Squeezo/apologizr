var updateDisplay = function(data) {
  if (!data) { 
    console.log('missing data in updateDisplay')
    return;
  }

  console.log('user.profile_image_url: ', data.user.profile_image_url)
  console.dir(data.user)
  var container = document.createElement('div');
  container.classList.add('tweet')
  
  var textDiv = document.createElement('div');
  var textNode = document.createTextNode(data.text)
  textDiv.appendChild(textNode);

  var authorDiv = document.createElement('div');
  authorDiv.classList.add('author')

  var nameNode = document.createTextNode(data.user.name)
  var nameSpan = document.createElement('p');
  nameSpan.classList.add('name')
  nameSpan.appendChild(nameNode)

  var screenNameSpan = document.createElement('p')
  var screenNameNode = document.createTextNode('@' + data.user.screen_name)
  screenNameSpan.classList.add('screenName')
  screenNameSpan.appendChild(screenNameNode)

  var profileImage = document.createElement('img')
  profileImage.setAttribute('src', data.user.profile_image_url)

  authorDiv.appendChild(profileImage)
  authorDiv.appendChild(nameSpan)
  authorDiv.appendChild(screenNameSpan)

  container.appendChild(authorDiv);
  container.appendChild(textDiv)

  document.getElementById('results').appendChild(container)
} 