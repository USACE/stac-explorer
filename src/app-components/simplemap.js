import React from "react";

import Map from "./map";
import { XYZ } from "ol/source";
import { Tile } from "ol/layer";

export default (props) => {
  const tileLayerInfo = {
    id: "CartoDBPositron",
    name: "CartoDB Positron",
    url:
      "https://cartodb-basemaps-{a-c}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    attributions:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributionss">CartoDB</a>',
    maxZoom: 19,
  };

  const tileLayer = new Tile({
    source: new XYZ({
      url: tileLayerInfo.url,
      crossOrigin: true,
      attributions: tileLayerInfo.attributions,
      maxZoom: tileLayerInfo.maxZoom,
    }),
  });

  return (
    <Map
      mapKey={props.mapKey}
      height={props.height}
      options={{ ...props.options, controls: [], layers: [tileLayer] }}
    />
  );
};
