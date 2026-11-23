const assert = require('assert');
const Module = require('module');
const path = require('path');
const babel = require('@babel/core');

const filename = path.resolve(__dirname, '../src/lib/calculation-estimate.js');
const source = babel.transformFileSync(filename, {
  babelrc: false,
  configFile: false,
  plugins: [ '@babel/plugin-transform-modules-commonjs' ],
}).code;
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
loaded._compile(source, filename);

const { estimatePointCells, estimatePolygonCells, estimateDrainageCells, MAX_ESTIMATED_CELLS } = loaded.exports;
const degrees = meters => meters / (6371008.8 * Math.PI / 180);
const rectangle = (x, y, width, height) => ({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [ [
      [ degrees(x), degrees(y) ],
      [ degrees(x + width), degrees(y) ],
      [ degrees(x + width), degrees(y + height) ],
      [ degrees(x), degrees(y + height) ],
      [ degrees(x), degrees(y) ],
    ] ],
  },
  properties: {},
});

assert.strictEqual(estimatePointCells(25000, 250), 10000);
assert.strictEqual(estimatePointCells(25000, 125) > MAX_ESTIMATED_CELLS, true);
assert.strictEqual(estimatePointCells(15800, 100) < MAX_ESTIMATED_CELLS, true);
assert.strictEqual(estimatePointCells(15900, 100) > MAX_ESTIMATED_CELLS, true);
assert.strictEqual(estimatePointCells('', 250), null);
assert.strictEqual(estimatePointCells(1000, 0), null);

const first = rectangle(0, 0, 900, 900);
const second = rectangle(2000, 0, 900, 900);
assert.strictEqual(estimatePolygonCells([ first ], [ 1000 ], 250), 144);
assert.strictEqual(estimatePolygonCells([ first, second ], [ 1000, 500 ], 250), 216);
assert.strictEqual(estimatePolygonCells([ first, second ], [ 1000, 500 ], 125), 864);
assert.strictEqual(estimatePolygonCells([ rectangle(0, 0, 29125, 47875) ], [ 1000 ], 250), 25000);
assert.ok(estimatePolygonCells([ rectangle(0, 0, 29375, 47875) ], [ 1000 ], 250) > MAX_ESTIMATED_CELLS);
assert.strictEqual(estimatePolygonCells([ first ], [ '' ], 250), null);
assert.strictEqual(estimatePolygonCells([], [], 250), null);
assert.strictEqual(estimatePolygonCells([ { type: 'Feature' } ], [ 1000 ], 250), null);

first.id = 'first';
second.id = 'second';
const configurations = [
  { selection: 'first', data: { buffer: 1000, outres: 250 } },
  { selection: 'second', data: { buffer: 500, outres: 125 } },
];
assert.strictEqual(estimateDrainageCells([ first, second ], configurations), 864);
assert.strictEqual(estimateDrainageCells([ first, second ], configurations.slice(0, 1)), null);
configurations[1].data.outres = '';
assert.strictEqual(estimateDrainageCells([ first, second ], configurations), null);

console.log('Calculation estimate tests passed.');
