import React from "react"

export default class TweetDisplay extends React.Component {
  constructor(props) {
    super(props)
    
    this.saveTweet = this.saveTweet.bind(this)
    this.deleteTweet = this.deleteTweet.bind(this)
    this.postTweet = this.postTweet.bind(this)
    this.consoleTweet = this.consoleTweet.bind(this)
  }

  componentWillMount() {
    socket.on('deleteResponse', (msg) => {
      console.log('deleteResponse: ', msg)
      this.props.callback()
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

  consoleTweet() {
    console.dir(this.props.tweet)
  }

  render() {
    const profileURL = 'https://twitter.com/' + this.props.tweet.user.screen_name
    let submenu = <p className={"submenu"}><a className='btn btn-primary btn-sm' onClick={this.deleteTweet}>Delete</a> <a className='btn btn-primary btn-sm' onClick={this.postTweet}>Post it now</a></p>
    if (this.props.type === 'search') {
      submenu = 
        <p className={"submenu"}>
          <a className='btn btn-primary btn-sm' onClick={this.saveTweet}>Save</a>&nbsp;
          <a className='btn btn-primary btn-sm' onClick={this.postTweet}>Post it now</a>&nbsp;
          <a className='btn btn-primary btn-sm' onClick={this.consoleTweet}>Console</a>
        </p>
    } 


    let media_url, display_url, quote, sentiment = null
    if (this.props.tweet.entities.media) {
      if(this.props.tweet.entities.media[0].media_url) {
        display_url = '//' + this.props.tweet.entities.media[0].display_url
        media_url = <a href={display_url} target='_blank'><img className={"twitpic"} src={this.props.tweet.entities.media[0].media_url} /></a>
      }
    }
 
    if(this.props.tweet.is_quote_status) {
      const quotedURL = 'https://twitter.com/' + this.props.tweet.quoted_status.user.screen_name
      quote = 
        <div className={"quote"}><a href={quotedURL}>{this.props.tweet.quoted_status.user.name}</a>&nbsp;
          <span className={'screenName'}>@{this.props.tweet.quoted_status.user.screen_name}</span>
          <div className={'text'}>{this.props.tweet.quoted_status.text}</div>
        </div>
    }

    if(this.props.tweet.sentiment) {
      sentiment = <span className={'screenName'}>score: {this.props.tweet.sentiment.score} | comparative: {this.props.tweet.sentiment.comparative}</span>
    }

    return (
      <div className={"tweet"} id={this.props.tweet.id} className='panel panel-default'>
        <div className={"author"} className='panel-body'>
          <a href={profileURL} target="_blank">
            <img className={"profile_image"} src={this.props.tweet.user.profile_image_url} />
          </a>
          <div className={"name"}>
            <a href={profileURL} target="_blank">{this.props.tweet.user.name}</a>&nbsp;
            <span className={"screenName"}>@{this.props.tweet.user.screen_name}</span> &#149; 
            <span className={"createdAt"}>{this.props.tweet.created_at}</span> &#149; 
            {sentiment}  
            <div className={"text"}>{this.props.tweet.text}</div>
            <div className={"text"}>{media_url}</div>
            {quote}

          </div>
        </div>
        <div className='panel-footer'>{submenu}</div>
      </div>
    );
  }
}
