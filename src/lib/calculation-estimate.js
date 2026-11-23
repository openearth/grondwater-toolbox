import bbox from '@turf/bbox';

export const MAX_ESTIMATED_CELLS = 25000;
export const DEFAULT_RESOLUTION = 250;

const METERS_PER_DEGREE = 6371008.8 * Math.PI / 180;

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function estimatePointCells(area, resolution) {
  const size = positiveNumber(area);
  const cellSize = positiveNumber(resolution);
  if (size === null || cellSize === null) {
    return null;
  }
  return (size / cellSize) ** 2;
}

export function estimatePolygonCells(selections, buffers, resolution) {
  const cellSize = positiveNumber(resolution);
  if (!selections.length || selections.length !== buffers.length || cellSize === null) {
    return null;
  }

  const bounds = selections.map((selection, index) => {
    const buffer = positiveNumber(buffers[index]);
    if (!selection.geometry || !selection.geometry.coordinates || buffer === null) {
      return null;
    }
    const extent = bbox(selection);
    if (!extent.every(Number.isFinite) ||
        extent[0] < -180 || extent[2] > 180 ||
        extent[1] < -90 || extent[3] > 90) {
      return null;
    }
    return { extent, buffer };
  });
  if (bounds.some(bound => bound === null)) {
    return null;
  }

  // Use a local equirectangular approximation for the WGS84 bounding boxes.
  const minLatitude = Math.min(...bounds.map(bound => bound.extent[1]));
  const maxLatitude = Math.max(...bounds.map(bound => bound.extent[3]));
  const longitudeScale = METERS_PER_DEGREE * Math.cos((minLatitude + maxLatitude) * Math.PI / 360);
  if (longitudeScale <= 0) {
    return null;
  }
  const minX = Math.min(...bounds.map(({ extent, buffer }) => extent[0] * longitudeScale - buffer));
  const maxX = Math.max(...bounds.map(({ extent, buffer }) => extent[2] * longitudeScale + buffer));
  const minY = Math.min(...bounds.map(({ extent, buffer }) => extent[1] * METERS_PER_DEGREE - buffer));
  const maxY = Math.max(...bounds.map(({ extent, buffer }) => extent[3] * METERS_PER_DEGREE + buffer));

  return Math.ceil((maxX - minX) / cellSize) * Math.ceil((maxY - minY) / cellSize);
}

export function estimateDrainageCells(selections, configurations) {
  const selectedConfigurations = selections.map(selection =>
    configurations.find(config => config.selection === selection.id)
  );
  if (!selectedConfigurations.length || selectedConfigurations.some(config => !config || !config.data)) {
    return null;
  }
  const resolutions = selectedConfigurations.map(config => positiveNumber(config.data.outres));
  if (resolutions.some(resolution => resolution === null)) {
    return null;
  }
  return estimatePolygonCells(
    selections,
    selectedConfigurations.map(config => config.data.buffer),
    Math.min(...resolutions)
  );
}
