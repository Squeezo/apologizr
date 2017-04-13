import React from "react";


export default class FilterItem extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <li>{this.props.text} <button onClick={this.props.onEdit}>edit</button>&nbsp;<button onClick={this.props.onRemove}>delete</button></li>
    )
  }

}