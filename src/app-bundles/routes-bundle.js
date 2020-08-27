import { createRouteBundle } from "redux-bundler";

import Catalog from "../app-pages/catalog";
import Item from "../app-pages/item";

import fourOhFour from "../app-pages/fourOhFour";

export default createRouteBundle(
  {
    "/stac/item/*": Item,
    "/stac/*": Catalog,
    "*": fourOhFour,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
