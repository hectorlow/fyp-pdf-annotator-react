import React, { useState, useEffect } from 'react';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import './mainPage.scss';

const MainPage = () => {
  const history = useHistory();
  const [files, setFiles] = useState([]);

  const storage = getStorage();
  const listRef = ref(storage, 'pdfs');

  const redirectToAnnotation = () => {
    const params = queryString.parse(window.location.search);
    if (params.filename) {
      const { filename, scrollY } = params;
      history.push('/pdf', { filename, scrollY });
    }
  };

  const getFilesFromFirebase = () => {
    listAll(listRef)
      .then((res) => {
        res.items.forEach((pdf) => {
          files.push(pdf);
        });

        setFiles([...files]);
        redirectToAnnotation();
      })
      .catch((error) => {
        // some error
      });
  };

  useEffect(() => {
    getFilesFromFirebase();
    redirectToAnnotation();
  }, []);

  // const dlRef = ref(storage, 'pdfs/test.pdf');

  // getDownloadURL(dlRef).then((url) => {
  //   console.log(url, 'dl url');
  //   const object = document.getElementById('mypdf');
  //   object.setAttribute('data', url);
  // });

  const handleFileUploadToFirebase = (event) => {
    const file = event.target.files[0];
    const metadata = {
      contentType: 'application/pdf',
    };

    const pdfRef = ref(storage, `pdfs/${file.name}`);
    const uploadTask = uploadBytesResumable(pdfRef, file, metadata);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (
          snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            console.log('default case');
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
            // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
          default:
            // don't know what is the default case
            break;
        }
      },
      () => {
        // upload successful
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
        });
      });

    files.push(event.target.files[0]);
    setFiles([...files]);
  };

  const displayPdf = (filename) => {
    history.push('/pdf', { filename });
  };

  const renderFileButtons = () => (
    <div className="main-page__file-item-container">
      {files.map((file) => (
        <button
          key={file.name}
          type="button"
          className="main-page__file-item"
          onClick={() => displayPdf(file.name)}
        >
          {file.name}
        </button>
      ))}
    </div>
  );

  return (
    <div className="main-page">
      <section className="main-page__left-sidebar">
        <h4>Upload file</h4>

        <input type="file" onChange={handleFileUploadToFirebase} />
      </section>

      <section className="main-page__content">
        <div className="main-page__content__header">Files</div>
        {renderFileButtons()}
        {/* <object id="mypdf" data="https://firebasestorage.googleapis.com/v0/b/fypannotator.appspot.com/o/pdfs%2Ftest.pdf?alt=media&token=b5200b6c-8e75-4a31-9bfa-440c231b3570" type="application/pdf" width="100%" height="100%" /> */}
        {/* <p><b>Example fallback content</b>: This browser does not support PDFs. Please download the PDF to view it: <a href="http://www.example.com/document.pdf">Download PDF</a>.</p> */}
      </section>
    </div>
  );
};

export default MainPage;
