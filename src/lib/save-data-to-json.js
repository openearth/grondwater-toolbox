import FileSaver from 'file-saver';

const FILE_TITLE_PREFIX = 'project-export';

export default (data) => {
  const timestamp = new Date().toLocaleString().replace(' ', '_').replace(/:/g, '.');
  const filename = `${FILE_TITLE_PREFIX}_${timestamp}.json`;
  const blob = new Blob([ JSON.stringify({ ...data }, null, 2) ], {
    type: 'application/json',
  });

  FileSaver.saveAs(blob, filename);
};
