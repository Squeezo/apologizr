import React from "react";
import TweetDisplay from '../components/TweetDisplay'

export default class Trends extends React.Component {

  constructor() {
    super();
    this.state = {trends: []};

    this.updateState = this.updateState.bind(this);

  }

  componentWillMount () {
    socket.on('trendsResponse', this.updateState);
  }

  componentDidMount () {
    socket.emit('fetchTrends')
  }

  componentWillUnmount () {
    socket.removeListener('trendsResponse')
  }

  updateState(trends) {
    this.setState({trends:trends})
  }

  render() {
    const trendList = this.state.trends.map( (trend, i) => {
      console.log(trend)
      if(trend.tweet_volume) {
        return (
          <p key={i} name={trend.name}>
            <span>
              <a 
              target='_blank' 
              href={trend.url}>
              {trend.name} {(trend.tweet_volume)}
            </a>
            </span>&nbsp;
            <span>
              <a target='_blank' href={'https://www.google.com/search?q=' + trend.query + '&tbm=isch'}>img</a>
            </span>
          </p>
        )
      }  
    })

    return (
      <div>
        <h1>Trends</h1>
        <div id='results'>
          <ul>
            {trendList}
          </ul>
        </div>
     </div>
    );
  }
}
