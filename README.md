一个适用于openlayers的遮罩图层
# 基本用法
```js

import {Map, View } from ol
import Tile from ol.layer.Tile
import OSM from ol.source.OSM
import GeoJSON = ol.format.GeoJSON
import ShadeLayer from "./ol-shade.js";

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

// {LineString | MultiLineString | Polygon | MultiPolygon} geom
var geom = '你的遮罩数据'

var shadeLayer = new ShadeLayer({
  map
})
shadeLayer.addShade(bound)

view.fit(bound)

const shapeLayer = new ShapeLayer({
  map: map
})

shapeLayer.addShape()
```