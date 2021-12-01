const axios = require('axios');

//TODO: deixar o baseURL dinamico aqui msm
const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

module.exports = api;