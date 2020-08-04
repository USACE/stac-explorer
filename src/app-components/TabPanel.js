import React from "react";
import { connect } from "redux-bundler-react";
// import CatalogList from "./CatalogList";

function TabPanel() {
  const tabs1 = [{ id: 1, name: "Catalog", isActive: true }];

  const Tabs = ({ items }) => (
    <div className="tabs">
      <ul>
        {items.map((item) => (
          <li id={item.id} className={item.isActive ? "is-active" : ""}>
            <a>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <Tabs items={tabs1} />
      {/* <CatalogList /> */}
    </div>
  );
}

export default connect(TabPanel);
