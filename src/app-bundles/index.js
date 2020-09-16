import { composeBundles } from "redux-bundler";
import { createNestedUrlBundle } from "@corpsmap/corpsmap-bundles";
import routeBundle from "./routes-bundle";

import pkg from "../../package.json";
import createStacBundle from "./create-stac-bundle";
import mapsBundle from "./maps-bundle";
import smallmapBundle from "./stac-smallmap-bundle";

export default composeBundles(
  routeBundle,
  createStacBundle({
    name: "stac",
    routeInfoSelector: "selectPathnameMinusHomepage",
    rootCatalog:
      // Proxy requests in development to avoid CORS woes
      process.env.NODE_ENV === "development"
        ? "/water/fim/catalog.json"
        : "https://api.rsgis.dev/water/fim/catalog.json",
  }),
  smallmapBundle,
  createNestedUrlBundle({
    pkg: pkg,
  }),
  mapsBundle
);
