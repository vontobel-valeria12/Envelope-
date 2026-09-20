/* =========================================================
   01. STORAGE
========================================================= */

const STORAGE_KEY = "envelopeDataV1";


/* =========================================================
   02. STATE
========================================================= */

let appData = loadAppData();

let currentFolderId = "root";


/* =========================================================
   03. ELEMENTS
========================================================= */

const breadcrumb =
  document.getElementById("breadcrumb");

const folderGrid =
  document.getElementById("folderGrid");

const cardList =
  document.getElementById("cardList");

const createFolderButton =
  document.getElementById("createFolderButton");

const currentFolderLabel =
  document.getElementById("currentFolderLabel");

const cardTitleInput =
  document.getElementById("cardTitleInput");

const cardFrontInput =
  document.getElementById("cardFrontInput");

const cardBackInput =
  document.getElementById("cardBackInput");

const saveCardButton =
  document.getElementById("saveCardButton");

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

const previewDescription =
  document.getElementById("previewDescription");

const flipCardButton =
  document.getElementById("flipCardButton");


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
  const savedData =
    localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return createInitialData();
  }

  try {
    const parsedData =
      JSON.parse(savedData);

    if (
      !Array.isArray(parsedData.folders) ||
      !Array.isArray(parsedData.cards)
    ) {
      return createInitialData();
    }

    return parsedData;

  } catch {
    return createInitialData();
  }
}


/* =========================================================
   06. SAVE DATA
========================================================= */

function saveAppData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appData)
  );
}


/* =========================================================
   07. ID
========================================================= */

