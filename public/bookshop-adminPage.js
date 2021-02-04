const token = localStorage.getItem('myToken');
const isUserLogged = !!localStorage.getItem('myToken')
const logout = document.getElementById('logout-admin')
const mainPage = document.getElementById('mainPage')
const searchBookButton = document.getElementById('searchForm')
const searchBookButtonPhone = document.getElementById('searchForm-phone');
const searchTitleTextPhone = document.getElementById('searchTitleText-phone')
const searchTitleText = document.getElementById('searchTitleText');
const searchMinPriceText = document.getElementById('searchMinPriceText')
const searchMaxPriceText = document.getElementById('searchMaxPriceText')

const adminAddBookDiv = document.getElementById('adminAddBook');
const adminAddBookForm = document.getElementById('adminAddBookForm')
const adminAddBookDivPhone = document.getElementsByClassName('phoneAdminAddBook')[0];
const adminAddBookFormPhone = document.getElementById('adminAddBookForm-phone');

const adminDiscountInput = document.getElementById('discountText')
const adminDiscountContainer = document.getElementById('discountContainer')
const adminDiscountForm = document.getElementById('adminDiscountForm')

const addedBookTitle = document.getElementById('addedBookTitle');
const addedBookYearPublished = document.getElementById('addedBookYearPublished')
const addedBookCategory = document.getElementById('addedBookCategory')
const addedBookAuthor = document.getElementById('addedBookAuthor');
const addedBookDescription = document.getElementById('addedBookDescription');
const addedBookPrice = document.getElementById('addedBookPrice');
const addedBookImageSrc = document.getElementById('addedBookImageSrc');

const addedBookTitlePhone = document.getElementById('addedBookTitle-phone');
const addedBookYearPublishedPhone = document.getElementById('addedBookYearPublished-phone')
const addedBookCategoryPhone = document.getElementById('addedBookCategory-phone')
const addedBookAuthorPhone = document.getElementById('addedBookAuthor-phone');
const addedBookDescriptionPhone = document.getElementById('addedBookDescription-phone');
const addedBookPricePhone = document.getElementById('addedBookPrice-phone');
const addedBookImageSrcPhone = document.getElementById('addedBookImageSrc-phone');

const addBookError = document.getElementById('addBookError');
const addBookErrorPhone = document.getElementById('addBookError-phone');

const logoutUrl = 'http://localhost:4000/bookshop/logout-admin';
const adminAddBookUrl = 'http://localhost:4000/bookshop/admins/create-book';
const adminEditBookUrl = 'http://localhost:4000/bookshop/admins/edit-book?id='
const adminDeleteBookUrl = 'http://localhost:4000/bookshop/admins/delete-book?id='

const allBooksUrl = 'http://localhost:4000/bookshop/home';
const searchBooksUrl = 'http://localhost:4000/bookshop/search';
console.log(localStorage.getItem('discountPercentage'))

let discount = localStorage.getItem('discountPercentage') || 10;
adminDiscountForm.addEventListener('submit', (event) => {
    event.preventDefault();
    localStorage.setItem('discountPercentage', adminDiscountInput.value)
    console.log(localStorage.getItem('discountPercentage'))
    adminDiscountInput.value = "";
    alertModal('Discount Updated to: ' + localStorage.getItem('discountPercentage') + '% ')
})

adminAddBookDiv.className = "block adminAddBook";
adminAddBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = addedBookTitle.value;
    const year_published = addedBookYearPublished.value;
    const category = addedBookCategory.value;
    const author = addedBookAuthor.value;
    const description = addedBookDescription.value;
    const price = parseInt(addedBookPrice.value);
    const image = addedBookImageSrc.value;
    const data = { title, year_published, category, author, description, price, image };
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
                addedBookYearPublished.value = "";
                addedBookCategory.value = "";
                addedBookAuthor.value = "";
                addedBookDescription.value = "";
                addedBookPrice.value = "";
                addedBookImageSrc.value = "";
                alertModal('Added Book successfully');
            }
            else
                throw resJson

        }).catch((err) => {
            addBookError.className = `addBookError block`;
            addBookError.innerHTML = err.message.toUpperCase();
        })
})
adminAddBookFormPhone.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = addedBookTitlePhone.value;
    const year_published = addedBookYearPublishedPhone.value;
    const category = addedBookCategoryPhone.value;
    const author = addedBookAuthorPhone.value;
    const description = addedBookDescriptionPhone.value;
    const price = parseInt(addedBookPricePhone.value);
    const image = addedBookImageSrcPhone.value;
    const data = { title, year_published, category, author, description, price, image };
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
                addedBookTitlePhone.value = "";
                addedBookYearPublishedPhone.value = "";
                addedBookCategoryPhone.value = "";
                addedBookAuthorPhone.value = "";
                addedBookDescriptionPhone.value = "";
                addedBookPricePhone.value = "";
                addedBookImageSrcPhone.value = "";
                alertModal('Added Book successfully');
            }
            else
                throw resJson

        }).catch((err) => {
            console.log(err)
            addBookErrorPhone.className = `addBookErrorPhone block`;
            addBookErrorPhone.innerHTML = err.message.toUpperCase();

        })
})

