import React from "react";

export default class TweetDisplay extends React.Component {
  render() {
    const { tweet } = this.props.tweet;

    return (
      <div className={"tweet"} id={tweet.id}>
        <div className={"author"}>
          <img className={"profile_image"} src={tweet.profile_image_url} />
            <p className={"name"}>{tweet.user.name}</p>
            <p className={"screenName"}>{tweet.user.screen_name}</p>
        </div>
        <p className={"createdAt"}>{tweet.created_at}</p>
        <div className={"text"}>{tweet.text}</div>
        <p className={"submenu"}><a>Save</a> | <a>Post it now</a></p>
      </div>
    );
  }
}
