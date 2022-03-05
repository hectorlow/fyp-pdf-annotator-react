function repositionTextLayer() {
  const canvases = document.getElementsByClassName('canvas');
  const textLayers = document.getElementsByClassName('textLayer');

  // iterate through HTML collection and update textLayer offsets
  for (let i = 0; i < canvases.length; i += 1) {
    const canvas = canvases[i];
    const textLayer = textLayers[i];

    textLayer.style.left = `${canvas.offsetLeft}px`;
    textLayer.style.top = `${canvas.offsetTop}px`;
    textLayer.style.height = `${canvas.offsetHeight}px`;
    textLayer.style.width = `${canvas.offsetWidth}px`;
  }
}

function exportCSV(files, rootPath = null) {
  const csvHeader = [
    'text',
    'category',
    'code',
    'filename',
    'link',
  ];

  const csvRows = [
    csvHeader,
  ];

  files.forEach((filename) => {
    let highlights = window.localStorage.getItem(`${filename}_array`);
    highlights = JSON.parse(highlights);

    highlights.forEach((entry) => {
      let link = window.location.origin;
      link += '/extensionPage.html';
      link += `?filename=${filename.replace(/\s/g, '%20')}`;
      link += `&scrollY=${entry.absScroll}`;

      if (rootPath !== null) link += `&rootPath=${rootPath}`;

      const values = [];
      values.push(entry.text.replace(/\n/, ' '));
      values.push(entry.category);
      values.push(entry.code);
      values.push(filename);
      values.push(link);

      csvRows.push(values);
    });
  });

  const csvContent = `data:text/csv;charset=utf-8,${
    csvRows.map((e) => e.join(',')).join('\n')}`;

  const encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}

export { repositionTextLayer, exportCSV };
