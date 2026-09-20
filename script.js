/* =========================================================
   01. STORAGE
========================================================= */

const STORAGE_KEY = "envelopeDataV1";

const LEGACY_STORAGE_KEY = "envelopeStudyDataV1";


/* =========================================================
   02. STATE
========================================================= */

let appData = loadAppData();

let currentFolderId = "root";

let studyOrder = [];

let studyIndex = 0;

let allCardsVisible = false;


/* =========================================================
   03. ELEMENTS
========================================================= */

const sidebar =
  document.getElementById("sidebar");

const sidebarBackdrop =
  document.getElementById("sidebarBackdrop");

const menuButton =
  document.getElementById("menuButton");

const sidebarCloseButton =
  document.getElementById("sidebarCloseButton");


const homeNavigationButton =
  document.getElementById("homeNavigationButton");

const createFolderButton =
  document.getElementById("createFolderButton");

const createCardButton =
  document.getElementById("createCardButton");


const folderTree =
  document.getElementById("folderTree");

const breadcrumb =
  document.getElementById("breadcrumb");


const homeView =
  document.getElementById("homeView");

const folderView =
  document.getElementById("folderView");

const homeFolderGrid =
  document.getElementById("homeFolderGrid");

const createHomeFolderButton =
  document.getElementById("createHomeFolderButton");


const folderTitle =
  document.getElementById("folderTitle");

const folderSummary =
  document.getElementById("folderSummary");

const subfolderGrid =
  document.getElementById("subfolderGrid");

const createSubfolderButton =
  document.getElementById("createSubfolderButton");

const createFolderCardButton =
  document.getElementById("createFolderCardButton");


const shuffleCardsButton =
  document.getElementById("shuffleCardsButton");

const showAllCardsButton =
  document.getElementById("showAllCardsButton");

const createFirstCardButton =
  document.getElementById("createFirstCardButton");


const studyEmptyState =
  document.getElementById("studyEmptyState");

const studyDeck =
  document.getElementById("studyDeck");

const studyCounter =
  document.getElementById("studyCounter");


const flashcard =
  document.getElementById("flashcard");

const frontCardTitle =
  document.getElementById("frontCardTitle");

const frontCardContent =
  document.getElementById("frontCardContent");

const backCardTitle =
  document.getElementById("backCardTitle");

const backCardContent =
  document.getElementById("backCardContent");


const previousCardButton =
  document.getElementById("previousCardButton");

const flipCardButton =
  document.getElementById("flipCardButton");

const nextCardButton =
  document.getElementById("nextCardButton");


const allCardsSection =
  document.getElementById("allCardsSection");

const allCardsGrid =
  document.getElementById("allCardsGrid");


const folderDialog =
  document.getElementById("folderDialog");

const folderForm =
  document.getElementById("folderForm");

const folderDialogTitle =
  document.getElementById("folderDialogTitle");

const folderNameInput =
  document.getElementById("folderNameInput");

const cancelFolderButton =
  document.getElementById("cancelFolderButton");


const cardDialog =
  document.getElementById("cardDialog");

const cardForm =
  document.getElementById("cardForm");

const cardTitleInput =
  document.getElementById("cardTitleInput");

const cardFrontInput =
  document.getElementById("cardFrontInput");

const cardBackInput =
  document.getElementById("cardBackInput");

const cancelCardButton =
  document.getElementById("cancelCardButton");


/* =========================================================
   04. INITIAL DATA
========================================================= */

function createInitialData() {
  return {
    folders: [
      {
        id: "root",
        name: "Minhas cartas",
        parentId: null
      }
    ],

    cards: []
  };
}


/* =========================================================
   05. LOAD DATA
========================================================= */

function loadAppData() {
  const currentData =
    localStorage.getItem(STORAGE_KEY);

  const legacyData =
    localStorage.getItem(LEGACY_STORAGE_KEY);

  const storedData =
    currentData || legacyData;


  if (!storedData) {
    return createInitialData();
  }


  try {
    const parsedData =
      JSON.parse(storedData);

    const normalizedData =
      normalizeAppData(parsedData);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(normalizedData)
    );

    return normalizedData;

  } catch {
    return createInitialData();
  }
}


