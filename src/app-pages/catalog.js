import React from "react";

import { connect } from "redux-bundler-react";

import {
  Breadcrumb,
  Description,
  MetadataPanel,
  MetadataSectionEntry,
  MetadataSection,
  MetadataSectionProviderEntry,
  Tabs,
} from "./shared";

const CatalogMetadata = connect(
  "selectStacProviders",
  "selectStacInfo",
  ({ stacProviders, stacInfo: info }) => {
    // Styles on Headings

    return (
      info && (
        <>
          <MetadataSection title="Metadata">
            {info.stac_version && (
              <MetadataSectionEntry
                title="STAC Version"
                value={info.stac_version}
              />
            )}
            {info.license && (
              <MetadataSectionEntry
                title="License"
                value={
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://spdx.org/licenses/${info.license}.html`}
                  >
                    {info.license}
                  </a>
                }
              />
            )}
          </MetadataSection>
          {stacProviders && stacProviders.length ? (
            <MetadataSection title="Providers">
              {stacProviders.map((p, idx) => (
                <MetadataSectionProviderEntry providerInfo={p} />
              ))}
            </MetadataSection>
          ) : null}
        </>
      )
    );
  }
);

const TableCatalogs = connect(
  "selectStacLinksChild",
  "doStacUpdateUrlSTAC",
  ({ stacLinksChild, doStacUpdateUrlSTAC }) => {
    const handleItemClick = (e, item) => {
      doStacUpdateUrlSTAC(item);
      e.preventDefault();
    };

    return <Table items={stacLinksChild} handleItemClick={handleItemClick} />;
  }
);

const TableItems = connect(
  "selectStacLinksItem",
  "doStacUpdateUrlSTAC",
  ({ stacLinksItem, doStacUpdateUrlSTAC }) => {
    const handleItemClick = (e, item) => {
      doStacUpdateUrlSTAC(item);
      e.preventDefault();
    };

    return <Table items={stacLinksItem} handleItemClick={handleItemClick} />;
  }
);

const Table = connect(
  "selectStacSortOrder",
  "doStacToggleSortOrder",
  ({ stacSortOrder, doStacToggleSortOrder, items, handleItemClick }) => {
    const handleSortOrderClick = (e) => {
      doStacToggleSortOrder();
    };

    return (
      <table className="table table-hover table-striped table-bordered table-sm">
        <thead>
          <tr>
            <th scope="col">
              <div
                className="cursor-pointer d-flex justify-content-between"
                onClick={handleSortOrderClick}
              >
                <div>Title</div>
                <div>
                  <i className={`mdi mdi-sort-${stacSortOrder}`} />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {items &&
            items.map((item, idx) => (
              <tr key={idx}>
                <td
                  className="cursor-pointer"
                  onClick={(e) => handleItemClick(e, item)}
                >
                  {item.title}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }
);

export default connect("selectStacTabActive", ({ stacTabActive }) => (
  <div className="container">
    <div className="row mt-5">
      <div className="w-100 mb-4">
        <Breadcrumb />
      </div>
    </div>
    <div className="row my-1">
      <div className="col-md-8">
        <div>
          <Description />
        </div>
        <div className="mb-1 mt-5">
          <Tabs />
        </div>
        <div>
          {stacTabActive === "catalogs" ? (
            <TableCatalogs />
          ) : stacTabActive === "items" ? (
            <TableItems />
          ) : null}
        </div>
      </div>
      <div className="col-md-4">
        <MetadataPanel>
          <CatalogMetadata />
        </MetadataPanel>
      </div>
    </div>
  </div>
));
