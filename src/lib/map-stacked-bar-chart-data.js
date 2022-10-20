import sortObjectByKeys from './sort-object-by-keys';

export default (object) => {
  const sortedObject = JSON.parse(sortObjectByKeys(object));
  const keys = Object.keys(sortedObject);
  const slicedKeys = keys.slice(1, -1);
  const values = Object.values(sortedObject);
  const slicedValues = values.slice(1, -1);
  const layerPairs = [];
  const gapPairs = [];

  // Push the rest of the layer pairs.
  values.map((n, i) => {
    if (
      !(slicedKeys[2 * i] &&
      slicedValues[2 * i] &&
      slicedKeys[2 * i + 1] &&
      slicedValues[2 * i + 1])
    ) {
      return;
    }

    layerPairs.push({
      [slicedKeys[2 * i]]: slicedValues[2 * i],
      [slicedKeys[2 * i + 1]]: slicedValues[2 * i + 1],
      gap: false,
    });
  });

  // Calculate and collect the gap layer pairs.
  let gapIndex = 1;
  keys.map((key, index) => {
    if (key.includes('bot_') || key.includes('ahn_')) {
      return;
    }

    gapPairs.push({
      ['top_gap' + gapIndex + '_m']: values[index - 1],
      ['bot_gap' + gapIndex + '_m']: values[index],
      gap: true,
    });

    gapIndex++;
  });

  // Combine the layer and gap pairs into a single array.
  const combinedPairs = gapPairs
    .reduce((arr, v, i) => arr.concat(v, layerPairs[i]), [])
    .filter(item => item !== undefined);

  // Calculate the height of each layer pair.
  const layers = combinedPairs.map((pair) => {
    if (!pair) {
      return;
    }

    const layerIndex = Object.keys(pair)[0].substring(7, 8);
    const values = Object.values(pair);
    const top = values[0];
    const bottom = values[1];
    const topIsPositive = Math.sign(top) === 1;
    const bottomIsPositive = Math.sign(bottom) === 1;
    let height = 0;

    if (topIsPositive && bottomIsPositive) {
      height = Math.round(top - bottom);
    } else if (topIsPositive && !bottomIsPositive) {
      height = Math.round(bottom + top);
    } else {
      height = Math.round(bottom - top);
    }

    return { index: layerIndex, value: height };
  });

  return layers.map((layer, index) => {
    const nameSuffix = index % 2 === 0
      ? 'aquifer'
      : 'aquitard';

    return {
      name: `Laag #${ layer.index }: ${ nameSuffix }`,
      type: 'bar',
      stack: 'depth',
      data: [ layer.value ],
      itemStyle: {
        color: index % 2 ? '#5ba75b' : '#ffffca',
      },
    };
  });
};
