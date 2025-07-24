function parseLayerStructure(folder, parentId = '') {
  const id = parentId ? `${ parentId }-${ folder.folder }` : folder.folder;

  return {
    id: `folder-${ id }`,
    name: folder.folder,
    children: folder.contents.map(item => {
      if (item.folder && item.contents) {
        // It's a subfolder — recurse
        return parseLayerStructure(item, id);
      } else {
        // It's a layer
        return {
          id: item.layer,
          name: item.name,
          layer: item.layer,
          url: item.url,
        };
      }
    }),
  };
}

export default function parseLayersStructure(layers) {
  return layers.map(folder => parseLayerStructure(folder));
}
