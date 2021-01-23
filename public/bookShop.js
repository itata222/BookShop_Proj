const logInOrJoin = document.getElementById('LoginOrJoin');
const mainPage = document.getElementById('mainPage')
const searchBookButton = document.getElementById('searchForm')
const searchTitleText = document.getElementById('searchTitleText');
const searchMinPriceText = document.getElementById('searchMinPriceText')
const searchMaxPriceText = document.getElementById('searchMaxPriceText')

const signInForm = document.getElementById('signInForm')
const JoinForm = document.getElementById('joinForm')

const joinUrl = 'http://localhost:4000/bookshop/create-user'
const loginUrl = 'http://localhost:4000/bookshop/login';
const logoutUrl = 'http://localhost:4000/bookshop/logout'
const deleteMyAccountUrl = 'http://localhost:4000/bookshop/delete-user';

const adminAddBookUrl = 'http://localhost:4000/bookshop/admins/create-book';
const adminEditBookUrl = 'http://localhost:4000/bookshop/admins/edit-book?id='

const allBooksUrl = 'http://localhost:4000/bookshop/home';//---
const searchBooksUrl = 'http://localhost:4000/bookshop/search';


const createCell = (book) => {
    const priceAndButtonContainer = document.createElement('div')
    const titleAndAuthorContainer = document.createElement('div')
    const cell = document.createElement('div')
    cell.className = 'cell';
    const bookImg = document.createElement('img')
    bookImg.className = 'bookImg';
    bookImg.src = book.image
    bookImg.style.height = '100%';
    bookImg.addEventListener('click', createModal)
    const bookData = document.createElement('div')
    bookData.className = 'bookData'
    const bookTitle = document.createElement('div')
    bookTitle.className = 'bookTitle'
    bookTitle.innerHTML = book.title
    bookTitle.addEventListener('click', createModal)
    const bookAuthor = document.createElement('div')
    bookAuthor.className = 'bookAuthor'
    bookAuthor.innerHTML = book.author
    const bookPrice = document.createElement('div')
    bookPrice.className = 'bookPrice'
    bookPrice.innerHTML = book.price + "$"
    const bookAddToBasket = document.createElement('button')
    bookAddToBasket.className = 'bookAddToBasket button'
    bookAddToBasket.innerHTML = 'Add to basket'
    priceAndButtonContainer.appendChild(bookPrice)
    priceAndButtonContainer.appendChild(bookAddToBasket)
    titleAndAuthorContainer.appendChild(bookTitle)
    titleAndAuthorContainer.appendChild(bookAuthor)
    bookData.appendChild(titleAndAuthorContainer)
    bookData.appendChild(priceAndButtonContainer)
    cell.appendChild(bookImg)
    cell.appendChild(bookData)
    return cell
}

const renderBooksGet = (url) => {
    console.log(url)
    while (mainPage.children.length > 0)
        mainPage.removeChild(mainPage.lastChild)

    fetch(url).then((res) => {

        if (res.ok)
            return res.json();
        else
            throw res;
    }).then((resJson) => {
        for (let book of resJson) {
            mainPage.appendChild(createCell(book))
        }
    }).catch((err) => {
        console.log(err)
    })
}

searchBookButton.addEventListener('submit', (event) => {

    event.preventDefault();
    renderBooksGet(searchBooks());
    searchTitleText.value = "";
    searchMinPriceText.value = ""
    searchMaxPriceText.value = "";
})

const showHomePage = renderBooksGet(allBooksUrl)

const createModal = (book) => {
    let selectedTitle = event.target.nextSibling.children[0].children[0].innerHTML
    let selectedAuthor = event.target.nextSibling.children[0].children[1].innerHTML
    let selectedPrice = event.target.nextSibling.children[1].children[0].innerHTML
    let selectedImgSrc = event.target.currentSrc;
    let img = document.createElement('img')
    img.src = selectedImgSrc;
    const bookInfo = document.createElement('div')
    const bookModal = document.createElement('div')
    bookModal.className = "modal block"
    const bookModalContent = document.createElement('div')
    bookModalContent.className = "modal-content"

    const closeModal = document.createElement('span')
    closeModal.className = "closeModal"
    closeModal.innerHTML = '&times';
    const modalData = document.createElement('div')
    modalData.className = 'modaldata'
    bookInfo.innerHTML = selectedTitle
    bookInfo.innerHTML = selectedAuthor
    bookInfo.innerHTML = selectedPrice
    modalData.appendChild(bookInfo)
    closeModal.onclick = function () {
        bookModal.className = "modal none";
    }
    window.onclick = function (event) {
        if (event.target == bookModal) {
            bookModal.className = "modal none";
        }
    }
    bookModalContent.appendChild(closeModal)
    bookModalContent.appendChild(img)
    bookModalContent.appendChild(modalData)
    bookModal.appendChild(bookModalContent)
    mainPage.appendChild(bookModal)
}


const searchBooks = () => {
    let searchFinalUrl;
    let title = searchTitleText.value
    let minPrice = searchMinPriceText.value
    let maxPrice = searchMaxPriceText.value
    console.log(title, minPrice, maxPrice)
    if (minPrice.length > 0 && maxPrice.length > 0)
        searchFinalUrl = searchBooksUrl + `?maxPrice=${parseInt(maxPrice)}&minPrice=${parseInt(minPrice)}`;
    else if (maxPrice.length === 0 && minPrice.length > 0)
        searchFinalUrl = searchBooksUrl + `?minPrice=${parseInt(minPrice)}`;
    else if (minPrice.length === 0 && maxPrice.length > 0)
        searchFinalUrl = searchBooksUrl + `?maxPrice=${parseInt(maxPrice)}`;
    else if (minPrice.length === 0 && maxPrice.length === 0)
        searchFinalUrl = allBooksUrl;

    if (searchFinalUrl !== allBooksUrl)
        title.length > 0 ? searchFinalUrl = searchFinalUrl + `&title=${title}` : searchFinalUrl = searchFinalUrl
    else
        title.length > 0 ? searchFinalUrl = searchFinalUrl + `?title=${title}` : allBooksUrl

    console.log(searchFinalUrl)
    return searchFinalUrl
}


// const renderBooksGet = (url) => {
//     while (mainPage.children.length > 0)
//         mainPage.removeChild(mainPage.lastChild)

//     fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     }).then((res) => {
//         if (res.ok)
//             return res.json();
//         else
//             throw res;
//     }).then((resJson) => {
//         for (let book of resJson) {
//             mainPage.appendChild(createCell(book))
//             console.log(book.title)
//         }
//     }).catch((err) => {
//         console.log(err)
//     })
// }