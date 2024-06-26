##---
# Serve landuse group names
# ---

import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor

file = open(os.path.dirname(os.path.abspath(__file__)) + "\.pg")
connection_string = file.readline() + file.readline()
pg = psycopg2.connect(connection_string)

records_query = pg.cursor(cursor_factory=RealDictCursor)
records_query.execute("""
    SELECT 'g' || class_code AS code, class_name AS name
    FROM netherlands.landuse_class
    WHERE class_code < 10
    ORDER BY class_name;
""")

results = json.dumps(records_query.fetchall())
print ("Content-type: application/json")
print ()
print (results)