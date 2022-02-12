"use strict"

let elBookList = document.querySelector(".book-list");
let elBookmarkList = document.querySelector(".bookmark-list");
let elPaginationList = document.querySelector(".pagination-list");
let elForm = document.querySelector(".forma");
let elSearchInput = document.querySelector(".search-input");
let elResultSpan = document.querySelector(".result-span");
let orderBtn = document.querySelector(".order-btn");
let modalInfo = document.querySelector(".modal-information");
let elNextBtn = document.querySelector(".btn-2");
let elPrevBtn = document.querySelector(".btn-1");
let elLogoutBtn = document.querySelector(".logout-button");
let localToken = window.localStorage.getItem("token");
let page = 0;
let orderBy = "relevance";
let defaultName = "stive jobs";

if (!localToken) {
    window.location.replace("index.html");
}

elLogoutBtn.addEventListener("click", function() {
    window.localStorage.removeItem("token");

    window.location.replace("index.html");
});

//Kitoblar cardini generate qilib ui ga chiqaruvchi funktsiya
const generateBook = function(obj, element) {
        let arr = obj.items;

        elResultSpan.textContent = `Showing ${obj.totalItems} Result(s)`
        arr.forEach(book => {

            let newLi = document.createElement("li")
            let newDiv = document.createElement("div")
            let newDiv2 = document.createElement("div")
            let newImg = document.createElement("img")
            let newCardBody = document.createElement("div")
            let newCardTitle = document.createElement("h5")
            let newCardDesc = document.createElement("p")
            let newCardDesc2 = document.createElement("p")
            let newBtnBox = document.createElement("div")
            let newButton = document.createElement("button")
            let newButton2 = document.createElement("button")
            let newButton3 = document.createElement("a")


            //TextContent
            newButton.textContent = "Bookmark";
            newButton2.textContent = "More info";
            newButton3.textContent = "Read";
            newCardTitle.textContent = book.volumeInfo.title;
            newCardDesc.textContent = book.volumeInfo.authors[0];
            newCardDesc2.textContent = book.volumeInfo.publishedDate;

            //Dataset
            newButton.dataset.boomarkId = book.id;
            newButton2.dataset.moreBtnId = book.id;

            newLi.setAttribute("class", "card");
            newDiv.setAttribute("class", "p-3");
            newDiv2.setAttribute("class", "p-3 bg-light");
            newImg.setAttribute("src", book.volumeInfo.imageLinks.smallThumbnail)
            newImg.setAttribute("class", "d-flex justify-content-center card-img")
            newCardBody.setAttribute("class", "card-body pt-0");
            newCardTitle.setAttribute("class", "card-title m-0");
            newCardDesc.setAttribute("class", "text-secondary");
            newCardDesc2.setAttribute("class", "text-secondary");
            newBtnBox.setAttribute("class", "d-flex gap-2 mb-2")
            newButton.setAttribute("class", "btn btn-warning fw-bold w-50 bookmark-btn");
            newButton2.setAttribute("class", "btn btn-light text-primary fw-bold w-50 more-info");
            newButton3.setAttribute("class", "btn btn-secondary text-light fw-bold w-100");
            newButton3.setAttribute("href", `${book.volumeInfo.previewLink}`);
            newButton3.setAttribute("target", "_blank");

            element.appendChild(newLi)
            newLi.appendChild(newDiv)
            newDiv.appendChild(newDiv2)
            newDiv2.appendChild(newImg)
            newLi.appendChild(newCardBody)
            newCardBody.appendChild(newCardTitle)
            newCardBody.appendChild(newCardDesc)
            newCardBody.appendChild(newCardDesc2)
            newCardBody.appendChild(newBtnBox)
            newBtnBox.appendChild(newButton)
            newBtnBox.appendChild(newButton2)
            newCardBody.appendChild(newButton3)
        })
    }
    //bookmark btn bosilganda kitobni nomini chiqarish u/n funktsiya