function generateId(prefix) {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
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
   08. CURRENT FOLDER
========================================================= */

function getCurrentFolder() {
  return appData.folders.find(
    folder =>
      folder.id === currentFolderId
  );
}


/* =========================================================
   09. CHILD FOLDERS
========================================================= */

function getChildFolders() {
  return appData.folders.filter(
    folder =>
      folder.parentId === currentFolderId
  );
}


/* =========================================================
   10. CURRENT CARDS
========================================================= */

function getCurrentCards() {
  return appData.cards.filter(
    card =>
      card.folderId === currentFolderId
  );
}


/* =========================================================
   11. CREATE FOLDER
========================================================= */

function createFolder() {
  const folderName =
    prompt("Nome da nova pasta:");

  if (folderName === null) {
    return;
  }

  const cleanFolderName =
    folderName.trim();

  if (!cleanFolderName) {
    alert("Digite um nome para a pasta.");
    return;
  }

  const folderAlreadyExists =
    getChildFolders().some(
      folder =>
        folder.name.toLowerCase() ===
        cleanFolderName.toLowerCase()
    );

  if (folderAlreadyExists) {
    alert("Já existe uma pasta com esse nome.");
    return;
  }

  const newFolder = {
    id: generateId("folder"),

    name: cleanFolderName,

    parentId: currentFolderId
  };

  appData.folders.push(newFolder);

  saveAppData();

  renderApp();
}


/* =========================================================
   12. OPEN FOLDER
========================================================= */

function openFolder(folderId) {
  const folderExists =
    appData.folders.some(
      folder =>
        folder.id === folderId
    );

  if (!folderExists) {
    return;
  }

  currentFolderId = folderId;

  flashcard.classList.remove(
    "is-flipped"
  );

  renderApp();
}


/* =========================================================
   13. SAVE CARD
========================================================= */

function saveCard() {
  const title =
    cardTitleInput.value.trim();

  const front =
    cardFrontInput.value.trim();

  const back =
    cardBackInput.value.trim();


  if (!title) {
    alert(
      "Digite o nome da carta."
    );

    cardTitleInput.focus();

    return;
  }


  if (!front) {
    alert(
      "Digite o conteúdo da frente."
    );

    cardFrontInput.focus();

    return;
  }


  if (!back) {
    alert(
      "Digite o conteúdo do verso."
    );

    cardBackInput.focus();

    return;
  }


  const newCard = {
    id: generateId("card"),

    title,

    front,

    back,

    folderId: currentFolderId,

    createdAt:
      new Date().toISOString()
  };


  appData.cards.push(newCard);

  saveAppData();

  clearCardForm();

  showCard(newCard);

  renderCardList();
}


/* =========================================================
   14. CLEAR FORM
========================================================= */

function clearCardForm() {
  cardTitleInput.value = "";

  cardFrontInput.value = "";

  cardBackInput.value = "";
}


/* =========================================================
   15. SHOW CARD
========================================================= */

function showCard(card) {
  frontCardTitle.textContent =
    card.title;

  backCardTitle.textContent =
    card.title;

  frontCardContent.textContent =
    card.front;

  backCardContent.textContent =
    card.back;

  previewDescription.textContent =
    card.title;

  flashcard.classList.remove(
    "is-flipped"
  );
}


/* =========================================================
   16. FLIP CARD
========================================================= */

function flipCard() {
  flashcard.classList.toggle(
    "is-flipped"
  );
}


/* =========================================================
   17. FOLDER PATH
========================================================= */

function buildFolderPath() {
  const path = [];

  let folder =
    getCurrentFolder();


  while (folder) {
    path.unshift(folder);

    folder =
      appData.folders.find(
        item =>
          item.id === folder.parentId
      );
  }


  return path;
}


/* =========================================================
   18. RENDER BREADCRUMB
========================================================= */

function renderBreadcrumb() {
  breadcrumb.replaceChildren();

  const path =
    buildFolderPath();


  path.forEach(
    (folder, index) => {

      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "breadcrumb-button";

      button.textContent =
        folder.name;


      button.addEventListener(
        "click",
        function () {
          openFolder(folder.id);
        }
      );


      breadcrumb.appendChild(
        button
      );


      if (
        index <
        path.length - 1
      ) {
        const separator =
          document.createElement(
            "span"
          );

        separator.className =
          "breadcrumb-separator";

        separator.textContent =
          "›";

        breadcrumb.appendChild(
          separator
        );
      }

    }
  );
}


/* =========================================================
   19. RENDER CURRENT FOLDER
========================================================= */

function renderCurrentFolder() {
  const folder =
    getCurrentFolder();

  if (!folder) {
    return;
  }

  currentFolderLabel.textContent =
    `📁 ${folder.name}`;
}


/* =========================================================
   20. RENDER FOLDERS
========================================================= */

function renderFolders() {
  folderGrid.replaceChildren();

  const folders =
    getChildFolders();


  if (folders.length === 0) {
    const emptyState =
      document.createElement("p");

    emptyState.className =
      "empty-state";

    emptyState.textContent =
      "Nenhuma pasta aqui.";

    folderGrid.appendChild(
      emptyState
    );

    return;
  }


  folders.forEach(folder => {

    const button =
      document.createElement(
        "button"
      );

    button.type = "button";

    button.className =
      "folder-button";


    const icon =
      document.createElement(
        "span"
      );

    icon.className =
      "folder-icon";

    icon.textContent =
      "📁";


    const name =
      document.createElement(
        "span"
      );

    name.className =
      "folder-name";

    name.textContent =
      folder.name;


    button.append(
      icon,
      name
    );


    button.addEventListener(
      "click",
      function () {
        openFolder(folder.id);
      }
    );


    folderGrid.appendChild(
      button
    );

  });
}


/* =========================================================
   21. RENDER CARD LIST
========================================================= */

function renderCardList() {
  cardList.replaceChildren();

  const cards =
    getCurrentCards();


  if (cards.length === 0) {
    const emptyState =
      document.createElement("p");

    emptyState.className =
      "empty-state";

    emptyState.textContent =
      "Nenhuma carta nesta pasta.";

    cardList.appendChild(
      emptyState
    );

    return;
  }


  cards.forEach(card => {

    const button =
      document.createElement(
        "button"
      );

    button.type = "button";

    button.className =
      "card-list-button";


    const icon =
      document.createElement(
        "span"
      );

    icon.className =
      "card-list-icon";

    icon.textContent =
      "🃏";


    const info =
      document.createElement(
        "span"
      );

    info.className =
      "card-list-info";


    const title =
      document.createElement(
        "span"
      );

    title.className =
      "card-list-title";

    title.textContent =
      card.title;


    const preview =
      document.createElement(
        "span"
      );

    preview.className =
      "card-list-preview";

    preview.textContent =
      card.front;


    info.append(
      title,
      preview
    );


    button.append(
      icon,
      info
    );


    button.addEventListener(
      "click",
      function () {
        showCard(card);
      }
    );


    cardList.appendChild(
      button
    );

  });
}


/* =========================================================
   22. RENDER APP
========================================================= */

function renderApp() {
  renderBreadcrumb();

  renderCurrentFolder();

  renderFolders();

  renderCardList();
}


/* =========================================================
   23. EVENTS
========================================================= */

createFolderButton.addEventListener(
  "click",
  createFolder
);


saveCardButton.addEventListener(
  "click",
  saveCard
);


flipCardButton.addEventListener(
  "click",
  flipCard
);


flashcard.addEventListener(
  "click",
  flipCard
);


flashcard.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      flipCard();
    }

  }
);


/* =========================================================
   24. START
========================================================= */

renderApp();