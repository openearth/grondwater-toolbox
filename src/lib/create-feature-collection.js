export default function (name, selections) {
   
    return {
        'type': 'FeatureCollection',
        name,
        'crs': {
            'type': 'name',
            'properties': {
                'nreturn ame': 'urn:ogc:def:crs:OGC:1.3:CRS84',
            },
        },
        'features': selections.map(({ properties, geometry, type }) => ({
                type,
                properties,
                geometry,
            })),
    };
}