const renderBook = function(arrBookmark, node) {
    arrBookmark.forEach(child => {
        let newBookmarkLi = document.createElement("li");
        let cardBody = document.createElement("div");
        let cardTitleBox = document.createElement("div");
        let cardBtnBox = document.createElement("div");
        let newDesc = document.createElement("h5");
        let newDesc2 = document.createElement("p");
        let newBtn = document.createElement("a");
        let newBtn2 = document.createElement("button");

        newBtn2.dataset.removeBtnId = child.id;

        console.log(child);

        newBookmarkLi.setAttribute("class", "p-3 bg-light rounded")
        cardBody.setAttribute("class", "d-flex gap-3 justify-content-between")
        cardBtnBox.setAttribute("class", "d-flex align-items-center gap-2")
        newDesc.setAttribute("class", "card-title")
        newDesc2.setAttribute("class", "card-text text-secondary")
        newBtn.setAttribute("class", "btn bi bi-book p-0 text-secondary fs-3 fw-bold")
        newBtn.setAttribute("href", `${child.volumeInfo.previewLink}`)
        newBtn.setAttribute("target", "_blank")
        newBtn2.setAttribute("class", "btn bi bi-backspace p-0 text-danger fs-3 fw-bold remove-button")

        newDesc.textContent = child.volumeInfo.title;
        newDesc2.textContent = child.volumeInfo.authors[0];

        node.appendChild(newBookmarkLi)
        newBookmarkLi.appendChild(cardBody)
        cardBody.appendChild(cardTitleBox)
        cardBody.appendChild(cardBtnBox)
        cardTitleBox.appendChild(newDesc)
        cardTitleBox.appendChild(newDesc2)
        cardBtnBox.appendChild(newBtn)
        cardBtnBox.appendChild(newBtn2)
    })
}

const renderApi = async function(bookName) {

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=search+terms=${bookName}&startIndex=${page}&orderBy=${orderBy}`)

        const data = await response.json();

        const localBookmark = JSON.parse(window.localStorage.getItem("bookmarkArr"));

        let bookmarkArr = localBookmark || [];

        let moreInfoArr = [];

        elBookList.addEventListener("click", (evt) => {

            if (evt.target.matches(".bookmark-btn")) {

                let btnId = evt.target.dataset.boomarkId;

                const booksId = data.items.find(item => item.id === btnId)

                if (!bookmarkArr.includes(booksId)) {
                    bookmarkArr.push(booksId);
                }

                window.localStorage.setItem("bookmarkArr", JSON.stringify(bookmarkArr))
                elBookmarkList.innerHTML = null
                renderBook(bookmarkArr, elBookmarkList)

            } else if (evt.target.matches(".more-info")) {
                modalInfo.classList.add("more-info-modal")
                modalInfo.classList.remove("more-info-modal-2")
                body.style.position = "fixed"

                let moreId = evt.target.dataset.moreBtnId

                moreInfoArr.push(data.items.find(modal => modal.id === moreId))

                moreInfoArr.forEach(modalUi => {


                    const html = `
                    <div class="py-3 px-4 bg-light d-flex justify-content-between align-items-center">
                    <h5 class="modal-title w-24">
                    ${modalUi.volumeInfo.title}
                    </h5>
                    
                    <button class="btn fs-5 fw-bold x-button bi bi-x-lg">
                    </button>
                    </div>
                    
                    <div class="px-4 d-flex justify-content-center align-items-center flex-column">
                    <img class="pt-5" src="${modalUi.volumeInfo.imageLinks.smallThumbnail}" max-width="300" min-height="300" alt="">
                    
                    <p class="">
                    ${modalUi.volumeInfo.description}
                    </p>
                    </div>
                    
                    <div class="d-flex px-4 pt-5 flex-column">
                    <p class="fs-5 fw-bold">
                    author: <span class="bg-light text-primary p-1 px-2 ms-5 rounded-pill">${modalUi.volumeInfo.authors[0]}</span>
                    </p>
                    <p class="fs-5 fw-bold">
                    Published: <span class="bg-light text-primary p-1 px-2 ms-5 rounded-pill">${modalUi.volumeInfo.publishedDate}</span>
                    </p>
                    <p class="fs-5 fw-bold">
                    Publishers: <span class="bg-light text-primary p-1 px-2 ms-5 rounded-pill">${modalUi.volumeInfo.publisher}</span>
                    </p>
                    <p class="fs-5 fw-bold">
                    Categories: <span class="bg-light text-primary p-1 px-2 ms-5 rounded-pill">${modalUi.volumeInfo.categories}</span>
                    </p>
                    
                    <p class="fs-5 fw-bold">
                    Pages Count: <span class="bg-light text-primary p-1 px-2 ms-5 rounded-pill">${data.totalItems}</span>
                    </p>
                    
                    </div>
                    
                    <div class="px-4 py-3 bg-light d-flex justify-content-end">
                    
                    <a href="${modalUi.volumeInfo.previewLink}" class="btn btn-secondary px-4 fs-5 fw-bold" target="_blank">
                    read
                    </a>
                    </div>
                    `

                    modalInfo.innerHTML = null;
                    modalInfo.insertAdjacentHTML('beforeend', html);
                })
            }
        })

        elBookmarkList.addEventListener("click", (evt) => {
            if (evt.target.matches(".remove-button")) {
                let removeId = evt.target.dataset.removeBtnId;
                const bookRemove = bookmarkArr.findIndex(remove => remove.id === removeId)

                bookmarkArr.splice(bookRemove, 1);

                elBookmarkList.innerHTML = null;

                window.localStorage.setItem("bookmarkArr", JSON.stringify(bookmarkArr))

                renderBook(bookmarkArr, elBookmarkList)
            }
        })

        orderBtn.addEventListener("click", async() => {
            orderBy = "newest"

            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=search+terms=${bookName}&startIndex=${page}&orderBy=${orderBy}`)

            const data = await response.json();

            elResultSpan.textContent = `Showing ${data.totalItems} Result(s)`

            elBookList.innerHTML = null
            generateBook(data, elBookList)
        })

        let pageNumber = Math.floor(data.totalItems / 10)

        for (let i = 1; i <= pageNumber; i++) {
            let newItem = document.createElement("li")
            let newButtonPagination = document.createElement("button")

            newButtonPagination.textContent = i;

            newButtonPagination.dataset.buttonId = newButtonPagination.textContent;

            newButtonPagination.setAttribute("class", "btn btn-secondary px-3");

            elPaginationList.appendChild(newItem);
            newItem.appendChild(newButtonPagination);
        }

        if (page === 0) {
            elPrevBtn.disabled = true;
        } else {
            elPrevBtn.disabled = false;
        }

        if (page === pageNumber) {
            elNextBtn.disabled = true;
        } else {
            elNextBtn.disabled = false;
        }

        renderBook(bookmarkArr, elBookmarkList)
        generateBook(data, elBookList);

    } catch {
        error.classList.add("error-modal")
        error.classList.remove("error-modal-2")
    }


}

