import React from "react"

export default class TweetDisplay extends React.Component {
  constructor(props) {
    super(props)
    
    this.saveTweet = this.saveTweet.bind(this)
    this.deleteTweet = this.deleteTweet.bind(this)
    this.postTweet = this.postTweet.bind(this)
  }

  componentWillMount() {
    socket.on('deleteResponse', (msg) => {
      console.log('deleteResponse: ', msg)
    })

    socket.on('postResponse', (msg) => {
      console.log('postResponse: ', msg)
    })

    socket.on('saveResponse', (msg) => {
      console.log('saveResponse: ', msg)
    })
  }

  componentWillUnmount() {
    socket.removeListener('postResponse')
    socket.removeListener('deleteResponse')
    socket.removeListener('saveResponse')
  }

  saveTweet() {
    console.log('saveTweet called')
    socket.emit('saveTweet', this.props.tweet)
  }

  postTweet() {
    console.log('postTweet called')
    socket.emit('postTweet', this.props.tweet.text) 
  }

  deleteTweet() {
    console.log('deleteTweet called')
    socket.emit('deleteTweet', this.props.tweet.id) 
  }

  render() {
    const profileURL = 'https://twitter.com/' + this.props.tweet.user.screen_name
    let submenu = <p className={"submenu"}><a className='btn btn-primary btn-sm' onClick={this.deleteTweet}>Delete</a> <a className='btn btn-primary btn-sm' onClick={this.postTweet}>Post it now</a></p>
    if (this.props.type === 'search') {
      submenu = <p className={"submenu"}><a className='btn btn-primary btn-sm' onClick={this.saveTweet}>Save</a> <a className='btn btn-primary btn-sm' onClick={this.postTweet}>Post it now</a></p>
    } 

    return (
      <div className={"tweet"} id={this.props.tweet.id} className='panel panel-default'>
        <div className={"author"} className='panel-body'>
          <a href={profileURL} target="_blank">
            <img className={"profile_image"} src={this.props.tweet.user.profile_image_url} /></a>
              <p className={"name"}>
                <a href={profileURL} target="_blank">{this.props.tweet.user.name}</a>&nbsp;
                <span className={"screenName"}>{this.props.tweet.user.screen_name}</span> &#149; 
                <span className={"createdAt"}>{this.props.tweet.created_at}</span>
                <div className={"text"}>{this.props.tweet.text}</div>
              </p>
          </div>
        
        
        <div className='panel-footer'>{submenu}</div>
      </div>
    );
  }
}
