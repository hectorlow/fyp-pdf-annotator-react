import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
// import './text_layer_builder';
// import AnnotationPopup from '../contentScript/components/AnnotationPopup';
import './text_layer_builder.css';

const App = () => {
  const [canvasWrapper, setCanvasWrapper] = useState('');

  useEffect(() => {
    setCanvasWrapper(document.querySelector('#canvas-wrapper'));

    chrome.storage.sync.get(['fyp_highlights'], (result) => {
      console.log(result.fyp_highlights);
    });
  }, []);

  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  let pdfDoc = null;
  let pageNum = 1;
  let numPages = 0;
  const scale = 1.5;

  const renderPage = (num) => {
    pdfDoc.getPage(num).then((page) => {
      // get viewport of page
      const viewport = page.getViewport({ scale });

      // create canvas and text layer elements
      const pdfPageWrapper = document.createElement('div');
      const canvas = document.createElement('canvas');
      const textLayer = document.createElement('div');

      pdfPageWrapper.setAttribute('class', 'pdf-page-wrapper');
      canvas.setAttribute('class', 'pdf-canvas');
      textLayer.setAttribute('class', 'textLayer');

      const context = canvas.getContext('2d');

      // append canvas and text layer to canvas wrapper element
      pdfPageWrapper.appendChild(canvas);
      pdfPageWrapper.appendChild(textLayer);
      canvasWrapper.appendChild(pdfPageWrapper);

      // set canvas height and weight
      canvas.style.display = 'block';
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      context.viewportWidth = canvas.height;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      page.render(renderContext).promise.then(() => {
        console.log('Rendering page');
        // return text content obtained from current page
        return page.getTextContent();
      }).then((textContent) => {
        // assign height and width of text layer base on viewport
        // height = 1260px, width = 890px
        textLayer.style.height = `${viewport.height}px`;
        textLayer.style.width = `${viewport.width}px`;

        // set offset of text layer based on canvas position
        textLayer.style.left = `${canvas.offsetLeft}px`;
        textLayer.style.top = `${canvas.offsetTop}px`;
        textLayer.style.height = `${canvas.offsetHeight}px`;
        textLayer.style.width = `${canvas.offsetWidth}px`;

        // render text layer over pdf canvas
        pdfjsLib.renderTextLayer({
          textContent,
          container: textLayer,
          viewport,
          textDivs: [],
        });

        pageNum += 1;
        if (pdfDoc !== null && pageNum <= numPages) {
          renderPage(pageNum);
        }
      });
    });
  };

  const removePreviousPDF = () => {
    // set pageNum back to 1
    pageNum = 1;

    const prevPdf = Array.from(
      document.getElementsByClassName('pdf-page-wrapper'),
    );

    if (prevPdf.length !== 0) {
      prevPdf.forEach((pdfPage) => {
        pdfPage.remove();
      });
    }
  };

  const loadPDF = (pdf) => {
    // render pdf document once file is loaded
    pdfjsLib.getDocument(pdf).promise.then((pdfDoc_) => {
      pdfDoc = pdfDoc_;
      numPages = pdfDoc.numPages;
      renderPage(pageNum);
    });
  };

  const handleFileUpload = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onloadend = (e) => {
      removePreviousPDF();
      loadPDF(e.target.result);
    };
  };

  return (
    <div>
      <h3>Upload PDF file</h3>
      <input type="file" onChange={handleFileUpload} />
      <div id="canvas-wrapper" />
      {/* <AnnotationPopup /> */}
    </div>
  );
};

export default App;
