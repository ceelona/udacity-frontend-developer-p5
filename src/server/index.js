const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');

/*
 * SETUP
 */

dotenv.config()
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static('website'));


/*
 * CONSTANTS
 */

const TRIPS = [];

/*
 * HELPERS (EXTERN ENDPOINTS)
 */

const getGeoInfo = async (location) => {
    try {
        const res = await axios.get(`http://api.geonames.org/searchJSON?name=${location}&maxRows=1&username=${process.env.GEO_USERNAME}`)
        return res.data.geonames[0]
    } catch(err) {
        console.error(err);
    }
}

const getWeatherInfo = async ({lat, lng, days}) => {
    try {
        const res = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lng}&days=${days}&key=${process.env.WEATHER_KEY}`);
        return res.data.data[0];
    } catch(err) {
        console.error(err);
    }

}

const getPictures = async (location) => {
    try {
        const res = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${location}&image_type=photo&editors_choice=true&per_page=3`);
        if(res.data.hits.length>0) {
            return res.data;
        }

        // Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).
        const resRandom = await axios.get(`https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=travel&image_type=photo&editors_choice=true&per_page=3`);
        return resRandom.data;
    } catch(err) {
        console.error(err);
    }
}

/*
 * ROUTES
 */

app.get('/api/trip', (_, res) => {
    res.send(TRIPS)
})

app.post('/api/trip', async(req, res) => {
    const {start, end, location} = req.body
    try {
        const geo = await getGeoInfo(location)
        const days = Math.ceil((new Date(start)-new Date()) / (1000 * 60 * 60 * 24))
        const weather = days>=0 && geo ? await getWeatherInfo({lat: geo.lat, lng: geo.lng, days }) : undefined
        const pictures = await getPictures(location)
        const trip = {geo, weather, pictures, start, end, location, days}
        TRIPS.push(trip)
        res.send(trip)
    } catch(err) {
        console.error(err);
    }




})

/*
 * SERVER
 */

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`)
})
