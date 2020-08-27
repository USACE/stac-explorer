import React from "react";

import { connect } from "redux-bundler-react";

import {
  Breadcrumb,
  Description,
  MetadataPanel,
  MetadataPanelBlock,
  Tabs,
} from "./shared";

const MetadataProviders = connect(
  "selectStacProviders",
  ({ stacProviders }) => (
    <div>
      <h6 className="bg-dark text-white rounded-lg p-1">Providers</h6>
      <ul className="list-group">
        {stacProviders.map((p, idx) => (
          <li className="list-group-item" key={idx}>
            <div>
              <a target="_blank" rel="noopener noreferrer" href={p.url}>
                {p.name}
              </a>
              <em className="ml-1">({p.roles})</em>
            </div>
            <div>
              <p>{p.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
);

const CatalogMetadataPanelBlocks = () => (
  <>
    <MetadataPanelBlock title="Metadata" />
    <MetadataProviders />
  </>
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
          <CatalogMetadataPanelBlocks />
        </MetadataPanel>
      </div>
    </div>
  </div>
));
