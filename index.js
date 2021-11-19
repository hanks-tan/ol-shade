import { Map } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Fill, Stroke, Style} from "ol/style";
import { Geometry, Polygon, LinearRing, LineString, MultiLineString, MultiPolygon } from 'ol/geom' 
import { Projection } from "ol/proj";
import Feature from 'ol/Feature'
import { createProjection } from 'ol/proj'

class ShadeLayer{
  constructor (options) {
    this.options = options
    this.style = options.style ? options.style : this._initStyle()
    this._map = options.map
    this._projection = null
    if (this._map) {
      this._projection = this._map.getView().getProjection()
    }
    this._initLayer()
  }

  _initLayer () {
    var source = new VectorSource()
    this._layer = new VectorLayer({
      source,
      style: this.style
    })

    if (this._map && this._map instanceof Map) {
      this._map.addLayer(this._layer)
    }
  }

  _initStyle () {
    return new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.3)'
      }),
      stroke: new Stroke({
        width: 1,
        color: '#ccc'
      })
    })
  }

  getLayer () {
    return this._layer
  }

  getMap () {
    return this._map
  }

  setMap(map) {
    if (map && map instanceof Map) {
      this._map = map
      this._map.addLayer(this._layer)
      this._projection = this._map.getView().getProjection()
    }
  }

  /**
   * 添加遮罩
   * @param {LineString | MultiLineString | Polygon | MultiPolygon} geom 
   * @param {Projection | String } projection 
   */
  addShade (geom, projection) {
    if (geom instanceof Geometry) {
      if(projection && this._projection) {
        var sourceProjection
        if (projection instanceof Projection) {
          sourceProjection = projection.getCode()
        }
        if (['epsg:4326', 'epsg:3857'].includes(projection.toLowerCase())) {
          sourceProjection = createProjection(projection.toUpperCase())
        }
        if (sourceProjection) {
          if (sourceProjection.getCode() !== this._projection.getCode()) {
            geom.transform(sourceProjection, this._projection)
          }
        }
      }

      console.log('擦除')
      var shade = this._erase(geom)
      var feature = new Feature({
        geometry: shade
      })
      this._layer.getSource().addFeature(feature)
    }
  }

  /**
   * 擦除操作
   * @param {LineString | MultiLineString | Polygon | MultiPolygon} geom 
   * @returns {Polygon}
   */
  _erase (geom) {
    var part = this._getGeomGroup(geom)
    if (!part) {
      return
    }
    var extent = this._map.getView().getProjection().getExtent()
    var polygonRing = Polygon.fromExtent(extent);
    part.forEach((item) => {
      let linearRing = new LinearRing(item);
      polygonRing.appendLinearRing(linearRing);
    })
    return polygonRing
  }

    /**
   * geom转坐标数组
   * @param {LineString | MultiLineString | Polygon | MultiPolygon} geom 
   * @returns {Array<Array<import("ol/coordinate").Coordinate>>} 返回geom中的坐标
   */
  _getGeomGroup(geom) {
    var group = [] // 
    var geomType = geom.getType()
    if (geomType === 'LineString') {
      group.push(geom.getCoordinates())
    } else if (geomType === 'MultiLineString') {
      group = geom.getCoordinates()
    } else if (geomType === 'Polygon') {
      group = geom.getCoordinates()
    } else if (geomType === 'MultiPolygon') {
      geom.getPolygons().forEach((poly) => {
        var coords = poly.getCoordinates()
        group = group.concat(coords)
      })
    } else {
      console.log('暂时不支持的类型')
    }
    return group
  }
}

export default ShadeLayer