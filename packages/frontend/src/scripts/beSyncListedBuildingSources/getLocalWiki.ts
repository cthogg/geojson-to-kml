// curl -G 'https://query.wikidata.org/sparql' --data-urlencode 'format=json' --data-urlencode 'query=SELECT ?place ?placeLabel ?location ?article WHERE { SERVICE wikibase:around { ?place wdt:P625 ?location. bd:serviceParam wikibase:center "Point(-0.128916 51.525081)"^^geo:wktLiteral. bd:serviceParam wikibase:radius "0.1". } ?article schema:about ?place; schema:isPartOf <https://en.wikipedia.org/>. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }' | cat
