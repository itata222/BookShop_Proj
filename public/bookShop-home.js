const token = localStorage.getItem('myToken');
let connectedUserIsAdmin = localStorage.getItem('isAdmin');
// localStorage.clear();
console.log(token, connectedUserIsAdmin)
const logInOrJoin = document.getElementById('LoginOrJoin');
const logout = document.getElementById('logout')
const mainPage = document.getElementById('mainPage')
const searchBar = document.getElementsByClassName('searchBar')[0]
const searchBookButton = document.getElementById('searchForm')
const searchBookButtonPhone = document.getElementById('searchForm-phone');
const searchTitleTextPhone = document.getElementById('searchTitleText-phone')
const searchTitleText = document.getElementById('searchTitleText');
const searchMinPriceText = document.getElementById('searchMinPriceText')
const searchMaxPriceText = document.getElementById('searchMaxPriceText')
const enterToCart = document.getElementById('myCartUrl')
const signInForm = document.getElementById('signInForm')
const JoinForm = document.getElementById('joinForm')
const adminAddBookDiv = document.getElementById('adminAddBook');
const adminAddBookForm = document.getElementById('adminAddBookForm')
const addedBookTitle = document.getElementById('addedBookTitle');
const addedBookAuthor = document.getElementById('addedBookAuthor');
const addedBookDescription = document.getElementById('addedBookDescription');
const addedBookPrice = document.getElementById('addedBookPrice');
const addedBookImageSrc = document.getElementById('addedBookImageSrc');
const addBookError = document.getElementById('addBookError')

const joinUrl = 'http://localhost:4000/bookshop/create-user'
const loginUrl = 'http://localhost:4000/bookshop/login';
const logoutUrl = 'http://localhost:4000/bookshop/logout';
const deleteMyAccountUrl = 'http://localhost:4000/bookshop/delete-user';
const addToCartUrl = 'http://localhost:4000/bookshop/addToCart'

const adminAddBookUrl = 'http://localhost:4000/bookshop/admins/create-book';
const adminEditBookUrl = 'http://localhost:4000/bookshop/admins/edit-book?id='
const adminDeleteBookUrl = 'http://localhost:4000/bookshop/admins/delete-book?id='

const allBooksUrl = 'http://localhost:4000/bookshop/home';
const searchBooksUrl = 'http://localhost:4000/bookshop/search';

const changeToUserPage = () => {
    if (!!localStorage.getItem('myToken')) {
        enterToCart.className = 'myCartUrl block'
        logInOrJoin.className = "LoginOrJoin none"
        logout.className = "logout block";
    }
    else {
        logInOrJoin.className = "LoginOrJoin block"
        logout.className = "logout none";
        enterToCart.className = 'myCartUrl none'
    }
}
changeToUserPage();

if (connectedUserIsAdmin === 'true') {
    connectedUserIsAdmin = true;
    enterToCart.className = 'myCartUrl none'
    adminAddBookDiv.className = "adminAddBook block";
    adminAddBookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log(token)
        const title = addedBookTitle.value;
        const author = addedBookAuthor.value;
        const description = addedBookDescription.value;
        const price = parseInt(addedBookPrice.value);
        const image = addedBookImageSrc.value;
        const data = { title, author, description, price, image };
        fetch(adminAddBookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then((resJson) => {

                if (!resJson.message) {
                    mainPage.appendChild(createCell(resJson))
                    addedBookTitle.value = "";
                    addedBookAuthor.value = "";
                    addedBookDescription.value = "";
                    addedBookPrice.value = "";
                    addedBookImageSrc.value = "";
                    alert('Added Book successfully');
                }
                else
                    throw resJson

            }).catch((err) => {
                console.log(err)
                addBookError.className = "addBookError block";
                addBookError.innerHTML = err.message.toUpperCase();

            })
    })
}
else {
    adminAddBookDiv.className = "adminAddBook none"
    connectedUserIsAdmin = false;
}

