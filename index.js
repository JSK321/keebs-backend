var express = require('express');

// Sets up the Express App
// ================================================
var app = express();
var PORT = process.env.PORT || 8080;
var allRoutes = require('./controllers');

// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static('public'));

app.use('/', allRoutes);

db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
});