const createCell = (book) => {
    const priceAndButtonContainer = document.createElement('div')
    const titleAndAuthorContainer = document.createElement('div')
    const cell = document.createElement('div')
    cell.className = 'cellPhone cell';
    const bookImg = document.createElement('img')
    bookImg.className = 'bookImg';
    bookImg.src = book.image;
    bookImg.addEventListener('click', (event) => {
        event.preventDefault();
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
    bookPrice.className = 'bookPrice';
    let finalPrice = Math.floor(book.price * (100 - discount) / 100)
    bookPrice.innerHTML = (isUserLogged ? `<del> ${book.price}$</del>` + " " + finalPrice : book.price) + "$"
    const deleteBookButton = document.createElement('button')
    deleteBookButton.className = 'bookAddToBasket button';
    deleteBookButton.id = 'deleteBookBut'
    deleteBookButton.innerHTML = 'Delete Book';
    const urlAdmin = adminDeleteBookUrl + book._id
    deleteBookButton.addEventListener('click', (event) => {
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
            alertModal('deleted book: ' + resJson.title)
        }).catch((err) => {
            alertModal(err)
        })
    })
    priceAndButtonContainer.appendChild(bookPrice)
    priceAndButtonContainer.appendChild(deleteBookButton)
    titleAndAuthorContainer.appendChild(bookTitle)
    titleAndAuthorContainer.appendChild(bookAuthor)
    bookData.appendChild(titleAndAuthorContainer)
    bookData.appendChild(priceAndButtonContainer)
    cell.appendChild(bookImg)
    cell.appendChild(bookData)
    return cell
}
const alertModal = (message) => {
    const alertModal = document.createElement('div')
    alertModal.className = "alertModal alertModal-phone";
    const alertModalContent = document.createElement('div')
    alertModalContent.className = 'alertNotLogged alertNotLogged-phone'
    alertModalContent.innerHTML = message;

    window.addEventListener('click', (event) => {
        const currentModal = document.querySelector('.modal')
        if (event.target == currentModal) {
            currentModal.remove();
        }
        if (event.target == alertModal) {
            alertModal.remove();
        }
    })
    alertModal.appendChild(alertModalContent)
    mainPage.appendChild(alertModal)
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
            alertModal('deleted book: ' + resJson.title)
        }).catch((err) => {
            console.log(err)
            alertModal(err)
        })
    })

    const adminModalSrcText = document.createElement('input')
    adminModalSrcText.setAttribute('type', 'text');
    adminModalSrcText.setAttribute('placeholder', 'Image src');
    adminModalSrcText.className = "adminModalSrcText";
    const adminModalSrcTextPhone = document.createElement('input')
    adminModalSrcTextPhone.setAttribute('type', 'text');
    adminModalSrcTextPhone.setAttribute('placeholder', 'Image src');
    adminModalSrcTextPhone.className = "adminModalSrcText-phone";
    adminModalSrcText.addEventListener('click', (event) => event.stopPropagation())
    adminModalSrcTextPhone.addEventListener('click', (event) => event.stopPropagation())
    const bookModal = document.createElement('div')
    bookModal.className = "modal modal-phone block"
    const bookModalContent = document.createElement('div')
    bookModalContent.className = "modal-content modal-content-phone"
    const closeModal = document.createElement('span')
    closeModal.className = "closeModal"
    closeModal.innerHTML = '&times';
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
    window.addEventListener('click', (event) => {
        const currentModal = document.querySelector('.modal')
        if (event.target == currentModal) {
            currentModal.remove();
        }
        if (event.target == alertModal) {
            alertModal.remove();
        }
    })

    bookInfoTitle.setAttribute('contenteditable', 'true')
    bookInfoAuthor.setAttribute('contenteditable', 'true')
    bookInfoDescription.setAttribute('contenteditable', 'true')
    bookInfoPrice.setAttribute('contenteditable', 'true');

    const adminModalForm = document.createElement('form');
    adminModalForm.className = "adminModalForm";
    const adminModalUpdateButton = document.createElement('button');
    adminModalUpdateButton.className = "adminModalUpdateButton button";
    adminModalUpdateButton.innerHTML = 'Update Changes';
    adminModalForm.appendChild(adminModalSrcText);
    adminModalForm.appendChild(adminModalUpdateButton);
    adminModalForm.addEventListener('click', (event) => {
        event.preventDefault();
        const image = adminModalSrcText.value || adminModalSrcTextPhone.value;
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
            alertModal('Updated Book Successfully')
        }).catch((err) => {
            alertModal(err)
        })
    })
    bookModalContent.appendChild(adminModalForm)
    bookModalContent.appendChild(img)
    bookModalContent.appendChild(adminModalSrcTextPhone)
    bookModalContent.appendChild(modalData)
    bookModalContent.appendChild(closeModal)
    bookModal.appendChild(bookModalContent)
    mainPage.appendChild(bookModal)
    console.log('2')
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
            localStorage.removeItem('customerBooksBefore')
            localStorage.removeItem('connectedUserBooksLength')
            window.location.href = 'http://localhost:4000/bookShop-home.html';
        })
        .catch((error) => {
            console.log(error)
        });
}

logout.addEventListener('click', (event) => {
    event.preventDefault();
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
    checkOutAndPayButton.innerHTML = "Proceed to Checkout";
    checkOutAndPayButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'http://localhost:4000/bookShop-cart.html';
    })
    window.addEventListener('click', (event) => {
        const currentModal = document.querySelector('.modal')
        if (event.target == currentModal) {
            currentModal.remove();
        }
    })
    bookModalContent.appendChild(boughtBook)
    bookModalContent.appendChild(checkOutAndPayButton)
    bookModalContent.appendChild(continueShoppingButton)
    bookModal.appendChild(bookModalContent)
    mainPage.appendChild(bookModal)
}