/* =========================================================
   06. NORMALIZE DATA
========================================================= */

function normalizeAppData(data) {
  const folders =
    Array.isArray(data.folders)
      ? data.folders
      : [];

  const cards =
    Array.isArray(data.cards)
      ? data.cards
      : [];


  const rootExists =
    folders.some(
      folder =>
        folder.id === "root"
    );


  const normalizedFolders =
    folders.map(folder => ({
      id:
        String(folder.id),

      name:
        String(
          folder.name ||
          "Pasta"
        ),

      parentId:
        folder.parentId === null
          ? null
          : String(folder.parentId)
    }));


  if (!rootExists) {
    normalizedFolders.unshift({
      id: "root",
      name: "Minhas cartas",
      parentId: null
    });
  }


  const normalizedCards =
    cards.map(card => ({
      id:
        String(
          card.id ||
          generateId("card")
        ),

      title:
        String(
          card.title ||
          card.name ||
          "Sem título"
        ),

      front:
        String(
          card.front ||
          card.german ||
          ""
        ),

      back:
        String(
          card.back ||
          card.portuguese ||
          ""
        ),

      folderId:
        String(
          card.folderId ||
          "root"
        ),

      createdAt:
        card.createdAt ||
        new Date().toISOString()
    }));


  return {
    folders:
      normalizedFolders,

    cards:
      normalizedCards
  };
}


/* =========================================================
   07. SAVE DATA
========================================================= */

function saveAppData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appData)
  );
}


/* =========================================================
   08. GENERATE ID
========================================================= */

function generateId(prefix) {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return (
      prefix +
      "-" +
      crypto.randomUUID()
    );
  }


  return (
    prefix +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(16)
      .slice(2)
  );
}


/* =========================================================
   09. DATA HELPERS
========================================================= */

function getFolder(folderId) {
  return appData.folders.find(
    folder =>
      folder.id === folderId
  );
}


function getCurrentFolder() {
  return getFolder(
    currentFolderId
  );
}


function getChildFolders(folderId) {
  return appData.folders.filter(
    folder =>
      folder.parentId === folderId
  );
}


function getCardsInFolder(folderId) {
  return appData.cards.filter(
    card =>
      card.folderId === folderId
  );
}


/* =========================================================
   10. NAVIGATE
========================================================= */

function navigateToHome() {
  currentFolderId = "root";

  studyOrder = [];

  studyIndex = 0;

  allCardsVisible = false;

  closeSidebar();

  renderApp();
}


function navigateToFolder(folderId) {
  const folder =
    getFolder(folderId);


  if (!folder) {
    return;
  }


  currentFolderId =
    folderId;

  allCardsVisible =
    false;

  resetStudyDeck();

  closeSidebar();

  renderApp();
}


/* =========================================================
   11. FOLDER PATH
========================================================= */

function buildFolderPath() {
  const path = [];

  let folder =
    getCurrentFolder();


  while (folder) {
    path.unshift(folder);

    folder =
      folder.parentId
        ? getFolder(folder.parentId)
        : null;
  }


  return path;
}


/* =========================================================
   12. OPEN FOLDER DIALOG
========================================================= */

function openFolderDialog() {
  const currentFolder =
    getCurrentFolder();


  if (
    currentFolderId === "root"
  ) {
    folderDialogTitle.textContent =
      "Nova pasta";
  } else {
    folderDialogTitle.textContent =
      `Nova subpasta em ${currentFolder.name}`;
  }


  folderForm.reset();

  folderDialog.showModal();

  window.setTimeout(
    () =>
      folderNameInput.focus(),
    50
  );
}


/* =========================================================
   13. CREATE FOLDER
========================================================= */

function createFolder(folderName) {
  const cleanName =
    folderName.trim();


  if (!cleanName) {
    return false;
  }


  const duplicateFolder =
    getChildFolders(
      currentFolderId
    ).some(
      folder =>
        folder.name
          .toLowerCase() ===
        cleanName
          .toLowerCase()
    );


  if (duplicateFolder) {
    alert(
      "Já existe uma pasta com esse nome aqui."
    );

    return false;
  }


  appData.folders.push({
    id:
      generateId("folder"),

    name:
      cleanName,

    parentId:
      currentFolderId
  });


  saveAppData();

  renderApp();

  return true;
}


