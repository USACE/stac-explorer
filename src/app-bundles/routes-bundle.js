import { createRouteBundle } from "redux-bundler";

import Catalog from "../app-pages/catalog";

import fourOhFour from "../app-pages/fourOhFour";

export default createRouteBundle(
  {
    "/stac/*": Catalog,
    "*": fourOhFour,
  },
  {
    routeInfoSelector: "selectPathnameMinusHomepage",
  }
);
