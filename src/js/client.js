import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";

import Search from "./pages/Search";
import Post from "./pages/Post";
import Saved from "./pages/Saved";
import Filters from './pages/Filters';
import Layout from './pages/Layout';
import Images from './pages/Images';

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Search}></IndexRoute>
      <Route path="search" name="search" component={Search}></Route>
      <Route path="post" name="post" component={Post}></Route>
      <Route path="saved" name="saved" component={Saved}></Route>
      <Route path="filters" name="filters" component={Filters}></Route>
      <Route path="images" name="images" component={Images}></Route>
    </Route>
  </Router>,
app);
