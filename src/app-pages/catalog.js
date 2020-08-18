import React from "react";

import Map from "../app-components/map";
import { connect } from "redux-bundler-react";

const Breadcrumb = connect(
  "selectStacBreadcrumbs",
  "doStacUpdateUrlSTAC",
  ({ stacBreadcrumbs: crumbs, doStacUpdateUrlSTAC }) => {
    const handleCrumbClick = (e, stacPathParts) => {
      doStacUpdateUrlSTAC(stacPathParts);
      e.preventDefault();
    };
    const lastIdx = crumbs.length - 1;
    return (
      crumbs && (
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {crumbs.map((crumb, idx) => {
              const crumbSlugs = crumbs.slice(0, idx + 1).map((s) => s.slug);
              return idx === lastIdx ? (
                <li className="breadcrumb-item active">{crumb.name}</li>
              ) : (
                <li
                  className="breadcrumb-item text-info cursor-pointer"
                  onClick={(e) => handleCrumbClick(e, crumbSlugs)}
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

const Description = connect(
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

const Tabs = () => (
  <ul className="nav nav-tabs">
    <li className="nav-item">
      <a className="nav-link active" href="#catalogs">
        Catalogs
      </a>
    </li>
  </ul>
);

const MetadataPanel = () => (
  <div className="bg-light p-4">
    <div className="mb-3 rounded-lg border border-secondary overflow-hidden">
      <Map
        mapKey={"productDetailMap"}
        height={240}
        options={{
          center: [-98.0, 37.0],
          zoom: 3,
        }}
      />
    </div>
    <div>
      <MetadataPanelBlockMetadata />
    </div>
    <div>
      <MetadataPanelBlockProviders />
    </div>
  </div>
);

const MetadataPanelBlock = ({ title, entries }) => (
  <div>
    <h6 className="bg-dark text-white rounded-lg p-1">{title}</h6>
    <ul>
      {Object.keys(entries).map((k) => (
        <li className="d-flex">
          <div className="border-right border-lg border-dark pr-2">{k}</div>
          <div className="ml-2">{entries[k]}</div>
        </li>
      ))}
    </ul>
  </div>
);

const MetadataPanelBlockMetadata = () => {
  const entries = {
    field1: "value 1",
    field2: "value 2",
  };

  return <MetadataPanelBlock title="Metadata" entries={entries} />;
};

const MetadataPanelBlockProviders = () => {
  const entries = {
    field_a: "value abc",
    field_b: "value def",
  };

  return <MetadataPanelBlock title="Providers" entries={entries} />;
};

const Table = connect(
  "selectStacLinksChild",
  "selectStacSortOrder",
  "doStacAppendUrlSTAC",
  "doStacToggleSortOrder",
  ({
    stacLinksChild,
    stacSortOrder,
    doStacAppendUrlSTAC,
    doStacToggleSortOrder,
  }) => {
    const handleLinkClick = (e, href) => {
      doStacAppendUrlSTAC(href);
      e.preventDefault();
    };
    const handleSortOrderClick = (e) => {
      doStacToggleSortOrder();
    };

    return (
      <table className="table table-hover table-striped table-bordered table-sm">
        <thead>
          <tr>
            <th scope="col">
              <div className="d-flex justify-content-between">
                <div>Title</div>
                <div>
                  <i
                    onClick={handleSortOrderClick}
                    className={`cursor-pointer mdi mdi-sort-${stacSortOrder}`}
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {stacLinksChild &&
            stacLinksChild.map((s, idx) => (
              <tr>
                <td
                  className="cursor-pointer"
                  onClick={(e) => handleLinkClick(e, s.href)}
                >
                  {s.title}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
);

export default connect("selectStacLinksChild", ({ stacLinksChild }) => (
  <div className="container">
    <div className="row mt-5">
      <div className="w-100 mb-4">
        <Breadcrumb />
      </div>
    </div>
    <div className="row my-4">
      <div className="col-8">
        <div>
          <Description />
        </div>
        <div className="mb-3 mt-5">
          <Tabs />
        </div>
        <div>
          <Table />
        </div>
      </div>
      <div className="col-4">
        <MetadataPanel />
      </div>
    </div>
  </div>
));
