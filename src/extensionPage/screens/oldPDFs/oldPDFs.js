import React, { useEffect, useState } from 'react';
import {
  ref,
  getStorage,
  listAll,
} from 'firebase/storage';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Table from '../../components/table/table';
import { exportCSV } from '../../../utils/helper';
import './oldPDFs.scss';

const OldPDFs = ({
  setFilepath, setSelectedFile, setPdfPage, setCurrentScreen,
}) => {
  const [files, setFiles] = useState([]);

  const history = useHistory();
  const storage = getStorage();
  const listRef = ref(storage, 'pdfs');

  const getOldFilesFromFirebase = () => {
    listAll(listRef)
      .then((res) => {
        res.items.forEach((pdf) => {
          files.push(pdf);
        });

        setFiles([...files]);
      })
      .catch((error) => {
        // some error
      });
  };

  useEffect(() => {
    getOldFilesFromFirebase();
  }, []);

  const displayPdf = (filename) => {
    setFilepath('pdfs');
    setSelectedFile(filename);
    history.push(`/extensionPage.html?filename=${filename}&rootPath=pdfs`);
    setPdfPage(true);
  };

  const goBack = () => {
    history.push('/extensionPage.html');
    setCurrentScreen('Home');
  };

  const handleExport = (filesToExport) => {
    exportCSV(filesToExport, 'pdfs');
  };

  const renderTable = () => {
    const data = [];
    files.forEach((file) => {
      data.push(file.name);
    });

    return (
      <Table
        data={data}
        displayPdf={displayPdf}
        handleExport={handleExport}
        handleDelete={() => {}}
      />
    );
  };

  const renderMainPageContent = () => (
    <section className="main-page__content">
      <div className="main-page__content__header">
        <IconButton onClick={goBack}>
          <ArrowBackIcon />
        </IconButton>
        Previously Uploaded PDFs
      </div>
      <div className="oldPDFs__margin--24">
        {renderTable()}
      </div>
    </section>
  );

  return (
    renderMainPageContent()
  );
};

export default OldPDFs;
