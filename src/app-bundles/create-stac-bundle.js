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
    INITIALIZED: `${baseType}_INITIALIZED`,
  };

  // action creators
  const doFetchUrl = `do${uCaseName}FetchUrl`;
  const doFetchSlugs = `do${uCaseName}FetchSlugs`;
  const doInitialize = `do${uCaseName}Initialize`;
  const doAppendUrlSTAC = `do${uCaseName}AppendUrlSTAC`;
  const doUpdateUrlSTAC = `do${uCaseName}UpdateUrlSTAC`;
  const doToggleSortOrder = `do${uCaseName}ToggleSortOrder`;

  // selectors
  const selectRaw = `select${uCaseName}Raw`;
  const selectSlugMap = `select${uCaseName}SlugMap`;
  const selectInfo = `select${uCaseName}Info`;
  const selectType = `select${uCaseName}Type`;
  const selectCurrentSlug = `select${uCaseName}CurrentSlug`;
  const selectDescription = `select${uCaseName}Description`;
  const selectIsFetching = `select${uCaseName}IsFetching`;
  const selectShouldFetch = `select${uCaseName}ShouldFetch`;
  const selectError = `select${uCaseName}Error`;
  const selectIsInitialized = `select${uCaseName}ShouldInitialize`;
  const selectTitle = `select${uCaseName}Title`;
  const selectLinkSelf = `select${uCaseName}LinkSelf`;
  const selectLinksChild = `select${uCaseName}LinksChild`;
  const selectUrlSTACPath = `select${uCaseName}UrlSTACPath`;
  const selectUrlSTACPathParts = `select${uCaseName}UrlSTACPathParts`;
  const selectUrlRegex = `select${uCaseName}UrlRegex`;
  const selectBreadcrumbs = `select${uCaseName}Breadcrumbs`;
  const selectSortOrder = `select${uCaseName}SortOrder`;

  // reactors
  const reactShouldInitialize = `react${uCaseName}ShouldInitialize`;
  const reactShouldFetchSlugs = `react${uCaseName}ShouldFetchSlugs`;

  return {
    name: config.name,
    // Reducer
    getReducer: () => {
      const initialState = {
        _rootCatalogUrl: config.rootCatalog,
        _rootCatalogSlug: bs58.encode(Buffer.from(config.rootCatalog)),
        _sortOrder: config.sortOrder,
        _urlRegex: /\/stac\/([a-zA-Z0-9/]+)(?:$|\/|\?)/,
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
      // Slugs we should fetch based on the URL
      const urlSlugs = store[selectUrlSTACPathParts]();
      // Slugs we've already attempted to fetch
      const fetchedSlugs = Object.keys(store[selectSlugMap]());
      // Fetch slugs we should fetch but haven't yet
      await store[doFetchSlugs](
        urlSlugs.filter((s) => !fetchedSlugs.includes(s))
      );
      // Base58 Encode Catalog URL and add to slugs
      dispatch({
        type: actions.INITIALIZED,
        payload: { _isInitialized: true },
      });
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
                  },
                  error: e,
                },
              })
            )
        )
      ).then((result) => dispatch({ type: actions.FETCH_FINISH }));
    },

    [doUpdateUrlSTAC]: (slugs) => ({ store }) => {
      // Updates the ?stac= query parameter with new URL
      store.doUpdateUrl({ pathname: `/stac/${slugs.join("/")}` });
    },
    [doAppendUrlSTAC]: (url) => ({ store }) => {
      // Updates the ?stac= query parameter with new URL
      const stacPathPartsNew = store[selectUrlSTACPathParts]().concat(
        bs58.encode(Buffer.from(url))
      );
      store[doUpdateUrlSTAC](stacPathPartsNew);
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
    // Catalogs and Collections have a "description" key; Items do not.
    [selectDescription]: createSelector(selectInfo, selectType, (info, type) =>
      !info ? "" : type === "item" ? `${info.id} STAC Item` : info.description
    ),
    // Catalog, Collection, Item
    [selectType]: createSelector(
      selectCurrentSlug,
      selectSlugMap,
      (currentSlug, SlugMap) => {
        return SlugMap.hasOwnProperty(currentSlug)
          ? SlugMap[currentSlug]["type"]
          : {};
      }
    ),
    [selectIsFetching]: (state) => state[config.name]._isFetching,
    [selectShouldFetch]: (state) => state[config.name]._shouldFetch,
    [selectError]: (state) => state[config.name]._error,
    [selectTitle]: createSelector(selectInfo, (info) => info && info.title),
    [selectLinkSelf]: createSelector(selectInfo, (info) =>
      info && info.links ? info.links.find((L) => L.rel === "self") : {}
    ),
    [selectLinksChild]: createSelector(
      selectInfo,
      selectSortOrder,
      (info, sortOrder) => {
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

        if (!info || !info.links) {
          return [];
        }
        const childLinks = info.links.filter((L) => L.rel === "child");
        return sortOrder === "ascending"
          ? sortAsc(childLinks)
          : sortDesc(childLinks);
      }
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
    // Ancestors used to render breadcrumb; {title: "my title", link: "link"}
    [selectBreadcrumbs]: createSelector(
      selectUrlSTACPathParts,
      selectSlugMap,
      (slugs, slugMap) => {
        if (!slugs.length) return [];
        return slugs.map((slug, idx) => {
          if (
            slugMap.hasOwnProperty(slug) &&
            slugMap[slug].hasOwnProperty("info") &&
            slugMap[slug]["info"].hasOwnProperty("title")
          ) {
            return {
              name: slugMap[slug]["info"]["title"],
              slug: slug,
            };
          }
          return { name: null, slug: slug };
        });
      }
    ),
    [selectIsInitialized]: (state) => state[config.name]._isInitialized,
    // Reactors
    [reactShouldInitialize]: createSelector(
      selectIsInitialized,
      (isInitialized) =>
        !isInitialized ? { actionCreator: doInitialize } : null
    ),
    [reactShouldFetchSlugs]: createSelector(
      selectIsInitialized,
      selectCurrentSlug,
      selectSlugMap,
      (isInitialized, currentSlug, slugMap) => {
        // If not initialized or ?stac= not in the URL or already have slug in store; do nothing
        if (
          !isInitialized ||
          !currentSlug ||
          Object.keys(slugMap).includes(currentSlug)
        ) {
          return null;
        }
        return { actionCreator: doFetchSlugs, args: [[currentSlug]] };
      }
    ),
  };
};
