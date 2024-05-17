const books = [];
const RENDER_EVENT = 'render-book';

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        modal.style.display = "none";
        addBook();
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const titleBook = document.getElementById('title').value;
    const writerBook = document.getElementById('writer').value;
    const yearBook = document.getElementById('year').value;
    const getForm = document.getElementById('form');

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, writerBook, yearBook, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    getForm.reset();
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, writer, year, isCompleted) {
    return {
        id,
        title,
        writer,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
})

function makeBook(bookObject, number) {


    const bookNumber = document.createElement('td');
    bookNumber.innerText = number;
    bookNumber.classList.add('col1');


    const textTitle = document.createElement('td');
    textTitle.innerText = bookObject.title;
    textTitle.classList.add('col2');

    const textWriter = document.createElement('td');
    textWriter.innerText = bookObject.writer;
    textWriter.classList.add('col3');

    const textYear = document.createElement('td');
    textYear.innerText = bookObject.year;
    textYear.classList.add('col4');

    const trTable = document.createElement('tr');
    trTable.classList.add('tableRow');
    const container = document.createElement('div');
    container.classList.add('containerList');
    trTable.append(bookNumber, textTitle, textWriter, textYear);

    if (bookObject.isCompleted) {
        const tdButton = document.createElement('td');
        const undoButton = document.createElement('button');
        undoButton.innerHTML = "Tandai belum dibaca";

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id)
        });

        const trashButton = document.createElement('button');
        trashButton.innerHTML = "Hapus";

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id)
        });

        tdButton.append(undoButton, trashButton);
        tdButton.classList.add('col5');
        trTable.append(tdButton);
        container.append(trTable);
        container.setAttribute('id', `book-${bookObject.id}`);
    }


    else {
        const tdButton = document.createElement('td');
        const checkButton = document.createElement('button');
        checkButton.innerHTML = "Tandai sudah dibaca";

        checkButton.addEventListener('click', function () {
            checkButtonFromCompleted(bookObject.id);
        });

        tdButton.append(checkButton);
        tdButton.classList.add('col5');
        trTable.append(tdButton);
        container.append(trTable);
        container.setAttribute('id', `book-${bookObject.id}`);
    }

    return trTable;

}

function addTableHeader(tableId) {

    const getTableId = document.getElementById(tableId);
    const tableRow = document.createElement('tr');

    const headerNo = document.createElement('th');
    headerNo.innerText = 'No.';

    const headerTitle = document.createElement('th');
    headerTitle.innerText = 'Title';

    const headerWriter = document.createElement('th');
    headerWriter.innerText = 'Writer';

    const headerYear = document.createElement('th');
    headerYear.innerText = 'Year';

    tableRow.append(headerNo, headerTitle, headerWriter, headerYear);
    getTableId.append(tableRow);

    return tableRow;

}

document.addEventListener(RENDER_EVENT, function () {
    const completedBooks = findCompletedBooks(books);
    const uncompletedBooks = findUncompletedBooks(books);

    const uncompletedBooksList = document.getElementById('books');
    uncompletedBooksList.innerHTML = '';

    const completedBooksList = document.getElementById('completed-books');
    completedBooksList.innerHTML = '';

    if (completedBooks.length >= 1) {
        const tableRow = document.createElement('tr');
        tableRow.classList.add('tableRow');

        const headerNo = document.createElement('th');
        headerNo.innerText = 'No.';
        headerNo.classList.add('col1');

        const headerTitle = document.createElement('th');
        headerTitle.innerText = 'Title';
        headerTitle.classList.add('col2');

        const headerWriter = document.createElement('th');
        headerWriter.innerText = 'Writer';
        headerWriter.classList.add('col3');

        const headerYear = document.createElement('th');
        headerYear.innerText = 'Year';
        headerYear.classList.add('col4');

        const action = document.createElement('th');
        action.innerText = '';
        action.classList.add('col5');

        tableRow.append(headerNo, headerTitle, headerWriter, headerYear, action);
        completedBooksList.append(tableRow);

    }

    else {
        completedBooksList.innerHTML = 'Tidak Ada buku...';
    }

    if (uncompletedBooks.length >= 1) {

        const tableRow = document.createElement('tr');
        tableRow.classList.add('tableRow');

        const headerNo = document.createElement('th');
        headerNo.innerText = 'No.';
        headerNo.classList.add('col1');

        const headerTitle = document.createElement('th');
        headerTitle.innerText = 'Title';
        headerTitle.classList.add('col2');

        const headerWriter = document.createElement('th');
        headerWriter.innerText = 'Writer';
        headerWriter.classList.add('col3');

        const headerYear = document.createElement('th');
        headerYear.innerText = 'Year';
        headerYear.classList.add('col4');

        const action = document.createElement('th');
        action.innerText = '';
        action.classList.add('col5');

        tableRow.append(headerNo, headerTitle, headerWriter, headerYear, action);
        uncompletedBooksList.append(tableRow);

    }

    else {
        uncompletedBooksList.innerHTML = 'Tidak Ada buku...';
    }

    let number = 0;
    for (const bookItem of books) {
        if (!bookItem.isCompleted) {
            number += 1;
            const bookElement = makeBook(bookItem, number);
            uncompletedBooksList.append(bookElement);
        }
    }

    number = 0;
    for (const bookItem of books) {
        if (bookItem.isCompleted) {
            number += 1;
            const bookElement = makeBook(bookItem, number);
            completedBooksList.append(bookElement);
            completedBooks.push(bookElement);
        }
    }

});

function checkButtonFromCompleted(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == null) {
        return;
    }

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookID) {
    for (const bookItem of books) {
        if (bookItem.id === bookID) {
            return bookItem;
        }
    }

    return null;
}

function removeBookFromCompleted(bookID) {
    const bookTarget = findBookIndex(bookID);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookID) {
    const bookTarget = findBook(bookID);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookID) {
    for (const index in books) {
        if (books[index].id === bookID) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }

    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findCompletedBooks(books) {
    var completedBooks = [];

    for (var i = 0; i < books.length; i++) {
        if (books[i].isCompleted) {
            completedBooks.push(books[i]);
        }
    }

    return completedBooks;
}

function findUncompletedBooks(books) {
    var uncompletedBooks = [];

    for (var i = 0; i < books.length; i++) {
        if (books[i].isCompleted == false) {
            uncompletedBooks.push(books[i]);
        }
    }

    return uncompletedBooks;
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