/* =========================================================
   14. OPEN CARD DIALOG
========================================================= */

function openCardDialog() {
  if (
    currentFolderId === "root"
  ) {
    return;
  }


  cardForm.reset();

  cardDialog.showModal();

  window.setTimeout(
    () =>
      cardTitleInput.focus(),
    50
  );
}


/* =========================================================
   15. CREATE CARD
========================================================= */

function createCard(
  title,
  front,
  back
) {
  if (
    currentFolderId === "root"
  ) {
    return;
  }


  const newCard = {
    id:
      generateId("card"),

    title:
      title.trim(),

    front:
      front.trim(),

    back:
      back.trim(),

    folderId:
      currentFolderId,

    createdAt:
      new Date().toISOString()
  };


  appData.cards.push(
    newCard
  );


  saveAppData();


  studyOrder.push(
    newCard.id
  );

  studyIndex =
    studyOrder.length - 1;


  allCardsVisible =
    false;


  renderApp();
}


/* =========================================================
   16. RESET STUDY DECK
========================================================= */

function resetStudyDeck() {
  const cards =
    getCardsInFolder(
      currentFolderId
    );


  studyOrder =
    cards.map(
      card =>
        card.id
    );


  studyIndex = 0;

  resetFlashcardSide();
}


/* =========================================================
   17. GET CURRENT STUDY CARD
========================================================= */

function getCurrentStudyCard() {
  const cardId =
    studyOrder[
      studyIndex
    ];


  if (!cardId) {
    return null;
  }


  return appData.cards.find(
    card =>
      card.id === cardId
  );
}


/* =========================================================
   18. SELECT STUDY CARD
========================================================= */

