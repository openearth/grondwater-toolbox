import sortObjectByKeys from './sort-object-by-keys';

export default (object) => {
  const sortedObject = JSON.parse(sortObjectByKeys(object));
  const keys = Object.keys(sortedObject);
  const slicedKeys = keys.slice(1, -1);
  const values = Object.values(sortedObject);
  const slicedValues = values.slice(1, -1);
  const layerPairs = [];
  const gapPairs = [];

  // Push the first layer pair.
  layerPairs.push({
    [keys[0]]: values[0],
    [keys[1]]: values[1],
    gap: false,
  });

  // Push the rest of the layer pairs.
  values.map((n, i) => {
    const evenKey = slicedKeys[2 * i];
    const evenValue = slicedValues[2 * i];
    const oddKey = slicedKeys[2 * i + 1];
    const oddValue = slicedValues[2 * i + 1];
    const hasEvenAndOdd = evenKey && evenValue && oddKey && oddValue;

    if (hasEvenAndOdd) {
      return layerPairs.push({ [evenKey]: evenValue, [oddKey]: oddValue, gap: false });
    }
  });

  // Calculate and collect the gap layer pairs.
  layerPairs.map((pair, index) => {
    if (index === 6) {
      return;
    }

    const values = Object.values(pair);
    const nextValues = Object.values(layerPairs[index + 1]);
    const topEdgeKey = 'top_gap_' + (index + 1) + '_m';
    const bottomEdgeKey = 'bot_gap_' + (index + 1) + '_m';

    return gapPairs.push({ [topEdgeKey]: values[1], [bottomEdgeKey]: nextValues[0], gap: true });
  });

  // Combine the layer and gap pairs into a single array.
  const combinedPairs = layerPairs.reduce((arr, v, i) => arr.concat(v, gapPairs[i]), []);

  // Calculate the height of each layer pair.
  const layers = combinedPairs.map((pair) => {
    if (!pair) { return; }
    const values = Object.values(pair);
    const top = values[0];
    const bottom = values[1];
    const topIsPositive = Math.sign(top) === 1;
    const bottomIsPositive = Math.sign(bottom) === 1;

    if (topIsPositive && bottomIsPositive) {
      return Math.round(top - bottom);
    } else if (topIsPositive && !bottomIsPositive) {
      return Math.round(bottom + top);
    } else {
      return Math.round(bottom - top);
    }
  }).filter(item => item !== undefined);

  return layers.map((layer, index) => ({
    name: `Laag #${ index + 1 }: ${combinedPairs[index].gap ? 'Aquifer' : 'Aquitard'}`,
    type: 'bar',
    stack: 'depth',
    data: [ layer ],
    itemStyle: {
      color: combinedPairs[index].gap ? '#ffffca': '#5ba75b',
    },
  }));
};
