const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    const modal = document.getElementById('modal');
    modalConfig();
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        displayAlert();
        modal.style.display = 'none';
    })

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function displayAlert() {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';

    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('search');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    })
});

function searchBook() {
    const inputRaw = document.getElementById('searchTitle');
    const input = inputRaw.value.trim().toLowerCase();
    const uncompletedBooksList = document.getElementById('books');
    uncompletedBooksList.innerHTML = '';

    const completedBooksList = document.getElementById('completed-books');
    completedBooksList.innerHTML = '';

    const foundBook = books.filter(searchBook => searchBook.title.toLowerCase().includes(input));

    let numberCompleted = 0;
    let numberUncompleted = 0;
    if (!input) {
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    else if (foundBook.length == 0) {
        uncompletedBooksList.innerHTML = 'Tidak Ada buku...';
        completedBooksList.innerHTML = 'Tidak Ada buku...';
    }

    else if (foundBook.length > 0) {
        foundBook.forEach(book => {
            if (!book.isComplete) {
                numberUncompleted += 1;
                if (numberUncompleted == 1) {
                    const tableRow = document.createElement('tr');
                    tableRow.classList.add('tableRow');

                    const headerNo = document.createElement('th');
                    headerNo.innerText = 'No.';
                    headerNo.classList.add('col1');

                    const headerTitle = document.createElement('th');
                    headerTitle.innerText = 'Title';
                    headerTitle.classList.add('col2');

                    const headerauthor = document.createElement('th');
                    headerauthor.innerText = 'Author';
                    headerauthor.classList.add('col3');

                    const headerYear = document.createElement('th');
                    headerYear.innerText = 'Year';
                    headerYear.classList.add('col4');

                    const action = document.createElement('th');
                    action.innerText = '';
                    action.classList.add('col5');

                    tableRow.append(headerNo, headerTitle, headerauthor, headerYear, action);
                    uncompletedBooksList.append(tableRow);
                }

                const bookElement = makeBook(book, numberUncompleted);
                uncompletedBooksList.append(bookElement);
            }


            else if (book.isComplete) {
                numberCompleted += 1;
                if (numberCompleted == 1) {
                    const tableRow = document.createElement('tr');
                    tableRow.classList.add('tableRow');

                    const headerNo = document.createElement('th');
                    headerNo.innerText = 'No.';
                    headerNo.classList.add('col1');

                    const headerTitle = document.createElement('th');
                    headerTitle.innerText = 'Title';
                    headerTitle.classList.add('col2');

                    const headerauthor = document.createElement('th');
                    headerauthor.innerText = 'Author';
                    headerauthor.classList.add('col3');

                    const headerYear = document.createElement('th');
                    headerYear.innerText = 'Year';
                    headerYear.classList.add('col4');

                    const action = document.createElement('th');
                    action.innerText = '';
                    action.classList.add('col5');

                    tableRow.append(headerNo, headerTitle, headerauthor, headerYear, action);
                    completedBooksList.append(tableRow);
                }

                const bookElement = makeBook(book, numberCompleted);
                completedBooksList.append(bookElement);
            }
        })

        if (numberUncompleted == 0) {
            uncompletedBooksList.innerHTML = 'Tidak Ada buku...';
        }

        else if (numberCompleted == 0) {
            completedBooksList.innerHTML = 'Tidak Ada buku...';
        }
    }
}

function addBook() {
    const titleBook = document.getElementById('title').value;
    const authorBook = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const yearBook = parseInt(year, 10);
    const statusBook = document.getElementById('status');
    const status = statusBook.checked;
    const getForm = document.getElementById('form');

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, status);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    getForm.reset();
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function makeBook(bookObject, number) {
    const bookNumber = document.createElement('td');
    bookNumber.innerText = number;
    bookNumber.classList.add('col1');


    const textTitle = document.createElement('td');
    textTitle.innerText = bookObject.title;
    textTitle.classList.add('col2');

    const textauthor = document.createElement('td');
    textauthor.innerText = bookObject.author;
    textauthor.classList.add('col3');

    const textYear = document.createElement('td');
    textYear.innerText = bookObject.year;
    textYear.classList.add('col4');

    const trTable = document.createElement('tr');
    trTable.setAttribute('id', bookObject.id);
    trTable.classList.add('tableRow');
    const container = document.createElement('div');
    container.classList.add('containerList');
    trTable.append(bookNumber, textTitle, textauthor, textYear);

    if (bookObject.isComplete) {
        const tdButton = document.createElement('td');
        const undoButton = document.createElement('button');
        undoButton.innerHTML = "Tandai belum dibaca";
        undoButton.classList.add('button');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id)
        });

        const trashButton = document.createElement('button');
        trashButton.innerHTML = "Hapus";
        trashButton.classList.add('button');

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
        checkButton.classList.add('button');

        const trashButton = document.createElement('button');
        trashButton.innerHTML = "Hapus";
        trashButton.classList.add('button');

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id)
        });

        checkButton.addEventListener('click', function () {
            checkButtonFromCompleted(bookObject.id);
        });

        tdButton.append(checkButton, trashButton);
        tdButton.classList.add('col5');
        trTable.append(tdButton);
        container.append(trTable);
        container.setAttribute('id', `book-${bookObject.id}`);
    }

    return trTable;
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

        const headerauthor = document.createElement('th');
        headerauthor.innerText = 'Author';
        headerauthor.classList.add('col3');

        const headerYear = document.createElement('th');
        headerYear.innerText = 'Year';
        headerYear.classList.add('col4');

        const action = document.createElement('th');
        action.innerText = '';
        action.classList.add('col5');

        tableRow.append(headerNo, headerTitle, headerauthor, headerYear, action);
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

        const headerauthor = document.createElement('th');
        headerauthor.innerText = 'Author';
        headerauthor.classList.add('col3');

        const headerYear = document.createElement('th');
        headerYear.innerText = 'Year';
        headerYear.classList.add('col4');

        const action = document.createElement('th');
        action.innerText = '';
        action.classList.add('col5');

        tableRow.append(headerNo, headerTitle, headerauthor, headerYear, action);
        uncompletedBooksList.append(tableRow);

    }

    else {
        uncompletedBooksList.innerHTML = 'Tidak Ada buku...';
    }

    let number = 0;
    for (const bookItem of books) {
        if (!bookItem.isComplete) {
            number += 1;
            const bookElement = makeBook(bookItem, number);
            uncompletedBooksList.append(bookElement);
            uncompletedBooks.push(bookElement);
        }
    }

    number = 0;
    for (const bookItem of books) {
        if (bookItem.isComplete) {
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

    bookTarget.isComplete = true;
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

    bookTarget.isComplete = false;
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
    console.log(books);
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
        if (books[i].isComplete) {
            completedBooks.push(books[i]);
        }
    }

    return completedBooks;
}

function findUncompletedBooks(books) {
    var uncompletedBooks = [];

    for (var i = 0; i < books.length; i++) {
        if (books[i].isComplete == false) {
            uncompletedBooks.push(books[i]);
        }
    }

    return uncompletedBooks;
}
function modalConfig() {
    var modal = document.getElementById("modal");
    var btn = document.getElementById("addButton");
    var close = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
        modal.style.display = "block";
    }

    close.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