function selectStudyCard(cardId) {
  let index =
    studyOrder.indexOf(
      cardId
    );


  if (index === -1) {
    studyOrder.push(
      cardId
    );

    index =
      studyOrder.length - 1;
  }


  studyIndex =
    index;


  allCardsVisible =
    false;


  renderFolderView();


  window.setTimeout(
    () => {
      document
        .querySelector(
          ".study-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    },
    50
  );
}


/* =========================================================
   19. SHUFFLE STUDY DECK
========================================================= */

function shuffleStudyDeck() {
  const cards =
    getCardsInFolder(
      currentFolderId
    );


  studyOrder =
    cards.map(
      card =>
        card.id
    );


  for (
    let index =
      studyOrder.length - 1;

    index > 0;

    index--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
        (index + 1)
      );


    [
      studyOrder[index],
      studyOrder[randomIndex]
    ] = [
      studyOrder[randomIndex],
      studyOrder[index]
    ];
  }


  studyIndex = 0;

  resetFlashcardSide();

  renderStudyCard();
}


/* =========================================================
   20. PREVIOUS CARD
========================================================= */

function showPreviousCard() {
  if (
    studyIndex <= 0
  ) {
    return;
  }


  studyIndex--;

  resetFlashcardSide();

  renderStudyCard();
}


/* =========================================================
   21. NEXT CARD
========================================================= */

function showNextCard() {
  if (
    studyIndex >=
    studyOrder.length - 1
  ) {
    return;
  }


  studyIndex++;

  resetFlashcardSide();

  renderStudyCard();
}


/* =========================================================
   22. FLIP CARD
========================================================= */

function flipCard() {
  if (
    studyOrder.length === 0
  ) {
    return;
  }


  flashcard.classList.toggle(
    "is-flipped"
  );
}


function resetFlashcardSide() {
  flashcard.classList.remove(
    "is-flipped"
  );
}


/* =========================================================
   23. TOGGLE ALL CARDS
========================================================= */

function toggleAllCards() {
  allCardsVisible =
    !allCardsVisible;


  renderAllCards();
  renderStudyActions();


  if (allCardsVisible) {
    window.setTimeout(
      () => {
        allCardsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      },
      50
    );
  }
}


/* =========================================================
   24. RENDER APP
========================================================= */

function renderApp() {
  renderSidebar();
  renderBreadcrumb();
  renderNavigationState();


  if (
    currentFolderId === "root"
  ) {
    renderHomeView();

    return;
  }


  renderFolderView();
}


/* =========================================================
   25. RENDER NAVIGATION STATE
========================================================= */

function renderNavigationState() {
  const isHome =
    currentFolderId === "root";


  homeNavigationButton.classList.toggle(
    "is-active",
    isHome
  );


  createCardButton.hidden =
    isHome;


  homeView.hidden =
    !isHome;

  folderView.hidden =
    isHome;
}


/* =========================================================
   26. RENDER SIDEBAR
========================================================= */

function renderSidebar() {
  folderTree.replaceChildren();


  const topLevelFolders =
    getChildFolders("root");


  if (
    topLevelFolders.length === 0
  ) {
    const emptyMessage =
      document.createElement(
        "p"
      );

    emptyMessage.className =
      "folder-tree-empty";

    emptyMessage.textContent =
      "Nenhuma pasta criada.";

    folderTree.appendChild(
      emptyMessage
    );

    return;
  }


  topLevelFolders.forEach(
    folder => {
      folderTree.appendChild(
        createFolderTreeNode(
          folder
        )
      );
    }
  );
}


/* =========================================================
   27. CREATE FOLDER TREE NODE
========================================================= */

function createFolderTreeNode(
  folder
) {
  const node =
    document.createElement(
      "div"
    );

  node.className =
    "folder-tree-node";


  const button =
    document.createElement(
      "button"
    );

  button.type =
    "button";

  button.className =
    "folder-tree-button";


  if (
    folder.id ===
    currentFolderId
  ) {
    button.classList.add(
      "is-active"
    );
  }


  const icon =
    document.createElement(
      "span"
    );

  icon.textContent =
    "📁";


  const name =
    document.createElement(
      "span"
    );

  name.className =
    "folder-tree-name";

  name.textContent =
    folder.name;


  const cardCount =
    document.createElement(
      "span"
    );

  cardCount.className =
    "folder-tree-count";

  cardCount.textContent =
    getCardsInFolder(
      folder.id
    ).length;


  button.append(
    icon,
    name,
    cardCount
  );


  button.addEventListener(
    "click",
    () => {
      navigateToFolder(
        folder.id
      );
    }
  );


  node.appendChild(
    button
  );


  const children =
    getChildFolders(
      folder.id
    );


  if (
    children.length > 0
  ) {
    const childrenContainer =
      document.createElement(
        "div"
      );

    childrenContainer.className =
      "folder-tree-children";


    children.forEach(
      childFolder => {
        childrenContainer.appendChild(
          createFolderTreeNode(
            childFolder
          )
        );
      }
    );


    node.appendChild(
      childrenContainer
    );
  }


  return node;
}


/* =========================================================
   28. RENDER BREADCRUMB
========================================================= */

function renderBreadcrumb() {
  breadcrumb.replaceChildren();


  const homeButton =
    document.createElement(
      "button"
    );

  homeButton.type =
    "button";

  homeButton.className =
    "breadcrumb-button";

  homeButton.textContent =
    "Home";


  homeButton.addEventListener(
    "click",
    navigateToHome
  );


  breadcrumb.appendChild(
    homeButton
  );


  if (
    currentFolderId === "root"
  ) {
    return;
  }


  const path =
    buildFolderPath()
      .filter(
        folder =>
          folder.id !== "root"
      );


  path.forEach(
    folder => {
      const separator =
        document.createElement(
          "span"
        );

      separator.className =
        "breadcrumb-separator";

      separator.textContent =
        "›";


      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "breadcrumb-button";

      button.textContent =
        folder.name;


      button.addEventListener(
        "click",
        () => {
          navigateToFolder(
            folder.id
          );
        }
      );


      breadcrumb.append(
        separator,
        button
      );
    }
  );
}


/* =========================================================
   29. RENDER HOME
========================================================= */

function renderHomeView() {
  homeView.hidden =
    false;

  folderView.hidden =
    true;


  renderFolderCards(
    homeFolderGrid,
    getChildFolders("root")
  );
}


/* =========================================================
   30. RENDER FOLDER VIEW
========================================================= */

function renderFolderView() {
  homeView.hidden =
    true;

  folderView.hidden =
    false;


  const folder =
    getCurrentFolder();


  if (!folder) {
    navigateToHome();

    return;
  }


  const subfolders =
    getChildFolders(
      folder.id
    );

  const cards =
    getCardsInFolder(
      folder.id
    );


  folderTitle.textContent =
    folder.name;


  folderSummary.textContent =
    `${cards.length} ${
      cards.length === 1
        ? "carta"
        : "cartas"
    } · ${subfolders.length} ${
      subfolders.length === 1
        ? "subpasta"
        : "subpastas"
    }`;


  renderFolderCards(
    subfolderGrid,
    subfolders
  );


  synchronizeStudyOrder();

  renderStudyCard();

  renderStudyActions();

  renderAllCards();
}


/* =========================================================
   31. SYNCHRONIZE STUDY ORDER
========================================================= */

function synchronizeStudyOrder() {
  const cards =
    getCardsInFolder(
      currentFolderId
    );


  const cardIds =
    cards.map(
      card =>
        card.id
    );


  studyOrder =
    studyOrder.filter(
      cardId =>
        cardIds.includes(cardId)
    );


  cardIds.forEach(
    cardId => {
      if (
        !studyOrder.includes(
          cardId
        )
      ) {
        studyOrder.push(
          cardId
        );
      }
    }
  );


  if (
    studyIndex >
    studyOrder.length - 1
  ) {
    studyIndex =
      Math.max(
        0,
        studyOrder.length - 1
      );
  }
}


/* =========================================================
   32. RENDER FOLDER CARDS
========================================================= */

function renderFolderCards(
  container,
  folders
) {
  container.replaceChildren();


  if (
    folders.length === 0
  ) {
    const emptyState =
      document.createElement(
        "div"
      );

    emptyState.className =
      "folder-grid-empty";

    emptyState.textContent =
      "Nenhuma pasta aqui.";

    container.appendChild(
      emptyState
    );

    return;
  }


  folders.forEach(
    folder => {
      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "folder-card";


      const icon =
        document.createElement(
          "span"
        );

      icon.className =
        "folder-card-icon";

      icon.textContent =
        "📁";


      const title =
        document.createElement(
          "span"
        );

      title.className =
        "folder-card-title";

      title.textContent =
        folder.name;


      const cardCount =
        getCardsInFolder(
          folder.id
        ).length;

      const childCount =
        getChildFolders(
          folder.id
        ).length;


      const meta =
        document.createElement(
          "span"
        );

      meta.className =
        "folder-card-meta";

      meta.textContent =
        `${cardCount} ${
          cardCount === 1
            ? "carta"
            : "cartas"
        } · ${childCount} ${
          childCount === 1
            ? "subpasta"
            : "subpastas"
        }`;


      button.append(
        icon,
        title,
        meta
      );


      button.addEventListener(
        "click",
        () => {
          navigateToFolder(
            folder.id
          );
        }
      );


      container.appendChild(
        button
      );
    }
  );
}


/* =========================================================
   33. RENDER STUDY CARD
========================================================= */

function renderStudyCard() {
  const cards =
    getCardsInFolder(
      currentFolderId
    );


  const hasCards =
    cards.length > 0;


  studyEmptyState.hidden =
    hasCards;

  studyDeck.hidden =
    !hasCards;


  if (!hasCards) {
    resetFlashcardSide();

    return;
  }


  const currentCard =
    getCurrentStudyCard();


  if (!currentCard) {
    resetStudyDeck();

    return renderStudyCard();
  }


  frontCardTitle.textContent =
    currentCard.title;

  backCardTitle.textContent =
    currentCard.title;

  frontCardContent.textContent =
    currentCard.front;

  backCardContent.textContent =
    currentCard.back;


  studyCounter.textContent =
    `${studyIndex + 1} / ${studyOrder.length}`;


  previousCardButton.disabled =
    studyIndex === 0;


  nextCardButton.disabled =
    studyIndex ===
    studyOrder.length - 1;


  resetFlashcardSide();
}


/* =========================================================
   34. RENDER STUDY ACTIONS
========================================================= */

function renderStudyActions() {
  const cards =
    getCardsInFolder(
      currentFolderId
    );


  shuffleCardsButton.disabled =
    cards.length < 2;


  showAllCardsButton.disabled =
    cards.length === 0;


  showAllCardsButton.textContent =
    allCardsVisible
      ? "↩ Voltar ao estudo"
      : "🗂 Todas as cartas";
}


/* =========================================================
   35. RENDER ALL CARDS
========================================================= */

function renderAllCards() {
  allCardsSection.hidden =
    !allCardsVisible;


  allCardsGrid.replaceChildren();


  if (!allCardsVisible) {
    return;
  }


  const cards =
    getCardsInFolder(
      currentFolderId
    );


  cards.forEach(
    card => {
      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "saved-card-button";


      const icon =
        document.createElement(
          "span"
        );

      icon.className =
        "saved-card-icon";

      icon.textContent =
        "🃏";


      const title =
        document.createElement(
          "span"
        );

      title.className =
        "saved-card-title";

      title.textContent =
        card.title;


      const preview =
        document.createElement(
          "span"
        );

      preview.className =
        "saved-card-preview";

      preview.textContent =
        card.front;


      button.append(
        icon,
        title,
        preview
      );


      button.addEventListener(
        "click",
        () => {
          selectStudyCard(
            card.id
          );
        }
      );


      allCardsGrid.appendChild(
        button
      );
    }
  );
}


/* =========================================================
   36. SIDEBAR
========================================================= */

function openSidebar() {
  document.body.classList.add(
    "sidebar-open"
  );
}


function closeSidebar() {
  document.body.classList.remove(
    "sidebar-open"
  );
}


/* =========================================================
   37. FOLDER FORM EVENTS
========================================================= */

folderForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();


    const created =
      createFolder(
        folderNameInput.value
      );


    if (created) {
      folderDialog.close();
    }
  }
);


