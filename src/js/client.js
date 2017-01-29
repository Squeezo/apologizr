import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Search from "./pages/Search";
import Post from "./pages/Post";
import View from "./pages/View";
import Layout from './pages/Layout';

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Search}></IndexRoute>
      <Route path="search" name="search" component={Search}></Route>
      <Route path="post" name="post" component={Post}></Route>
      <Route path="view" name="view" component={View}></Route>
    </Route>
  </Router>,
app);
