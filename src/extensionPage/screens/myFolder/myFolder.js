import React, { useEffect, useState } from 'react';
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Table from '../../components/table/table';
import './myFolder.scss';
import { exportCSV } from '../../../utils/helper';

const MyFolder = ({
  setFilepath, setSelectedFile, setPdfPage, setCurrentScreen,
}) => {
  const history = useHistory();
  const storage = getStorage();
  const [refetchFiles, setRefetchFiles] = useState(false);
  const [files, setFiles] = useState([]);
  const userId = window.localStorage.getItem('user_id');
  const filepath = `users/${userId}/myFolder`;
  const listRef = ref(storage, filepath);

  const getFilesFromFirebase = () => {
    const retrievedFiles = [];
    listAll(listRef)
      .then((res) => {
        res.items.forEach((item) => {
          if (item.name !== 'user_id.txt') {
            retrievedFiles.push(item);
          };
        });

        setFiles(retrievedFiles);
      })
      .catch((error) => {
        // some error
      });
  };

  useEffect(() => {
    getFilesFromFirebase();
  }, [refetchFiles]);

  const handleFileUploadToFirebase = (event) => {
    const file = event.target.files[0];

    // only allow uploading of pdf files
    const metadata = {
      contentType: 'application/pdf',
    };

    const pdfRef = ref(storage, `users/${userId}/myFolder/${file.name}`);
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

        setRefetchFiles(!refetchFiles);
      });
  };

  const displayPdf = (filename) => {
    setFilepath(filepath);
    setSelectedFile(filename);
    history.push(`/extensionPage.html?filename=${filename}`);
    setPdfPage(true);
  };

  const handleDelete = (fileToDelete) => {
    fileToDelete.forEach((filename) => {
      const fileRef = ref(storage, `${filepath}/${filename}`);
      deleteObject(fileRef)
        .then(() => {
          console.log(`File ${filename} deleted successfully`);

          setRefetchFiles(!refetchFiles);
          // deselect everything
        }).catch((error) => {
          // catch error
        });
    });
  };

  const handleExport = (filesToExport) => {
    exportCSV(filesToExport);
  };

  const renderTable = () => {
    let data = [];
    if (files.length > 0) {
      data = files.map((file) => file.name);
    }

    return (
      <Table
        data={data}
        displayPdf={displayPdf}
        handleDelete={handleDelete}
        handleExport={handleExport}
      />
    );
  };

  const goBack = () => {
    history.push('/extensionPage.html');
    setCurrentScreen('Home');
  };

  const renderMainPageContent = () => (
    <section className="main-page__content">
      <div className="main-page__content__header">
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        My Folder Files
      </div>
      <div className="myFolder__margin--24">
        {renderTable()}
      </div>

      <div className="myFolder__margin--24">
        <input type="file" onChange={handleFileUploadToFirebase} />
      </div>
    </section>
  );

  return (
    renderMainPageContent()
  );
};

/* <object id="mypdf" data="https://firebasestorage.googleapis.com/v0/b/fypannotator.appspot.com/o/pdfs%2Ftest.pdf?alt=media&token=b5200b6c-8e75-4a31-9bfa-440c231b3570" type="application/pdf" width="100%" height="100%" /> */
/* <p><b>Example fallback content</b>: This browser does not support PDFs. Please download the PDF to view it: <a href="http://www.example.com/document.pdf">Download PDF</a>.</p> */

export default MyFolder;
