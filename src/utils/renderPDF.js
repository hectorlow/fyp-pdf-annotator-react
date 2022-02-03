// put appropriate global functions here
// i guess the global functions should not have too complex dependencies
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

const renderPDF = (filename, callback) => {
  // code to initialise pdfjs worker? not sure
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  // reference to pdf in firebase cloud storage
  const storage = getStorage();
  const pdfRef = ref(storage, `pdfs/${filename}`);

  let pdfDoc = null;
  let pageNum = 1;
  let numPages = 0;
  const scale = 1.5;

  const createPageElements = () => {
    const pageWrapper = document.createElement('div');
    const canvas = document.createElement('canvas');
    const textLayer = document.createElement('div');

    pageWrapper.setAttribute('class', 'page-wrapper');
    canvas.setAttribute('class', 'canvas');
    textLayer.setAttribute('class', 'textLayer');

    pageWrapper.appendChild(canvas);
    pageWrapper.appendChild(textLayer);

    // add elements to dom
    const canvases = document.querySelector('#canvases');
    canvases.appendChild(pageWrapper);

    return { canvas, textLayer };
  };

  const renderPage = (num) => {
    pdfDoc.getPage(num)
      .then((page) => {
        const viewport = page.getViewport({ scale });

        const { canvas, textLayer } = createPageElements();
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
          canvasContext: context,
          viewport,
        };

        // get text content and render text layer
        page.render(renderContext).promise
          .then(() => page.getTextContent())
          .then((textContent) => {
            textLayer.style.height = `${viewport.height}px`;
            textLayer.style.width = `${viewport.width}px`;

            // set offset of text layer based on canvas position
            textLayer.style.left = `${canvas.offsetLeft}px`;
            textLayer.style.top = `${canvas.offsetTop}px`;
            textLayer.style.height = `${canvas.offsetHeight}px`;
            textLayer.style.width = `${canvas.offsetWidth}px`;

            pdfjsLib.renderTextLayer({
              textContent,
              container: textLayer,
              viewport,
              textDivs: [],
            });

            pageNum += 1;
            if (pdfDoc !== null && pageNum <= numPages) {
              renderPage(pageNum);
            } else {
              callback();
            }
          });
      });
  };

  getDownloadURL(pdfRef)
    .then((url) => {
      pdfjsLib.getDocument(url).promise.then((pdfDoc_) => {
        pdfDoc = pdfDoc_;
        numPages = pdfDoc.numPages;

        renderPage(pageNum);
      });
    });

  // window resize event listener
  function resize() {
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

  window.onresize = resize;
};

export default renderPDF;
