import sortObjectByKeys from './sort-object-by-keys';

export default (object) => {
  const sortedObject = JSON.parse(sortObjectByKeys(object));

  const seriesData = Object.entries(sortedObject);

  const array =seriesData.map((values, index) => {
    const areaTop = Math.round(values[1]);
   
    const nameSuffix = index % 2 ? 'aquifier' : 'aquitard';
    const seriesColor = index % 2 ? '#5ba75b' : '#ffffca';
    let areaBottom;
    //In case of last element of array
    if (index === seriesData.length - 1) {
      areaBottom = Math.round(values[1]);
    } else {
       areaBottom = Math.round(seriesData[index+1][1]);
    }
   

    
    return {
        name: `Laag #${ index }: ${ nameSuffix } `,
        type: 'line', 
        color: seriesColor,
        lineStyle: {
        opacity: 0,
        },
        areaStyle: { color: seriesColor, origin: areaBottom },
        data: [ areaTop, areaTop ],
        showSymbol: false,
      }; 
  });
  return array;
};


