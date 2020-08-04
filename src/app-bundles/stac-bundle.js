import { createSelector } from "redux-bundler";

import bs58 from "bs58";

export default {
  name: "stac",
  // Reducer
  getReducer: () => {
    const initialState = {
      _rootCatalog: "/stac/mmc_fim_library_stac/catalog.json",
      _shouldFetch: true,
      _isFetching: false,
      _lastFetch: null,
      _error: null,
    };
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case "STAC_FETCH_START":
          return Object.assign({}, state, {
            _shouldFetch: false,
            _isFetching: true,
          });
        case "STAC_FETCH_RESULT":
          return Object.assign({}, state, payload);
        case "STAC_FETCH_FINISH":
          return Object.assign({}, state, {
            _isFetching: false,
            _lastFetch: new Date(),
            ...payload,
          });
        case "STAC_FETCH_ERROR":
          return Object.assign({}, state, {
            _isFetching: false,
            _lastError: new Date(),
            _info: payload.info,
            _error: payload.error,
          });
        default:
          return state;
      }
    };
  },
  // Action Creators
  doStacFetchUrl: (url) => ({ store }) => {
    store.doStacFetchSlugs([bs58.encode(Buffer.from(url))]);
  },
  doStacFetchSlugs: (slugs) => ({ dispatch, store }) => {
    dispatch({ type: "STAC_FETCH_START" });

    Promise.all(
      slugs.map((slug) =>
        fetch(bs58.decode(slug))
          .then((r) => r.json())
          .then((j) =>
            dispatch({
              type: "STAC_FETCH_RESULT",
              payload: {
                [slug]: { type: "catalog", info: j },
              },
            })
          )
          .catch((e) =>
            dispatch({ type: "STAC_FETCH_ERROR", payload: { error: e } })
          )
      )
    ).then((result) => dispatch({ type: "STAC_FETCH_FINISH" }));
  },
  // Fetch root catalog; Fetch all other catalogs encoded in the url;
  doStacInitialize: () => ({ store }) => {
    store.doStacFetchSlugs(
      store.selectStacUrlSlugs().concat(store.selectStacRootCatalogSlug())
    );
  },
  doStacUpdateUrl: (url) => ({ dispatch, store }) => {
    const newUrlParts = store
      .selectStacUrlSlugs()
      .concat(bs58.encode(Buffer.from(url)));
    store.doUpdateUrl(`/${newUrlParts.join("/")}`);
  },
  // Selectors
  selectStacRaw: (state) => state.stac,
  // Select all keys that do not start with _ from the store
  selectStacUrlMap: createSelector("selectStacRaw", (raw) => {
    const obj = {};
    Object.keys(raw).map((k) => {
      if (k[0] !== "_") obj[k] = raw[k];
    });
    return obj;
  }),
  // Select approprite STAC json for the current route
  selectStacInfo: createSelector(
    "selectStacCurrentSlug",
    "selectStacUrlMap",
    (currentSlug, urlMap) => {
      return urlMap.hasOwnProperty(currentSlug)
        ? urlMap[currentSlug]["info"]
        : {};
    }
  ),
  // Catalogs and Collections have a "description" key; Items do not.
  selectStacDescription: createSelector(
    "selectStacInfo",
    "selectStacType",
    (info, type) =>
      type === "item" ? `${info.id} STAC Item` : info.description
  ),
  // Catalog, Collection, Item
  selectStacType: createSelector(
    "selectStacCurrentSlug",
    "selectStacUrlMap",
    (currentSlug, urlMap) => {
      return urlMap.hasOwnProperty(currentSlug)
        ? urlMap[currentSlug]["type"]
        : {};
    }
  ),
  selectStacIsFetching: (state) => state.stac._isFetching,
  selectStacShouldFetch: (state) => state.stac._shouldFetch,
  selectStacError: (state) => state.stac._error,
  selectStacRootCatalog: (state) => state.stac._rootCatalog,
  selectStacRootCatalogSlug: createSelector(
    "selectStacRootCatalog",
    (catalog) => bs58.encode(Buffer.from(catalog))
  ),
  selectStacTitle: createSelector("selectStacInfo", (info) => info.title),
  selectStacLinkSelf: createSelector("selectStacInfo", (info) =>
    info.links ? info.links.find((L) => L.rel === "self") : {}
  ),
  selectStacLinksChild: createSelector("selectStacInfo", (info) =>
    info.links ? info.links.filter((L) => L.rel === "child") : []
  ),
  selectStacUrlSlugs: createSelector("selectRouteInfo", (routeInfo) => {
    const urlPath = routeInfo.url.replace(/^\/|\/$/g, "");
    return urlPath === "" ? [] : urlPath.split("/");
  }),
  selectStacSlugs: createSelector(
    "selectStacRootCatalogSlug",
    "selectStacUrlSlugs",
    (rootSlug, urlSlugs) => [rootSlug].concat(urlSlugs)
  ),
  selectStacCurrentSlug: createSelector(
    "selectStacUrlSlugs",
    "selectStacRootCatalogSlug",
    (urlSlugs, rootSlug) =>
      !urlSlugs.length ? rootSlug : urlSlugs[urlSlugs.length - 1]
  ),
  // Ancestors used to render breadcrumb; {title: "my title", link: "link"}
  selectStacBreadcrumbs: createSelector(
    "selectStacSlugs",
    "selectStacUrlMap",
    (slugs, urlMap) => {
      if (!slugs.length) return [];
      let arr = [];
      slugs.map((slug, idx) => {
        if (urlMap.hasOwnProperty(slug)) {
          arr.push({
            name: urlMap[slug]["info"]["title"],
            href: `/${slugs.slice(1, idx + 1).join("/")}`,
          });
        } else {
          arr.push({
            name: "unknown",
            href: `/${slugs.slice(1, idx + 1).join("/")}`,
          });
        }
      });
      return arr;
    }
  ),
  // Reactors
  reactStacShouldInitialize: createSelector(
    "selectStacShouldFetch",
    "selectStacIsFetching",
    (shouldFetch, isFetching) =>
      shouldFetch && !isFetching ? { actionCreator: "doStacInitialize" } : null
  ),
};
