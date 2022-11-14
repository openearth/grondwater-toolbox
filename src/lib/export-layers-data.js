import FileSaver from 'file-saver';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

export default async function exportLayerData (layers) {
  let zip = new JSZip();

  return Promise.all(layers.map(async ({ name, url }) => JSZipUtils.getBinaryContent(url)
    .then(data => zip.file(`${ name }.tiff`, data, { binary: true }))
    .catch(err => console.log(err))
  ))
  .then(() => zip.generateAsync({ type: 'blob' }))
  .then(content => FileSaver.saveAs(content, 'layers.zip'));
}
