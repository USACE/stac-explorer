import React from "react";

import Map from "../app-components/map";
import { connect } from "redux-bundler-react";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <div className="flex items-center w-full bg-gray-300 p-6">
          {crumbs.map((crumb, idx) => {
            const crumbSlugs = crumbs.slice(0, idx + 1).map((s) => s.slug);
            return idx === lastIdx ? (
              <div className="text-gray-700">{crumb.name}</div>
            ) : (
              <>
                <div
                  onClick={(e) => handleCrumbClick(e, crumbSlugs)}
                  className="cursor-pointer text-blue-600 hover:text-blue-400"
                >
                  {crumb.name}
                </div>
                <div className="mx-4">/</div>
              </>
            );
          })}
        </div>
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
      <div>
        {/* Title */}
        <div className="">
          <h2 className="text-3xl mb-4">{stacTitle}</h2>
          {/* STAC Link */}
          <div onClick={handleIconClick} className="mb-8 p-1">
            <small>
              <span className="icon cursor-pointer p-2">
                <FontAwesomeIcon icon={faCopy} />
              </span>

              <code>
                <span className="has-text-black">{stacLinkSelf.href}</span>
              </code>
            </small>
          </div>
        </div>
        {/* Description */}
        <div className="font-light text-xl">
          <p>{stacDescription}</p>
        </div>
      </div>
    );
  }
);

const Tabs = () => (
  <ul class="flex">
    <li class="mr-6 border px-6 py-4">Catalogs</li>
  </ul>
);

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
      <table class="table-auto w-full">
        <thead>
          <tr className="border">
            <th class="bg-gray-700 text-white px-4 py-2">
              <div className="flex justify-between">
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
              <tr
                className="cursor-pointer"
                onClick={(e) => handleLinkClick(e, s.href)}
              >
                <td className={`border px-4 py-1 ${idx % 2 && "bg-gray-200"}`}>
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
  <div className="container mx-auto mt-8">
    <Breadcrumb />
    {/* Left Column */}
    <div className="my-12 flex flex-row">
      <div className="w-2/3">
        <div className="w-11/12">
          <Description />
          <div className="my-16">
            <Tabs />
            <Table />
          </div>
        </div>
      </div>
      {/* Right Column */}
      <div className="w-1/3">
        <div className="p-4 bg-gray-200">
          <Map
            mapKey={"productDetailMap"}
            height={300}
            options={{
              center: [-98.0, 37.0],
              zoom: 2,
            }}
          />
          <div>
            <h6 className="title is-size-6 is-marginless">Metadata</h6>
            <hr className="is-marginless" />
          </div>
        </div>
      </div>
    </div>
  </div>
));
