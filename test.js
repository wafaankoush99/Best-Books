



function locationHandler(req, res) { // location DB
    let GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
    let cityName = req.query.city;
    let locationURL = `https://eu1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`;
    let SQL = `SELECT * FROM locations WHERE search_query=$1`;
    client.query(SQL, [cityName])
        .then(geoData => {
            if (geoData.rowCount > 0) {
                res.send(geoData.rows[0]);
            }
            else {
                superAgent.get(locationURL)
                    .then(getData => {
                        let gotData = getData.body;
                        let locationData = new Location(cityName, gotData);
                        let search_query = cityName;
                        let formatted_query = gotData[0].display_name;
                        let latitude = gotData[0].lat;
                        let longitude = gotData[0].lon;

                        let SQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)`;
                        let safeValues = [search_query, formatted_query, latitude, longitude];
                        client.query(SQL, safeValues);
                        res.send(locationData)
                            .catch(error => {
                                res.send(error);
                            });
                    })
                    .catch(error => {
                        res.send(error);
                    });

            }

        });
}
