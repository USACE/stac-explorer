import logging
import os
import ssl
import urllib.request
import json
import errno


def get_paginated_url(url):
    """Handles paginated fetch logic where 'next' is next page url and 'results' contains data
    Need to add error handling
    """
    resultset = []
    # First fetch
    _r = get_url_as_json(url)
    # Add results to resultset
    resultset += _r["results"]
    while _r['next'] is not None:
        # Watchout...redefine _r as new fetch
        _r = get_url_as_json(_r['next'])
        resultset += _r['results']
    
    return resultset


def get_url_as_json(url):
    """Fetch URL and return python dictionary"""

    def context():
        """helper function to define SSL Context.
        Required for accepting self-signed certs during development.
        """
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        return context
    
    logging.debug(f"fetch URL: {url}")
    with urllib.request.urlopen(url, context=context()) as response:
        html = response.read()
        j = json.loads(html)

    return j


def get_file_as_json(infile):

    _file = os.path.abspath(infile)

    with open(_file, 'r') as jsonfile:
        return json.load(jsonfile)


def mkdir_p(path):
    '''Simulate mkdir_p.
    http://stackoverflow.com/questions/600268/mkdir-p-functionality-in-python
    '''
    try:
        os.makedirs(path)
    except OSError as exc:
        if exc.errno == errno.EEXIST:
            pass
        else:
            raise


def write_json_to_file(DICT, outfile):

    _file = os.path.abspath(outfile)

    with open(_file, 'w') as jsonfile:
        jsonfile.write(json.dumps(DICT, indent=3))
    
    return _file
