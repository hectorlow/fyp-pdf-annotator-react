import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { v4 as uuidV4 } from 'uuid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import queryString from 'query-string';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';

import RenderedPdf from '../screens/renderedPdf/renderedPdf';
import OldPDFs from '../screens/oldPDFs/oldPDFs';
import MyFolder from '../screens/myFolder/myFolder';
import './mainPage.scss';

const MainPage = () => {
  const history = useHistory();
  const storage = getStorage();
  const [currentScreen, setCurrentScreen] = useState('');
  const [pdfPage, setPdfPage] = useState(false);
  const [filepath, setFilepath] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [scroll, setScroll] = useState(0);

  const backToHome = () => {
    history.push('/extensionPage.html');
    setPdfPage(false);
    setSelectedFile('');
    setScroll(0);
  };

  const generateUserId = () => {
    let userId = window.localStorage.getItem('user_id');

    // uuid is a string of length 36 characters
    if (typeof userId !== 'string' || userId.length < 30) {
      userId = uuidV4();
      window.localStorage.setItem('user_id', userId);

      // create user folder in firebase
      const userFolderRef = ref(
        storage, `users/${userId}/myFolder/user_id.txt`,
      );

      const file = new Blob([userId], {
        type: 'text/plain',
      });

      uploadBytesResumable(userFolderRef, file).then(() => {
        // user folder created
      });
    }
  };

  const redirectOrRefreshToScreen = () => {
    const params = queryString.parse(window.location.search);
    const {
      folder,
      filename,
      scrollY,
      rootPath,
    } = params;

    if (folder) {
      if (['Old PDFs', 'My Folder'].includes(folder)) {
        setCurrentScreen(folder);
        return;
      }
    }

    if (filename) {
      setSelectedFile(filename);
      if (scrollY) {
        setScroll(scrollY);
      }

      if (rootPath !== undefined) {
        setFilepath(rootPath);
      } else {
        const userId = window.localStorage.getItem('user_id');
        setFilepath(`users/${userId}/myFolder`);
      }

      setPdfPage(true);
    }
  };

  useEffect(() => {
    generateUserId();
    redirectOrRefreshToScreen();
  }, []);

  const renderSideBar = () => (
    <section className="main-page__left-sidebar">
      <h4>PDF annotator v1.1.0</h4>
      <Typography variant="body2" sx={{ mt: 1 }}>
        <Box sx={{ fontWeight: 'bold' }}>New changes in v1.1.0</Box>
        <li>
          Files under &apos;Previously Uploaded PDFs&apos;
          will be removed after 31st March 2022.
        </li>
        <li>
          Now able to delete uploaded files in &apos;My Folder&apos;.
        </li>
        <li>
          Now able to export highlights of multiple files in one csv file using
          {' '}
          <CalendarViewMonthIcon sx={{ margin: 0 }} />
          {' '}
          icon.
        </li>
        <li>
          Select checkbox(s) to delete or export highlight of file(s).
        </li>
      </Typography>

    </section>
  );

  const renderFolders = () => {
    const screens = ['Previously Uploaded PDFs', 'My Folder'];

    const handleSelectFolder = (name) => {
      history.push(`/extensionPage.html?folder=${name}`);
      setCurrentScreen(name);
    };

    return (
      <section className="main-page__content">
        <div className="main-page__content__header">Folders</div>

        <div className="main-page__file-item-container">
          {screens.map((screenName) => (
            <button
              type="button"
              className="main-page__file-item"
              onClick={() => handleSelectFolder(screenName)}
            >
              {screenName}
            </button>
          ))}
        </div>
      </section>
    );
  };

  const renderScreen = (screen) => {
    switch (screen) {
      case 'Folders':
        return renderFolders();
      case 'Previously Uploaded PDFs':
        return (
          <OldPDFs
            setPdfPage={setPdfPage}
            setFilepath={setFilepath}
            setSelectedFile={setSelectedFile}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'My Folder':
        return (
          <MyFolder
            setPdfPage={setPdfPage}
            setFilepath={setFilepath}
            setSelectedFile={setSelectedFile}
            setCurrentScreen={setCurrentScreen}
          />
        );
      default:
        return renderFolders();
    }
  };

  return (
    <div>
      {(pdfPage) ? (
        <RenderedPdf
          filepath={filepath}
          filename={selectedFile}
          scrollY={scroll}
          backToHome={() => backToHome()}
        />
      ) : (
        <div className="main-page">
          {renderSideBar()}
          {renderScreen(currentScreen)}
        </div>
      )}
    </div>
  );
};

export default MainPage;
