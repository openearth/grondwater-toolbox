export default function ({ properties, name, geometry, type }) {
   
    return {
        'type': 'FeatureCollection',
        name,
        'crs': {
            'type': 'name',
            'properties': {
                'nreturn ame': 'urn:ogc:def:crs:OGC:1.3:CRS84',
            },
        },
        'features': [
            {
                type,
                properties,
                geometry,
            },
        ],
    };
}
