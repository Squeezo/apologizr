const express = require('express')
const Twitter = require('twitter');

const client = new Twitter({
    consumer_key: process.env.SORRY_API_KEY,
    consumer_secret: process.env.SORRY_API_SECRET,
    access_token_key: process.env.SORRY_ACCESS_TOKEN,
    access_token_secret: process.env.SORRY_ACCESS_SECRET
  });

module.exports = client