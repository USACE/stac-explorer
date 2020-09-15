import React from "react";

import { connect } from "redux-bundler-react";

import { Breadcrumb, Description, MetadataPanel, Tabs } from "./shared";

const CatalogMetadataTable = connect(
  "selectStacProviders",
  "selectStacInfo",
  ({ stacProviders, stacInfo: info }) => {
    // Styles on Headings

    const Heading = ({ title }) => (
      <tr>
        <td colspan="2" className="bg-success rounded">
          <h6>{title}</h6>
        </td>
      </tr>
    );

    const Entry = ({ title, value }) => {
      return (
        <tr>
          <td className="title">{title}</td>
          <td>{value}</td>
        </tr>
      );
    };

    const Provider = ({ providerInfo: p }) => (
      <tr>
        <td colspan="2" className="provider">
          <a target="_blank" rel="noopener noreferrer" href={p.url}>
            {p.name}
          </a>
          <em className="ml-2">({p.roles.join(", ")})</em>
          <div className="description">
            <p>{p.description}</p>
          </div>
        </td>
      </tr>
    );

    return (
      info && (
        <table className="table-sm">
          <tbody>
            <Heading title="Metadata" />
            {info.stac_version && (
              <Entry title="STAC Version" value={info.stac_version} />
            )}
            {info.license && (
              <Entry
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

            {/* STAC PROVIDERS */}
            {stacProviders && stacProviders.length ? (
              <>
                <Heading title="Providers" />
                {stacProviders.map((p, idx) => (
                  <Provider providerInfo={p} />
                ))}
              </>
            ) : null}
          </tbody>
        </table>
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
          <CatalogMetadataTable />
        </MetadataPanel>
      </div>
    </div>
  </div>
));
