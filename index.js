const express = require('express');

// Sets up the Express App
// ================================================
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require('cors')
const allRoutes = require('./controllers');

// Requiring our models for syncing
const db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())

app.use('/', allRoutes);

db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log('App listening on PORT ' + PORT);
    });
});