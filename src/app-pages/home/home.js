import React from "react";
import Navbar from "../../app-components/navbar";
import Card from "../../app-components/cards";
import waterImage from "../../img/water.jpg";

export default () => (
  <main>
    <Navbar />
    <div className="container mx-auto px-20">
      <div className="mt-12 p-4 rounded flex mx-auto bg-red-200">
        This application is under active development. We're deploying new
        progress early and often. Please expect to find buttons that do not go
        anywhere and incomplete features until this banner is taken down.
      </div>
      <div className="text-center mt-12">
        <h1 className="text-5xl">
          <span className="font-light">Title</span>
        </h1>
        <p className="text-gray-800 mt-2 font-thin text-2xl">Subtitle</p>
      </div>

      <div className="container mt-24 mx-auto flex justify-around"></div>
      <div className="container mx-auto mt-24">
        <p className="font-light text-center italic">Tagline</p>
      </div>
    </div>
  </main>
);
