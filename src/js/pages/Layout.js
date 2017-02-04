import React from "react";
import { Link } from "react-router";

import Nav from "../components/Nav";

export default class Layout extends React.Component {

  render() {
    const { location } = this.props;
    const containerStyle = {
      marginTop: "60px"
    };
    return (
      <div>

        <Nav location={location} />

        <div class="container" style={containerStyle}>
          <div>
            <div>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>

    );
  }
}
