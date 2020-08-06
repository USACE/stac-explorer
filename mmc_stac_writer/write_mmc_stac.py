import json
import os
import sys

# Writing for embedded python
sys.path.append("./")

from helpers import write_json_to_file, get_file_as_json, mkdir_p


def stac_catalog(**kwargs):

    return {
        "stac_version": "0.9.0-rc-2",
        "id": kwargs["id"],
        "title": kwargs["title"],
        "description": kwargs["description"],
        "links": kwargs["links"]
    }

def stac_item(**kwargs):

    return {

    }

if __name__ == "__main__":

    # Base Directory (Where to write STAC)
    BASEDIR = os.path.abspath('../public/mmc_fim_library_stac')
    STAC_ROOT = "/mmc_fim_library_stac"

    # Get the information we need to iterate
    library_types = get_file_as_json('./library_type.json')
    libraries = get_file_as_json("./library.json")
    scenarios = get_file_as_json("./scenarios.json")

    # Write base catalog of library_types
    write_json_to_file(
        stac_catalog(
            id="usace-fim",
            title="Flood Inundation Map Library",
            description="US Army Corps of Engineers Flood Inundation Map Library.  Additional description allowed here.",
            links=[{"rel": "self", "href": f"{STAC_ROOT}/catalog.json" },] + [
                { "rel": "child", "id": i["NAME"], "title": i["ALIAS"], "href": f"{STAC_ROOT}/{i['NAME']}/catalog.json"} for i in library_types
            ]
        ),
        os.path.abspath(os.path.join(BASEDIR, 'catalog.json'))
    )

    for library_type in library_types:
        # Set the working directory and make sure it exists
        _workdir_librarytype = os.path.join(BASEDIR, library_type['NAME'])
        mkdir_p(_workdir_librarytype)

        #############################
        # Write Library Type Catalogs
        #############################
        library_type_libraries = [b for b in libraries if b["LIBRARY_TYPE"] == library_type["ID"]]
        links = [
            { "rel": "self", "href": f"{STAC_ROOT}/{library_type['NAME']}/catalog.json" },
            { "rel": "parent", "href": "../catalog.json" },
            { "rel": "root", "href": f"{STAC_ROOT}/catalog.json" },
            ] + [
                { "rel": "child",
                  "id": b["ID"],
                  "title": b["NAME"],
                  "href": f"{STAC_ROOT}/{library_type['NAME']}/{b['ID']}/catalog.json"
                } for b in library_type_libraries
            ]

        write_json_to_file(
            stac_catalog(
                id=library_type["NAME"],
                title=library_type["ALIAS"],
                description=library_type["DESCRIPTION"],
                links=links
            ),
            os.path.abspath(os.path.join(_workdir_librarytype, 'catalog.json'))
        )

        ########################
        # Write Library Catalogs
        ########################
        for library in library_type_libraries:
            # Set the working directory and make sure it exists
            _workdir_library = os.path.join(_workdir_librarytype, str(library["ID"]))
            mkdir_p(_workdir_library)
            # Write catalog for each library
            links = [
                { "rel": "self", "href": f"{STAC_ROOT}/{library_type['NAME']}/{library['ID']}/catalog.json" },
                { "rel": "parent", "href": "../catalog.json" },
                { "rel": "root", "href": f"{STAC_ROOT}/catalog.json" },
                ] + [
                    { "rel": "child", 
                       "id": _s["ID"], 
                       "title": _s["NAME"],
                       "href": f"{STAC_ROOT}/{library_type['NAME']}/{library['ID']}/{_s['ID']}/catalog.json"
                    } for _s in scenarios
                ]
            
            write_json_to_file(
                stac_catalog(
                    id=library["ID"],
                    title=library["NAME"],
                    description="This is a description for this Library",
                    links=links
                ),
                os.path.abspath(os.path.join(_workdir_library, 'catalog.json'))
            )
        


        
