const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })
})

function addBook() {
    const titleBook = document.getElementById('title').value;
    const writerBook = document.getElementById('writer').value;
    const yearBook = document.getElementById('year').value;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, writerBook, yearBook, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
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

function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textWriter = document.createElement('p');
    textWriter.innerText = bookObject.writer;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textWriter, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerHTML = "Tandai belum dibaca";
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id)
        });

        const trashButton = document.createElement('button');
        trashButton.innerHTML = "Hapus";
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id)
        });

        container.append(undoButton, trashButton);
    }


    else {
        const checkButton = document.createElement('button');
        checkButton.innerHTML = "Tandai sudah dibaca";

        checkButton.addEventListener('click', function () {
            checkButtonFromCompleted(bookObject.id);
        });

        container.append(checkButton);
    }

    return container;

}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
    const uncompletedBooksList = document.getElementById('books');
    uncompletedBooksList.innerHTML = '';

    const completedBooksList = document.getElementById('completed-books');
    completedBooksList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);

        if(!bookItem.isCompleted) {
            uncompletedBooksList.append(bookElement);

        }
        else {
            completedBooksList.append(bookElement);
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
}

function findBook(bookID) {
    for (const bookItem of books) {
        if (bookItem.id === bookID) {
            return bookItem;
        }
    }

    return null;
}


