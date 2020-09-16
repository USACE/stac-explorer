import { createSelector } from "redux-bundler";

import bs58 from "bs58";

export default (opts) => {
  const defaults = {
    name: null,
    routeInfoSelector: "selectPathname",
    sortOrder: "ascending",
  };

  const config = {
    ...defaults,
    ...opts,
  };

  const uCaseName = config.name.charAt(0).toUpperCase() + config.name.slice(1);
  const baseType = config.name.toUpperCase();

  // actions
  const actions = {
    TOGGLE_SORT_ORDER: `${baseType}_TOGGLE_SORT_ORDER`,
    FETCH_START: `${baseType}_FETCH_STARTED`,
    FETCH_RESULT: `${baseType}_FETCH_RESULT`,
    FETCH_FINISH: `${baseType}_FETCH_FINISH`,
    FETCH_ERROR: `${baseType}_FETCH_ERROR`,
    QUERY_UPDATE: `${baseType}_QUERY_UPDATE`,
    INITIALIZED: `${baseType}_INITIALIZED`,
  };

  // action creators
  const doFetchUrl = `do${uCaseName}FetchUrl`;
  const doFetchSlugs = `do${uCaseName}FetchSlugs`;
  const doInitialize = `do${uCaseName}Initialize`;
  const doUpdateUrlSTAC = `do${uCaseName}UpdateUrlSTAC`;
  const doToggleSortOrder = `do${uCaseName}ToggleSortOrder`;
  const doUpdateQueryParams = `do${uCaseName}UpdateQueryParams`;

  // selectors
  const selectRootCatalogUrl = `select${uCaseName}RootCatalogUrl`;
  const selectRaw = `select${uCaseName}Raw`;
  const selectSlugMap = `select${uCaseName}SlugMap`;
  const selectTabs = `select${uCaseName}Tabs`;
  const selectInfo = `select${uCaseName}Info`;
  const selectLinks = `select${uCaseName}Links`;
  const selectLinksItem = `select${uCaseName}LinksItem`;
  const selectLinksItemCount = `select${uCaseName}LinksItemCount`;
  const selectLinksChild = `select${uCaseName}LinksChild`;
  const selectLinksChildCount = `select${uCaseName}LinksChildCount`;
  const selectLinkSelf = `select${uCaseName}LinkSelf`;
  const selectTabActive = `select${uCaseName}TabActive`;
  const selectCurrentSlug = `select${uCaseName}CurrentSlug`;
  const selectDescription = `select${uCaseName}Description`;
  const selectIsFetching = `select${uCaseName}IsFetching`;
  const selectError = `select${uCaseName}Error`;
  const selectIsInitialized = `select${uCaseName}ShouldInitialize`;
  const selectTitle = `select${uCaseName}Title`;
  const selectUrlSTACPath = `select${uCaseName}UrlSTACPath`;
  const selectUrlSTACPathParts = `select${uCaseName}UrlSTACPathParts`;
  const selectUrlRegex = `select${uCaseName}UrlRegex`;
  const selectBreadcrumbs = `select${uCaseName}Breadcrumbs`;
  const selectSortOrder = `select${uCaseName}SortOrder`;
  const selectComponent = `select${uCaseName}Component`;
  const selectProviders = `select${uCaseName}Providers`;
  const selectGeometry = `select${uCaseName}Geometry`;
  const selectAssets = `select${uCaseName}Assets`;
  const selectExtent = `select${uCaseName}Extent`;
  const selectTemporalExtent = `select${uCaseName}TemporalExtent`;
  const selectSpatialExtent = `select${uCaseName}SpatialExtent`;

  // reactors
  const reactShouldInitialize = `react${uCaseName}ShouldInitialize`;
  const reactShouldFetchSlugs = `react${uCaseName}ShouldFetchSlugs`;
  const reactShouldUpdateUrl = `react${uCaseName}ShouldUpdateUrl`;
  const reactShouldSetDefaultTab = `react${uCaseName}ShouldSetDefaultTab`;

  // Valid Tabs for Each Component
  const validTabs = {
    catalog: ["catalogs", "items"],
    item: ["preview", "thumbnail", "assets"],
  };
  // Default Tabs for Each Component
  const defaultTabs = {
    catalog: "catalogs",
    item: "preview",
  };

  const defaultProviders = [
    {
      name: "US Army Corps of Engineers",
      description:
        "Modeling and mapping completed by the US Army Corps of Engineers",
      roles: ["producer", "processor", "host"],
      url: "https://www.usace.army.mil",
    },
  ];

  return {
    name: config.name,
    // Reducer
    getReducer: () => {
      const initialState = {
        _rootCatalogUrl: config.rootCatalog,
        _rootCatalogSlug: bs58.encode(Buffer.from(config.rootCatalog)),
        _sortOrder: config.sortOrder,
        _urlRegex: /\/stac\/(?:item\/)?([a-zA-Z0-9/]+)(?:$|\/|\?)/,
        _isInitialized: false,
        _shouldFetch: true,
        _isFetching: false,
        _lastFetch: null,
        _error: null,
      };
      return (state = initialState, { type, payload }) => {
        switch (type) {
          case actions.FETCH_START:
            return Object.assign({}, state, {
              _shouldFetch: false,
              _isFetching: true,
            });
          case actions.FETCH_RESULT:
            return Object.assign({}, state, payload);
          case actions.FETCH_FINISH:
            return Object.assign({}, state, {
              _isFetching: false,
              _lastFetch: new Date(),
              ...payload,
            });
          case actions.FETCH_ERROR:
            return Object.assign({}, state, {
              _isFetching: false,
              _lastError: new Date(),
              _info: payload.info,
              _error: payload.error,
              ...payload,
            });
          case actions.INITIALIZED:
          case actions.TOGGLE_SORT_ORDER:
          case actions.QUERY_UPDATE:
            return {
              ...state,
              ...payload,
            };
          default:
            return state;
        }
      };
    },
    // Action Creators
    [doInitialize]: () => async ({ dispatch, store }) => {
      dispatch({
        type: actions.INITIALIZED,
        payload: { _isInitialized: true },
      });
    },
    [doUpdateQueryParams]: (queryObj) => ({ dispatch, store }) => {
      dispatch({ type: actions.QUERY_UPDATE, payload: {} });
      // Get current query params
      const queryObjCurrent = store.selectQueryObject();
      store.doUpdateQuery({ ...queryObjCurrent, ...queryObj });
    },
    [doFetchUrl]: (url) => ({ store }) => {
      store[doFetchSlugs]([bs58.encode(Buffer.from(url))]);
    },
    [doFetchSlugs]: (slugs) => ({ dispatch, store }) => {
      dispatch({ type: actions.FETCH_START });

      Promise.all(
        slugs.map((slug) =>
          fetch(bs58.decode(slug))
            .then((r) => r.json())
            .then((j) =>
              dispatch({
                type: actions.FETCH_RESULT,
                payload: {
                  [slug]: {
                    lastFetchDate: new Date(),
                    fetchError: null,
                    info: j,
                  },
                },
              })
            )
            .catch((e) =>
              dispatch({
                type: actions.FETCH_ERROR,
                payload: {
                  [slug]: {
                    lastFetchDate: new Date(),
                    fetchError: e,
                    info: {},
                  },
                  error: e,
                },
              })
            )
        )
      ).then((result) => dispatch({ type: actions.FETCH_FINISH }));
    },
    [doUpdateUrlSTAC]: (link) => ({ store }) => {
      const slug = bs58.encode(Buffer.from(link.href));
      const stacPathPartsNew = store[selectUrlSTACPathParts]().concat(slug);
      const stacPath = stacPathPartsNew.join("/");
      if (link.rel === "item") {
        store.doUpdateUrlWithHomepage(`/stac/item/${stacPath}`);
      } else {
        store.doUpdateUrlWithHomepage(`/stac/${stacPath}`);
      }
    },
    [doToggleSortOrder]: () => ({ dispatch, store }) => {
      const newSortOrder =
        store[selectSortOrder]() === "descending" ? "ascending" : "descending";
      dispatch({
        type: actions.TOGGLE_SORT_ORDER,
        payload: { _sortOrder: newSortOrder },
      });
    },
    // Selectors
    [selectRaw]: (state) => state[config.name],
    // Select all keys that do not start with _ from the store
    [selectSlugMap]: createSelector(selectRaw, (raw) => {
      const obj = {};
      Object.keys(raw).forEach((k) => {
        if (k[0] !== "_") obj[k] = raw[k];
        return;
      });
      return obj;
    }),
    [selectSortOrder]: (state) => state[config.name]._sortOrder,
    // Select approprite STAC json for the current route
    [selectInfo]: createSelector(
      selectCurrentSlug,
      selectSlugMap,
      (currentSlug, SlugMap) => {
        return SlugMap.hasOwnProperty(currentSlug)
          ? SlugMap[currentSlug]["info"]
          : {};
      }
    ),
    [selectLinksItem]: createSelector(
      selectLinks,
      (links) => links.filter((L) => L.rel === "item") || []
    ),
    [selectLinksItemCount]: createSelector(
      selectLinksItem,
      (linksItem) => linksItem.length
    ),
    // Catalogs and Collections have a "description" key; Items do not.
    [selectDescription]: createSelector(selectInfo, (info) =>
      !info ? "" : info.description || null
    ),
    // Catalog, Collection, Item
    [selectTabActive]: createSelector("selectQueryObject", (queryObject) => {
      return queryObject.t || null;
    }),
    [selectIsFetching]: (state) => state[config.name]._isFetching,
    [selectError]: (state) => state[config.name]._error,
    [selectTitle]: createSelector(
      selectInfo,
      (info) => info && (info.title || info.id)
    ),
    [selectLinks]: createSelector(selectInfo, (info) =>
      info && info.links ? info.links : []
    ),
    [selectLinkSelf]: createSelector(
      selectLinks,
      (links) => links.find((L) => L.rel === "self") || {}
    ),
    [selectLinksChild]: createSelector(
      selectLinks,
      selectSortOrder,
      (links, sortOrder) => {
        const sortAsc = (items) => {
          return items.sort((a, b) => {
            if (a.title.toUpperCase() < b.title.toUpperCase()) {
              return -1;
            }
            if (a.title.toUpperCase() > b.title.toUpperCase()) {
              return 1;
            }
            return 0;
          });
        };

        const sortDesc = (items) => {
          return items.sort((a, b) => {
            if (a.title.toUpperCase() < b.title.toUpperCase()) {
              return 1;
            }
            if (a.title.toUpperCase() > b.title.toUpperCase()) {
              return -1;
            }
            return 0;
          });
        };

        if (!links) {
          return [];
        }
        const childLinks = links.filter((L) => L.rel === "child");
        return sortOrder === "ascending"
          ? sortAsc(childLinks)
          : sortDesc(childLinks);
      }
    ),
    [selectLinksChildCount]: createSelector(
      selectLinksChild,
      (linksChild) => linksChild.length
    ),
    [selectUrlSTACPath]: createSelector(
      config.routeInfoSelector,
      selectUrlRegex,
      (pathname, urlRegex) => {
        const stacpath = pathname.match(urlRegex);
        // Strip trailing slash if it exists
        return !stacpath ? "" : stacpath[1];
      }
    ),
    [selectUrlSTACPathParts]: createSelector(selectUrlSTACPath, (urlSTACPath) =>
      !urlSTACPath ? [] : urlSTACPath.split("/")
    ),
    [selectUrlRegex]: (state) => state[config.name]._urlRegex,
    [selectCurrentSlug]: createSelector(
      selectUrlSTACPathParts,
      (urlSTACPathParts) =>
        urlSTACPathParts && urlSTACPathParts.length
          ? urlSTACPathParts[urlSTACPathParts.length - 1]
          : null
    ),
    [selectAssets]: createSelector(selectInfo, (info) =>
      info && info.assets ? info.assets : null
    ),
    [selectGeometry]: createSelector(selectInfo, (info) =>
      info && info.geometry ? info.geometry : null
    ),
    // Ancestors used to render breadcrumb; {title: "my title", link: "link"}
    [selectBreadcrumbs]: createSelector(
      selectUrlSTACPathParts,
      selectSlugMap,
      (slugs, slugMap) => {
        if (!slugs.length) return [];

        let urlParts = ["stac"];
        return slugs.map((slug) => {
          if (
            slugMap.hasOwnProperty(slug) &&
            slugMap[slug].hasOwnProperty("info") &&
            slugMap[slug]["info"].hasOwnProperty("title")
          ) {
            urlParts.push(slug);
            return {
              name: slugMap[slug]["info"]["title"],
              href: `/${urlParts.join("/")}`,
            };
          }
          // Must be an item
          return {
            name: slugMap[slug] && slugMap[slug]["info"]["id"],
            href: null,
          };
        });
      }
    ),
    [selectRootCatalogUrl]: (state) => state[config.name]._rootCatalogUrl,
    [selectProviders]: createSelector(selectInfo, (info) =>
      info.providers ? info.providers : defaultProviders
    ),
    [selectIsInitialized]: (state) => state[config.name]._isInitialized,
    [selectComponent]: createSelector("selectRouteInfo", (routeInfo) => {
      if (routeInfo.pattern === "/stac/*") {
        return "catalog";
      }
      if (routeInfo.pattern === "/stac/item/*") {
        return "item";
      }
      return null;
    }),
    [selectTabs]: createSelector(
      selectComponent,
      selectLinksChildCount,
      selectLinksItemCount,
      selectTabActive,
      (component, childCount, itemCount, tabActive) => {
        const tabIsActive = (tabName) => (tabActive === tabName ? true : false);
        if (component === "item") {
          return validTabs.item.map((t) => ({
            name: t,
            isActive: tabIsActive(t),
          }));
        }
        if (component === "catalog") {
          let tabs = [];
          if (childCount)
            tabs.push({
              name: "catalogs",
              badge: childCount,
              isActive: tabIsActive("catalogs"),
            });
          if (itemCount)
            tabs.push({
              name: "items",
              badge: itemCount,
              isActive: tabIsActive("items"),
            });
          return tabs;
        }
        return [];
      }
    ),
    [selectExtent]: createSelector(
      selectInfo,
      (info) => (info && info.extent) || null
    ),
    [selectSpatialExtent]: createSelector(
      selectExtent,
      (extent) => (extent && extent.spatial) || null
    ),
    [selectTemporalExtent]: createSelector(
      selectExtent,
      (extent) =>
        (extent && extent.temporal && extent.temporal.interval) || null
    ),
    // Reactors
    [reactShouldInitialize]: createSelector(
      selectIsInitialized,
      (isInitialized) =>
        !isInitialized ? { actionCreator: doInitialize } : null
    ),
    [reactShouldFetchSlugs]: createSelector(
      selectIsInitialized,
      selectIsFetching,
      selectError,
      selectUrlSTACPathParts,
      selectSlugMap,
      (isInitialized, isFetching, error, slugs, slugMap) => {
        // If not initialized or ?stac= not in the URL or already have slug in store; do nothing
        if (!isInitialized || isFetching || !slugs.length) {
          return null;
        }
        const unfetchedSlugs = slugs.filter((s) =>
          slugMap.hasOwnProperty(s) ? false : true
        );
        if (!unfetchedSlugs.length) {
          return null;
        }
        return { actionCreator: doFetchSlugs, args: [unfetchedSlugs] };
        // return null;
      }
    ),
    // if stac component live but no stacpath in URL
    // update the url and render the root catalog
    [reactShouldUpdateUrl]: createSelector(
      config.routeInfoSelector,
      selectUrlSTACPath,
      selectRootCatalogUrl,
      (pathname, stacpath, rootCatalogUrl) => {
        if (pathname === "/stac" && stacpath === "") {
          return {
            actionCreator: [doUpdateUrlSTAC],
            args: [{ href: rootCatalogUrl }],
          };
        }
      }
    ),
    [reactShouldSetDefaultTab]: createSelector(
      selectComponent,
      "selectQueryObject",
      selectLinksChild,
      selectLinksItem,
      (component, queryObject, linksChild, linksItem) => {
        // If on a STAC component, do not add STAC query parameters
        if (!component) return null;
        // Missing Query Object OR
        // Invalid Query Object for Component
        const tab = queryObject.t;
        if (!tab || !validTabs[component].includes(tab)) {
          return {
            actionCreator: [doUpdateQueryParams],
            args: [{ t: defaultTabs[component] }],
          };
        }
        // Active Tab is Catalogs but there are no catalogs to show
        if (tab === "catalogs" && !linksChild.length) {
          if (linksItem.length) {
            return {
              actionCreator: [doUpdateQueryParams],
              args: [{ t: "items" }],
            };
          }
        }
        return null;
      }
    ),
  };
};
