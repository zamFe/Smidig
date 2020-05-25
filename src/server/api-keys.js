let GOOGLEMAPS_KEY = process.env.GoogleMaps || fs.readFileSync('src/server/api-keys/googleMaps.properties', 'utf8');
let TRIPGO_KEY = process.env.TripGo || fs.readFileSync('src/server/api-keys/tripgo.properties', 'utf8');

if (!GOOGLEMAPS_KEY) console.error("GOOGLE KEY MISSING");
if (!TRIPGO_KEY) console.error("TRIPGO KEY MISSING");

module.exports = {
    GOOGLEMAPS_KEY,
    TRIPGO_KEY
}