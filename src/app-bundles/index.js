import { composeBundles } from "redux-bundler";
import { createNestedUrlBundle } from "@corpsmap/corpsmap-bundles";
import routeBundle from "./routes-bundle";

import pkg from "../../package.json";
import createStacBundle from "./create-stac-bundle";
import mapsBundle from "./maps-bundle";

export default composeBundles(
  routeBundle,
  createStacBundle({
    name: "stac",
    rootCatalog: "/stac/mmc_fim_library_stac/catalog.json",
  }),
  createNestedUrlBundle({
    pkg: pkg,
  }),
  mapsBundle
);
