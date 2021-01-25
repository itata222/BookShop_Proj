
const logInOrJoin = document.getElementById('LoginOrJoin');
const logout = document.getElementById('logout')
const mainPage = document.getElementById('mainPage')
const searchBookButton = document.getElementById('searchForm')
const searchTitleText = document.getElementById('searchTitleText');
const searchMinPriceText = document.getElementById('searchMinPriceText')
const searchMaxPriceText = document.getElementById('searchMaxPriceText')
const myCartButton = document.getElementsByClassName('myCartUrl')[0];

const addToCartUrl = 'http://localhost:4000/bookshop/addToCart';
const myCartUrl = 'http://localhost:4000/bookshop/user-cart'
const logoutUrl = 'http://localhost:4000/bookshop/logout';
const deleteMyAccountUrl = 'http://localhost:4000/bookshop/delete-user';


const allBooksUrl = 'http://localhost:4000/bookshop/home';
const searchBooksUrl = 'http://localhost:4000/bookshop/search';


logout.addEventListener('click', logoutFunc)
const logoutFunc = () => {
    const token = loggedToken;
    fetch(logoutUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.location.href = 'http://localhost:4000/bookShop-home.html';
        })
        .catch((error) => {
            alert('Error:', error);
        });
}

const bookAddedModal = () => {
    const bookModal = document.createElement('div')
    bookModal.className = "modal block"
    const bookModalContent = document.createElement('div')
    bookModalContent.className = "modal-content modalCart"
    const closeModal = document.createElement('span')
    closeModal.className = "closeModal"
    closeModal.innerHTML = '&times';
    const continueShoppingButton = document.createElement('button');
    continueShoppingButton.innerHTML = "Continue Shopping"
    continueShoppingButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'http://localhost:4000/bookShop-usersHome.html';
    })
    const checkOutAndPayButton = document.createElement('button');
    checkOutAndPayButton.innerHTML = "Proceed to Checkout"
    checkOutAndPayButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'http://localhost:4000/bookShop-cart.html';
    })

}
const addToCartFunc = (book) => {
    const title = book.title;
    const data = { title }
    console.log('you try to add to cart')
    fetch(addToCartUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            bookAddedModal(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const createCell = (book) => {
    const priceAndButtonContainer = document.createElement('div')
    const titleAndAuthorContainer = document.createElement('div')
    const cell = document.createElement('div')
    cell.className = 'cell';
    const bookImg = document.createElement('img')
    bookImg.className = 'bookImg';
    bookImg.src = book.image
    bookImg.style.height = '100%';
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
    bookPrice.className = 'bookPrice'
    bookPrice.innerHTML = book.price + "$"
    const bookAddToBasket = document.createElement('button')
    bookAddToBasket.className = 'bookAddToBasket button'
    bookAddToBasket.innerHTML = 'Add to basket'
    bookAddToBasket.addEventListener('click', addToCartFunc)
    bookAddToBasketDuplicate = bookAddToBasket;
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
    img.className = "modalImg"
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
    bookInfoAddToBasketButton.innerHTML = 'Add to basket';
    bookInfoAddToBasketButton.addEventListener('click', addToCartFunc)
    const bookModal = document.createElement('div')
    bookModal.className = "modal block"
    const bookModalContent = document.createElement('div')
    bookModalContent.className = "modal-content"
    const closeModal = document.createElement('span')
    closeModal.className = "closeModal"
    closeModal.innerHTML = '&times';
    const modalData = document.createElement('div')
    modalData.className = 'modaldata'
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
    bookModalContent.appendChild(img)
    bookModalContent.appendChild(modalData)
    bookModalContent.appendChild(closeModal)
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