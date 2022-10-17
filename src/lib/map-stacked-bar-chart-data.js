
export default (object) => {
  const keys = Object.keys(object);
  const slicedKeys = keys.slice(1, -1);
  const values = Object.values(object);
  const slicedValues = values.slice(1, -1);
  const edgePairs = [];

  // Push the first layer pair.
  edgePairs.push({
    [keys[0]]: values[0],
    [keys[1]]: values[1],
  });

  // Push the middle layer pairs.
  values.map((n, i) => {
    const evenKey = slicedKeys[2 * i];
    const evenValue = slicedValues[2 * i];
    const oddKey = slicedKeys[2 * i + 1];
    const oddValue = slicedValues[2 * i + 1];
    const hasEvenAndOdd = evenKey && evenValue && oddKey && oddValue;

    if (hasEvenAndOdd) {
      return edgePairs.push({ [evenKey]: evenValue, [oddKey]: oddValue });
    }
  });

  const layersThickness = edgePairs.map((pair) => {
    const values = Object.values(pair);
    return values[1] - values[0];
  });

  return layersThickness.map((layer, index) => ({
      name: `Laag ${ index + 1 }`,
      type: 'bar',
      stack: 'depth',
      data: [ layer ],
    }));
};
