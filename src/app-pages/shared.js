import React from "react";

import Map from "../app-components/map";
import { connect } from "redux-bundler-react";

export const Breadcrumb = connect(
  "selectStacBreadcrumbs",
  "doUpdateUrl",
  "doStacUpdateQueryParams",
  ({ stacBreadcrumbs: crumbs, doUpdateUrl, doStacUpdateQueryParams }) => {
    const handleCrumbClick = (e, href) => {
      doUpdateUrl({ pathname: href });
      doStacUpdateQueryParams({ t: "catalogs" });
      e.preventDefault();
    };
    const lastIdx = crumbs.length - 1;
    return (
      crumbs && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {crumbs.map((crumb, idx) => {
              return idx === lastIdx ? (
                <li key={idx} className="breadcrumb-item active">
                  {crumb.name}
                </li>
              ) : (
                <li
                  key={idx}
                  className="breadcrumb-item text-info cursor-pointer"
                  onClick={(e) => handleCrumbClick(e, crumb.href)}
                >
                  {crumb.name}
                </li>
              );
            })}
          </ol>
        </nav>
      )
    );
  }
);

export const Description = connect(
  "selectStacTitle",
  "selectStacDescription",
  "selectStacLinkSelf",
  ({ stacTitle, stacDescription, stacLinkSelf }) => {
    const handleIconClick = (e) => {
      navigator.clipboard.writeText(stacLinkSelf.href);
    };

    return (
      <>
        <h3 className="mb-3">{stacTitle}</h3>
        {/* STAC Link */}
        <div className="my-4" onClick={handleIconClick}>
          <span className="mr-2">
            <i className="mdi mdi-content-copy cursor-pointer" />
          </span>
          <code>
            <span>{stacLinkSelf.href}</span>
          </code>
        </div>
        {/* Description */}
        <div>
          <p className="font-weight-light">{stacDescription}</p>
        </div>
      </>
    );
  }
);

export const Tabs = connect(
  "doStacUpdateQueryParams",
  "selectStacTabs",
  ({ doStacUpdateQueryParams, stacTabs }) => {
    const handleClick = (e, str) => {
      doStacUpdateQueryParams({ t: str });
    };

    return (
      <ul className="nav nav-tabs">
        {stacTabs.map((t, idx) => (
          <li key={idx} className="nav-item cursor-pointer">
            <span
              className={`nav-link ${t.isActive ? "active" : ""}`}
              onClick={(e) => handleClick(e, t.name)}
            >
              <span className="mr-2">{t.name}</span>
              {t.badge ? (
                <span className="badge badge-primary">{t.badge}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    );
  }
);

export const MetadataPanel = ({ children }) => (
  <div className="bg-light border p-4">
    <div
      key={1}
      className="mb-3 rounded-lg border border-secondary overflow-hidden"
    >
      <Map
        mapKey={"productDetailMap"}
        height={240}
        options={{
          center: [-98.0, 37.0],
          zoom: 3,
        }}
      />
    </div>
    {children}
  </div>
);

export const MetadataPanelBlock = ({ title, entries = {} }) => (
  <div>
    <h6 className="bg-dark text-white rounded-lg p-1">{title}</h6>
    <ul>
      {Object.keys(entries).map((k, idx) => (
        <li key={idx} className="d-flex">
          <div className="border-right border-lg border-dark pr-2">{k}</div>
          <div className="ml-2">{entries[k]}</div>
        </li>
      ))}
    </ul>
  </div>
);