import React from "react";
import { connect } from "redux-bundler-react";

import Map from "../app-components/map";
import {
  Breadcrumb,
  Description,
  MetadataPanel,
  MetadataSectionEntry,
  MetadataSection,
  MetadataSectionProviderEntry,
  Tabs,
} from "./shared";

const AssetsTable = connect(
  "selectStacAssetsAsArray",
  ({ stacAssetsAsArray: assets }) => (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Content-Type</th>
        </tr>
      </thead>
      <tbody>
        {assets &&
          assets.map((item, idx) => (
            <tr key={idx}>
              <td>
                <a href={item.href}>{item.title}</a>
              </td>
              <td>{item.type}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
);

const ItemMetadata = connect(
  "selectStacProviders",
  "selectStacCollection",
  "selectStacProperties",
  ({
    stacProviders,
    stacCollection: collection,
    stacProperties: properties,
  }) => {
    return (
      // Extension Links, Properties, Providers
      <>
        <MetadataSection title="Metadata">
          {collection && (
            <MetadataSectionEntry title="Collection" value={collection} />
          )}
        </MetadataSection>
        <MetadataSection title="Projection">
          {properties && properties["proj:epsg"] && (
            <MetadataSectionEntry
              title="EPSG Code"
              value={
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://spatialreference.org/ref/epsg/${properties["proj:epsg"]}/`}
                >
                  {properties["proj:epsg"]}
                </a>
              }
            />
          )}
        </MetadataSection>
        <MetadataSection title="Providers">
          {stacProviders && stacProviders.length ? (
            <>
              {stacProviders.map((p, idx) => (
                <MetadataSectionProviderEntry providerInfo={p} />
              ))}
            </>
          ) : null}
        </MetadataSection>
      </>
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
    <div className="row my-4">
      <div className="col-md-8">
        <div>
          <Description />
        </div>
        <div className="mt-5">
          <Tabs />
        </div>
        <div className="mt-2">
          {stacTabActive === "preview" && (
            <div
              key={1}
              className="mb-3 border border-secondary overflow-hidden"
            >
              <Map
                mapKey={"preview"}
                height={480}
                options={{
                  center: [-98.0, 37.0],
                  zoom: 3,
                }}
              />
            </div>
          )}
          {stacTabActive === "thumbnail" && <p>Thumbnail Preview Here</p>}

          {stacTabActive === "assets" && <AssetsTable />}
        </div>
      </div>
      <div className="col-md-4">
        <MetadataPanel>
          <ItemMetadata />
        </MetadataPanel>
      </div>
    </div>
  </div>
));