const createCell = (book) => {
    const priceAndButtonContainer = document.createElement('div')
    const titleAndAuthorContainer = document.createElement('div')
    const cell = document.createElement('div')
    cell.className = 'cellPhone cell';
    const bookImg = document.createElement('img')
    bookImg.className = 'bookImg';
    bookImg.src = book.image;
    bookImg.addEventListener('click', (event) => {
        console.log('1')
        event.preventDefault();
        console.log('2')
        createModal(book)
    })
    const bookData = document.createElement('div')
    bookData.className = 'bookData'
    const bookTitle = document.createElement('div')
    bookTitle.className = 'bookTitle'
    bookTitle.innerHTML = book.title
    bookTitle.addEventListener('click', (event) => {
        event.preventDefault();
        createModal(book)
    })
    const bookAuthor = document.createElement('div')
    bookAuthor.className = 'bookAuthor'
    bookAuthor.innerHTML = book.author
    const bookPrice = document.createElement('div')
    bookPrice.className = 'bookPrice'
    bookPrice.innerHTML = book.price + "$"
    const bookAddToBasket = document.createElement('button')
    bookAddToBasket.className = 'bookAddToBasket button';
    if (connectedUserIsAdmin) {
        bookAddToBasket.innerHTML = 'Delete Book';
        const urlAdmin = adminDeleteBookUrl + book._id
        bookAddToBasket.addEventListener('click', (event) => {
            event.preventDefault();
            fetch(urlAdmin, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw new Error(res.message)
            }).then((resJson) => {
                console.log(resJson)
                alert('deleted book: ' + resJson.title)
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    else {
        bookAddToBasket.innerHTML = 'Add to basket';
        if (!localStorage.getItem('myToken'))
            bookAddToBasket.addEventListener('click', notLoggedTryToAdd)
        else
            bookAddToBasket.addEventListener('click', (event) => {
                event.preventDefault();
                addToCartFunc(book)
            })
    }
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
const notLoggedTryToAdd = () => {
    alert('Hey! You must Login first to make a purchase')
}

const renderBooksGet = (url) => {
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

renderBooksGet(allBooksUrl)

searchBookButtonPhone.addEventListener('submit', (event) => {
    event.preventDefault();
    renderBooksGet(searchBooks());
    searchTitleTextPhone.value = "";
})
searchBookButton.addEventListener('submit', (event) => {
    event.preventDefault();
    renderBooksGet(searchBooks());
    searchTitleText.value = "";
    searchMinPriceText.value = ""
    searchMaxPriceText.value = "";
})
const createModal = (book) => {
    let selectedTitle = book.title
    let selectedAuthor = book.author
    let selectedDescription = book.description
    let selectedPrice = book.price + '$'
    let selectedImgSrc = book.image;
    let img = document.createElement('img')
    img.src = selectedImgSrc;
    img.className = "modalImg modalImg-phone"
    const bookInfoTitle = document.createElement('div')
    bookInfoTitle.className = "bookInfoTitle"
    const bookInfoAuthor = document.createElement('div')
    bookInfoAuthor.className = "bookInfoAuthor";
    const bookInfoDescription = document.createElement('div')
    bookInfoDescription.className = "bookInfoDescription";
    const bookInfoPriceAndButton = document.createElement('div')
    bookInfoPriceAndButton.className = "bookInfoPriceAndButton"
    const bookInfoPrice = document.createElement('div')
    bookInfoPrice.className = "bookInfoPrice";
    const bookInfoAddToBasketButton = document.createElement('button')
    bookInfoAddToBasketButton.className = "bookInfoAddToCart button"
    if (connectedUserIsAdmin) {
        bookInfoAddToBasketButton.innerHTML = 'Delete Book';
        const urlAdmin = adminDeleteBookUrl + book._id;
        bookInfoAddToBasketButton.addEventListener('click', (event) => {
            event.preventDefault();
            fetch(urlAdmin, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw new Error(res.message)
            }).then((resJson) => {
                alert('deleted book: ' + resJson.title)
            }).catch((err) => {
                console.log(err)
            })
        })
    }
    else {
        bookInfoAddToBasketButton.innerHTML = 'Add to basket';
        if (!localStorage.getItem('myToken'))
            bookInfoAddToBasketButton.addEventListener('click', notLoggedTryToAdd)
        else
            bookInfoAddToBasketButton.addEventListener('click', (event) => {
                event.preventDefault();
                addToCartFunc(book)
            })
    }
    const bookModal = document.createElement('div')
    bookModal.className = "modal modal-phone block"
    const bookModalContent = document.createElement('div')
    bookModalContent.className = "modal-content modal-content-phone"
    const closeModal = document.createElement('span')
    closeModal.className = "closeModal"
    closeModal.innerHTML = '&times';
    console.log('3')
    const modalData = document.createElement('div')
    modalData.className = 'modaldata modaldata-phone'
    bookInfoTitle.innerHTML = selectedTitle
    bookInfoAuthor.innerHTML = selectedAuthor
    bookInfoDescription.innerHTML = selectedDescription
    bookInfoPrice.innerHTML = selectedPrice
    bookInfoPriceAndButton.appendChild(bookInfoPrice)
    bookInfoPriceAndButton.appendChild(bookInfoAddToBasketButton)
    modalData.appendChild(bookInfoTitle)
    modalData.appendChild(bookInfoAuthor)
    modalData.appendChild(bookInfoDescription)
    modalData.appendChild(bookInfoPriceAndButton)
    closeModal.onclick = function () {
        bookModal.remove();
    }
    window.onclick = function (event) {
        if (event.target == bookModal) {
            bookModal.remove();
        }
    }
    if (connectedUserIsAdmin) {
        console.log(connectedUserIsAdmin, 'asdasdsa')
        bookInfoTitle.setAttribute('contenteditable', 'true')
        bookInfoAuthor.setAttribute('contenteditable', 'true')
        bookInfoDescription.setAttribute('contenteditable', 'true')
        bookInfoPrice.setAttribute('contenteditable', 'true');
        const adminModalChangesHeader = document.createElement('h4')
        adminModalChangesHeader.innerHTML = "Admin's Updates"
        const adminModalForm = document.createElement('form');
        adminModalForm.className = "adminModalForm";
        const adminModalSrcText = document.createElement('input')
        adminModalSrcText.setAttribute('type', 'text');
        adminModalSrcText.setAttribute('placeholder', 'image src');
        adminModalSrcText.className = "adminModalSrcText";
        const adminModalUpdateButton = document.createElement('button');
        adminModalUpdateButton.className = "adminModalUpdateButton";
        adminModalUpdateButton.innerHTML = 'Update Changes';
        adminModalForm.appendChild(adminModalSrcText);
        adminModalForm.appendChild(adminModalUpdateButton);
        adminModalForm.addEventListener('click', (event) => {
            event.preventDefault();
            const image = adminModalSrcText.value;
            const title = bookInfoTitle.innerHTML;
            const author = bookInfoAuthor.innerHTML;
            const description = bookInfoDescription.innerHTML;
            const price = parseInt(bookInfoPrice.innerHTML.slice(0, bookInfoPrice.innerHTML.length - 1));
            let data = { title, description, price, author }
            if (image.length > 0)
                data = { title, description, price, author, image }
            const url = adminEditBookUrl + book._id;
            console.log(data)
            console.log(url)
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            }).then((res) => {
                if (res.ok)
                    return res.json();
                else
                    throw new Error(res.message)
            }).then((resJson) => {
                console.log(resJson)

            }).catch((err) => {
                console.log(err)
            })
        })
        bookModalContent.appendChild(adminModalForm)
    }
    bookModalContent.appendChild(img)
    bookModalContent.appendChild(modalData)
    bookModalContent.appendChild(closeModal)
    bookModal.appendChild(bookModalContent)
    mainPage.appendChild(bookModal)
}


const searchBooks = () => {
    let searchFinalUrl;
    let phoneTitle = searchTitleTextPhone.value;
    let title = searchTitleText.value
    let minPrice = searchMinPriceText.value
    let maxPrice = searchMaxPriceText.value
    console.log(title, minPrice, maxPrice, phoneTitle)
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
        title.length > 0 ? searchFinalUrl = searchBooksUrl + `?title=${title}` : allBooksUrl

    if (phoneTitle.length > 0)
        searchFinalUrl = searchBooksUrl + `?title=${phoneTitle}`;

    console.log(searchFinalUrl)
    return searchFinalUrl
}


const logoutFunc = () => {
    fetch(logoutUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
        .then((response) => {
            console.log(response)
            if (response.ok)
                return response.json();
            else
                throw new Error(response)
        })
        .then(data => {
            console.log('Success:', data);
            localStorage.removeItem('myToken');
            localStorage.removeItem('isAdmin');
            changeToUserPage();
            window.location.href = 'http://localhost:4000/bookShop-home.html';
        })
        .catch((error) => {
            console.log('122222222')
            console.log(error)
            // window.location.href = 'http://localhost:4000/bookShop-home.html';
        });
}

logout.addEventListener('click', (event) => {
    event.preventDefault();
    console.log('11111111111111111111111111')
    logoutFunc()
})

const bookAddedModal = (bookTitle) => {
    const bookModal = document.createElement('div')
    bookModal.className = "modal block"
    const bookModalContent = document.createElement('div')
    bookModalContent.className = "modalCart modalCart-phone"
    const boughtBook = document.createElement('div')
    boughtBook.className = "announ"
    boughtBook.innerHTML = `You just addded <b>${bookTitle}</b> to your cart! \n Choose your next step:`
    const continueShoppingButton = document.createElement('button');
    continueShoppingButton.className = "button continueBut"
    continueShoppingButton.innerHTML = "Continue Shopping"
    continueShoppingButton.onclick = function () {
        bookModal.remove();
    }
    const checkOutAndPayButton = document.createElement('button');
    checkOutAndPayButton.className = "button checkAndProBut"
    checkOutAndPayButton.innerHTML = "Proceed to Checkout"
    checkOutAndPayButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'http://localhost:4000/bookShop-cart.html';
    })
    window.onclick = function (event) {
        if (event.target == bookModal) {
            bookModal.remove();
        }
    }
    bookModalContent.appendChild(boughtBook)
    bookModalContent.appendChild(checkOutAndPayButton)
    bookModalContent.appendChild(continueShoppingButton)
    bookModal.appendChild(bookModalContent)
    mainPage.appendChild(bookModal)
}
const addToCartFunc = (book) => {
    const title = book.title;
    const data = { title }
    console.log('you try to add to cart', data)
    fetch(addToCartUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            bookAddedModal(title)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


