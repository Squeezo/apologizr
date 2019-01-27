import React from "react";
import TweetDisplay from '../components/TweetDisplay'

export default class SavedImages extends React.Component {

  constructor() {
    super();
    this.state = {images: []};
    this.updateState = this.updateState.bind(this)
  }

  componentWillMount () {
    socket.on('savedImageResponse', this.updateState);
  }

  componentDidMount () {
    socket.emit('savedImageRequest')
  }

  componentWillUnmount () {
    socket.removeListener('savedImageResponse', this.updateState);
    socket.removeListener('nextOffset', this.updateOffset)
  }

  updateOffset = (offset) => {
    this.stateState({offset: offset})
  }

  updateState(newImages) {
    console.log('updatestate called')
    this.setState({'images': newImages})
  }

  render() {
    const { images } = this.state;
    
    const storedImages = images.map( (image, i) => {
      return <ImageDisplay image={image} key={i} type="view" idx={i+1} />
    })

    return (
      <div>
        <h1>Saved Images</h1>
        <div>
        {storedImages}

        </div>
     </div>
    );
  }
}
