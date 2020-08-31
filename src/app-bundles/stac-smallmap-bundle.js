import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Stroke } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";

const geoJSON = new GeoJSON();

export default {
  name: "smallMap",

  getReducer: () => {
    const initialData = {
      layer: null,
      _shouldInitialize: true,
      _shouldAddData: false,
      _mapLoaded: false,
    };

    return (state = initialData, { type, payload }) => {
      switch (type) {
        case "STAC_FETCH_FINISH":
          return { ...state, _shouldAddData: true };
        case "MAPS_INITIALIZED":
          if (payload.hasOwnProperty("smallMap")) {
            return { ...state, _mapLoaded: true, _shouldAddData: true };
          } else {
            return state;
          }
        case "MAPS_SHUTDOWN":
          if (payload.hasOwnProperty("smallMap")) {
            return { ...state, _mapLoaded: false };
          } else {
            return state;
          }
        case "SMALLMAP_INITIALIZE_START":
        case "SMALLMAP_INITIALIZE_FINISH":
        case "SMALLMAP_ADD_DATA_START":
        case "SMALLMAP_ADD_DATA_FINISH":
          return { ...state, ...payload };
        default:
          return state;
      }
    };
  },
  doSmallMapInitialize: () => ({ dispatch, store }) => {
    dispatch({
      type: "SMALLMAP_INITIALIZE_START",
      payload: {
        _shouldInitialize: false,
      },
    });

    var vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: "gold",
          width: 4,
        }),
      }),
    });

    dispatch({
      type: "SMALLMAP_INITIALIZE_FINISH",
      payload: { _shouldAddlayer: true, layer: vectorLayer },
    });
  },
  doSmallMapAddData: () => ({ dispatch, store }) => {
    dispatch({
      type: "SMALLMAP_ADD_DATA_START",
      payload: { _shouldAddData: false },
    });
    const data = store.selectStacGeometry();
    if (!data) {
      dispatch({
        type: "SMALLMAP_ADD_DATA_FINISH",
      });
      return;
    }
    const geoProjection = store.selectMapsGeoProjection();
    const webProjection = store.selectMapsWebProjection();
    const map = store.selectMapsObject()["smallMap"];
    const lyr = store.selectSmallMapLayer();
    const src = lyr.getSource();

    map.removeLayer(lyr);
    src.clear();
    const features = geoJSON.readFeatures(data, {
      featureProjection: webProjection,
      dataProjection: geoProjection,
    });
    src.addFeatures(features);
    map.addLayer(lyr);
    const view = map.getView();
    if (features && features.length) {
      view.fit(src.getExtent(), {
        padding: [50, 50, 50, 50],
        maxZoom: 5,
      });
    }

    dispatch({
      type: "SMALLMAP_ADD_DATA_FINISH",
    });
  },
  selectSmallMapRaw: (state) => state.smallMap,
  selectSmallMapLayer: (state) => state.smallMap.layer,
  reactSmallMapShouldInitialize: (state) => {
    if (state.smallMap._shouldInitialize)
      return { actionCreator: "doSmallMapInitialize" };
  },
  reactSmallMapShouldAddData: (state) => {
    if (state.smallMap._mapLoaded && state.smallMap._shouldAddData) {
      return { actionCreator: "doSmallMapAddData" };
    }
  },
};
