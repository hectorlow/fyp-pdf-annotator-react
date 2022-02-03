const initChromeStorage = () => {
  // initialise chrome storage
  let highlights = [];
  chrome.storage.sync.get(['fyp_highlights'], (result) => {
    if (
      result.fyp_highlights === undefined
        || !Array.isArray(result.fyp_highlights)
    ) {
      chrome.storage.sync.set({ fyp_highlights: [] }, () => {
        console.log('Initialise highlights to [] in chrome storage');
      });
    }
    highlights = result.fyp_highlights;
    console.log(highlights, 'highlights in sync');
  });

  chrome.storage.sync.get(['fyp_categories'], (result) => {
    if (
      result.fyp_categories === undefined
      || !Array.isArray(result.fyp_categories)
    ) {
      chrome.storage.sync.set({ fyp_categories: [] }, () => {
        console.log('Initialised fyp categories to [] in chrome storage');
      });
    }
  });

  console.log('highlights', highlights);
};

export { initChromeStorage };
