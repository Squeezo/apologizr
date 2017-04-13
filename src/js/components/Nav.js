import React from "react";
import { IndexLink, Link } from "react-router";

export default class Nav extends React.Component {
  constructor() {
    super()
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  render() {
    const { location } = this.props;
    const { collapsed } = this.state;
    const searchClass = location.pathname === "/" ? "active" : "";
    const postClass = location.pathname.match(/^\/post/) ? "active" : "";
    const savedClass = location.pathname.match(/^\/saved/) ? "active" : "";
    const filtersClass = location.pathname.match(/^\/filters/) ? "active" : "";

    const navClass = collapsed ? "collapse" : "";

    return (
      <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)} >
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
          </div>
          <div class={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <li activeClassName="active" onlyActiveOnIndex={true}>
                <IndexLink to="/" onClick={this.toggleCollapse.bind(this)}>Search</IndexLink>
              </li>
              <li activeClassName="active">
                <Link to="post" onClick={this.toggleCollapse.bind(this)}>Post</Link>
              </li>
              <li activeClassName="active">
                <Link to="saved" onClick={this.toggleCollapse.bind(this)}>Saved</Link>
              </li>
              <li activeClassName="active">
                <Link to="filters" onClick={this.toggleCollapse.bind(this)}>Filters</Link>
              </li>              
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
