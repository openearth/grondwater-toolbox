import FileSaver from 'file-saver';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

const FILE_TITLE_PREFIX = 'layers-export';

export default async function exportLayerData (urls) {
  let zip = new JSZip();

  return Promise.all(urls.map(async (url, index) => {
    const timestamp = new Date().toLocaleString().replace(' ', '_').replace(/:/g, '.');
    const filename = `${ FILE_TITLE_PREFIX }_${ timestamp }_${ index }.tiff`;

    return JSZipUtils.getBinaryContent(url)
      .then(data => zip.file(filename, data, { binary: true }))
      .catch(err => console.log(err));
  }))
  .then(() => zip.generateAsync({ type: 'blob' }))
  .then(content => {
    FileSaver.saveAs(content, 'test.zip');
  });
}
