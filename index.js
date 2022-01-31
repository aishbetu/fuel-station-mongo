const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

const connectDB = require('./config/db.config')
const stationRoutes = require('./src/routes/fuelStation.route');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

dotenv.config({path: './config/config.env'});

connectDB();

app.get('/', (req, res) => {
    res.send('Hello Node');
});

// adding route module for fuel stations
app.use('/api/v1/stations', stationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});
