/**
 * Recursively extract all WMS layer objects from a nested folder structure
 * Structure will look like:
 * {folder: 'folder1', contents: [{layer: 'layer1', name: 'Layer 1', url: 'http://example.com/layer1'}, ...]}
 * @param {Array} nodes - Array of folders or layers.
 * @returns {Array} Flattened list of WMS layer objects.
 */
import { generateWmsLayer } from '@/lib/project-layers';

export default function flatNestedLayersStructure(nodes) {
  const result = [];

  for (const node of nodes) {
    if (node.children) {
      
      result.push(...flatNestedLayersStructure(node.children));
    } else {
      
      result.push({
        ...generateWmsLayer({ url: node.url, layer: node.layer, id: node.id }),
        name: node.name,
        baseUrl: node.url,
        id: node.id,
        layer: node.layer,
      });
    }
  }
  return result;
}
