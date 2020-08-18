import React from "react";
import { connect } from "redux-bundler-react";

// CSS
import "./css/bootstrap/css/bootswatch.min.css";
import "./css/mdi/css/materialdesignicons.min.css";
import "./css/custom.css";

export default connect("selectRoute", ({ route: Route }) => {
  return (
    <div>
      <Route />
    </div>
  );
});
