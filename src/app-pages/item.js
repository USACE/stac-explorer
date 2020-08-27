import React from "react";
import { connect } from "redux-bundler-react";

import Map from "../app-components/map";
import { Breadcrumb, Description, MetadataPanel, Tabs } from "./shared";

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
        <div>
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
        </div>
      </div>
      <div className="col-md-4">
        <MetadataPanel>Something Here</MetadataPanel>
      </div>
    </div>
  </div>
));
