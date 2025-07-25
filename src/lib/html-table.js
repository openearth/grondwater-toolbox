export default function htmlTable(layersInfo) {
  if (!layersInfo || layersInfo.length === 0) {
return '';
}

  const headerRow = `
    <tr>
      <th style="text-align: left; font-weight: bold; width: 50%;">Layer</th>
      <th style="text-align: left; font-weight: bold; width: 50%;">Value</th>
    </tr>
  `;

  const htmlRows = layersInfo
    .map(({ name, value }) => {
      return `
        <tr>
          <td style="overflow-wrap: break-word; vertical-align: top;">${ name }</td>
          <td style="overflow-wrap: break-word; vertical-align: top;">${ value }</td>
        </tr>
      `;
    })
    .join('');

  const table = `
    <table style="table-layout: fixed; width: 100%; border-collapse: collapse;">
      <thead>${ headerRow }</thead>
      <tbody>${ htmlRows }</tbody>
    </table>
  `;

  return table;
}