modalInfo.addEventListener("click", (evt) => {
    if (evt.target.matches(".x-button")) {
        console.log(evt.target);
        modalInfo.classList.remove("more-info-modal")
        modalInfo.classList.add("more-info-modal-2")
        body.style.position = "relative"
    }
})

elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let inputValue = elSearchInput.value;

    if (!inputValue) {
        renderApi(`${defaultName}`)
    }

    renderApi(`${inputValue}`)

    elPaginationList.innerHTML = null;
    elBookList.innerHTML = null;
})

elNextBtn.addEventListener("click", () => {
    let inputValue = elSearchInput.value;

    elBookList.innerHTML = null;
    elPaginationList.innerHTML = null;

    page++
    renderApi(`${inputValue || defaultName}`)
})


elPrevBtn.addEventListener("click", () => {
    let inputValue = elSearchInput.value;

    elBookList.innerHTML = null;
    elPaginationList.innerHTML = null;

    page--
    renderApi(`${inputValue || defaultName}`)
})

elPaginationList.addEventListener("click", (evt) => {
    if (evt.target.matches(".btn-secondary")) {

        elBookList.innerHTML = null;

        let inputValue = elSearchInput.value;

        let pageId = evt.target.dataset.buttonId;

        page = pageId;

        elPaginationList.innerHTML = null;

        renderApi(`${inputValue || defaultName}`)
    }
})

okBtn.addEventListener("click", () => {
    error.classList.remove("error-modal")
    error.classList.add("error-modal-2")
})

renderApi(`${defaultName}`)