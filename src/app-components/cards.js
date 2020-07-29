import React from "react";

export default ({ title, text, img, imgAlt, href }) => (
  <a href={href}>
    <div className="max-w-xs rounded overflow-hidden shadow-lg hover:shadow-2xl">
      <img className="w-full" src={img} alt={imgAlt} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{text}</p>
      </div>
      <div className="px-6 py-4"></div>
    </div>
  </a>
);
