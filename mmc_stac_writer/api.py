#!/usr/env python

import ssl
import sys
import urllib.parse

from .config import LIBRARY_API_1
from .helpers import (
    get_paginated_url,
    get_url_as_json
)

def get_library_types():
    url = f'{LIBRARY_API_1}'
    return get_url_as_json(url)


def get_libraries(library_type_id):
    url = f'{LIBRARY_API_1}'
    return get_url_as_json(url)