cancelFolderButton.addEventListener(
  "click",
  () => {
    folderDialog.close();
  }
);


/* =========================================================
   38. CARD FORM EVENTS
========================================================= */

cardForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();


    const title =
      cardTitleInput.value.trim();

    const front =
      cardFrontInput.value.trim();

    const back =
      cardBackInput.value.trim();


    if (
      !title ||
      !front ||
      !back
    ) {
      return;
    }


    createCard(
      title,
      front,
      back
    );


    cardDialog.close();
  }
);


cancelCardButton.addEventListener(
  "click",
  () => {
    cardDialog.close();
  }
);


/* =========================================================
   39. NAVIGATION EVENTS
========================================================= */

homeNavigationButton.addEventListener(
  "click",
  navigateToHome
);


createFolderButton.addEventListener(
  "click",
  openFolderDialog
);


createHomeFolderButton.addEventListener(
  "click",
  openFolderDialog
);


createSubfolderButton.addEventListener(
  "click",
  openFolderDialog
);


createCardButton.addEventListener(
  "click",
  openCardDialog
);


createFolderCardButton.addEventListener(
  "click",
  openCardDialog
);


createFirstCardButton.addEventListener(
  "click",
  openCardDialog
);


/* =========================================================
   40. STUDY EVENTS
========================================================= */

flashcard.addEventListener(
  "click",
  flipCard
);


flipCardButton.addEventListener(
  "click",
  flipCard
);


previousCardButton.addEventListener(
  "click",
  showPreviousCard
);


nextCardButton.addEventListener(
  "click",
  showNextCard
);


shuffleCardsButton.addEventListener(
  "click",
  shuffleStudyDeck
);


showAllCardsButton.addEventListener(
  "click",
  toggleAllCards
);


/* =========================================================
   41. FLASHCARD KEYBOARD
========================================================= */

flashcard.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      flipCard();

      return;
    }


    if (
      event.key === "ArrowLeft"
    ) {
      showPreviousCard();

      return;
    }


    if (
      event.key === "ArrowRight"
    ) {
      showNextCard();
    }

  }
);


/* =========================================================
   42. MOBILE MENU EVENTS
========================================================= */

menuButton.addEventListener(
  "click",
  openSidebar
);


sidebarCloseButton.addEventListener(
  "click",
  closeSidebar
);


sidebarBackdrop.addEventListener(
  "click",
  closeSidebar
);


/* =========================================================
   43. START
========================================================= */

renderApp();