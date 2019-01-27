import React from "react"

export default class ImageDisplay extends React.Component {
  constructor(props) {
    super(props)
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

  saveImage = () => {
    console.log('saveImage called')
    socket.emit('saveImage', this.props.image)
  }

  postImage = () =>  {
    console.log('postImage called')
    socket.emit('postImage', this.props.image) 
  }

  // deleteImage = () {
  //   console.log('deleteImage called')
  //   socket.emit('deleteImage', this.props.image.id) 
  // }

  render() {
    
    let submenu = <p><a className='btn btn-primary btn-sm' onClick={this.deleteTweet}>Delete</a> <a className='btn btn-primary btn-sm' onClick={this.postTweet}>Post it now</a></p>
    if (this.props.type === 'search') {
      submenu = 
        <p className={"submenu"}>
          <a className='btn btn-primary btn-sm' onClick={this.saveImage}>Save</a>&nbsp;
          <a className='btn btn-primary btn-sm' onClick={this.postImage}>Post it now</a>&nbsp;
        </p>
    } 

    const { image } = this.props;

    return (
      <div>
        <a href={image.contentUrl} target='_blank'><img src={image.thumbnailUrl} /></a>
        <p>{this.props.idx}.  W: {image.width} H: {image.height} S: {image.contentSize}</p>
        <div>{submenu}</div>
      </div>
    );
  }
}
