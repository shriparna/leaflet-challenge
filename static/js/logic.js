// Create initial map object
let myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Get the earthquake data 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function(data){
    console.log("features");
    console.log(data.features);
    updateMap(data.features);
});

function updateMap(features){
    console.log("features");
    console.log(features);    
    
    // Traverse through features to get the values of
    // magnitude, longitude, latitude, depth
    for (let value in features)
    {
        let magnitude = features[value].properties.mag;
        let place = features[value].properties.place;
        let longitude = features[value].geometry.coordinates[0];
        let latitude = features[value].geometry.coordinates[1];
        let depth = features[value].geometry.coordinates[2];

        // console.log(`Magintude[${value}] + ${magnitude}`);
        // console.log(`Place[${value}] + ${place}`);
        // console.log(`Longitude[${value}] + ${longitude}`);
        // console.log(`Latitude[${value}] + ${latitude}`);
        // console.log(`Depth[${value}] + ${depth}`);

        // Create the marker
        let location = [latitude, longitude];
        // console.log(location);

        L.circle(location, {
            fillOpacity: 0.75,
            stroke: true,
            weight: 0.5,
            color: "black",
            fillColor: getColor(depth),
            fillOpacity: 0.75,
            radius: magnitude * 10000
        }).bindPopup("<p>" 
                    + place + "<hr>"
                    + "<strong>Magnitude: </strong>"
                    + magnitude + "<br>"
                    + "<strong>Location: </strong>"
                    + location + "<br>"
                    + "<strong>Depth: </strong>"
                    + depth + "<br>"
                    + "</p>").addTo(myMap);
    }
}

function getColor(d) {
    return  d > 90 ? '#f21b3f':
            d > 70 ? '#ff8000':
            d > 50 ? '#ff9e00':
            d > 30 ? '#ffbf00':
            d > 10 ? '#bce784':
                     '#70e000';
}

var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
        '<i style="background:' + getColor(from + 1) + '"></i> ' + " " +
        from + (to ? '-' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
 
legend.addTo(myMap)