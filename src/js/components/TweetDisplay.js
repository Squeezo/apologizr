import React from "react"

export default class TweetDisplay extends React.Component {
  constructor(props) {
    super(props)

    this.saveTweet = this.saveTweet.bind(this)
    this.postTweet = this.postTweet.bind(this)
  }

  saveTweet() {
    console.log('saveTweet called')
    socket.emit('saveTweet', this.props.tweet)
  }

  postTweet() {
    console.log('postTweet called')
    socket.emit('postTweet', this.props.tweet.text) 
  }

  render() {
    const profileURL = 'https://twitter.com/' + this.props.tweet.user.screen_name
    return (
      <div className={"tweet"} id={this.props.tweet.id}>
        <div className={"author"}>
          <a href={profileURL} target="_blank">
            <img className={"profile_image"} src={this.props.tweet.user.profile_image_url} /></a>
              <p className={"name"}>
                <a href={profileURL} target="_blank">{this.props.tweet.user.name}</a>&nbsp;
                <span className={"screenName"}>{this.props.tweet.user.screen_name}</span>
              </p>
          </div>
        
        <p className={"createdAt"}>{this.props.tweet.created_at}</p>
        <div className={"text"}>{this.props.tweet.text}</div>
        <p className={"submenu"}><a onClick={this.saveTweet}>Save</a> | <a onClick={this.postTweet}>Post it now</a></p>
      </div>
    );
  }
}
