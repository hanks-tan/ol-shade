import ShadeLayer from "./ol-shade.js";
const {Map, View } = ol
const Tile = ol.layer.Tile
const OSM = ol.source.OSM
const GeoJSON = ol.format.GeoJSON

var baseLayer = new Tile({
  source: new OSM()
});

var view = new View({
  center: [116.727085860608, 35.20619600133295],
  zoom: 4,
  projection: "EPSG:4326"
});

var map = new Map({
  target: "map",
  view: view,
  layers: [baseLayer]
});


fetch('./data/bound.geojson').then((res) => {
  return res.json()
}).then((data) => {
  var features = new GeoJSON().readFeatures(data)
  var ft = features[0]
  var bound = ft.getGeometry()
  var shadeLayer = new ShadeLayer({
    map
  })
  shadeLayer.addShade(bound)

  view.fit(bound)
})