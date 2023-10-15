const express = require('express');
const routes = require('./routes');

const app = express();

// Set up routes to accept JSON requests
app.use(express.json());

// Set up items route
app.use('/items', routes);

app.use((err, req, res, next) => {
    let status = err.status || 500;
    return res
        .status(status)
        .json({'message': err.message})
})

module.exports = app;