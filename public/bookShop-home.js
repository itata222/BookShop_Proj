const token = localStorage.getItem('myToken');
const isUserLogged = !!localStorage.getItem('myToken')
let customerBooksArr = JSON.parse(localStorage.getItem("customerBooksBefore")) || [];
let discount = localStorage.getItem('discountPercentage') || 10;
console.log(discount, localStorage.getItem('discountPercentage'))
let userConnectedBooksLength = localStorage.getItem('connectedUserBooksLength');
// localStorage.clear();

const body = document.getElementsByTagName('body')
const logInOrJoin = document.getElementById('LoginOrJoin');
const logout = document.getElementById('logout')
const mainPage = document.getElementById('mainPage')
const searchBookButton = document.getElementById('searchForm')
const searchBookButtonPhone = document.getElementById('searchForm-phone');
const searchTitleTextPhone = document.getElementById('searchTitleText-phone')
const searchTitleText = document.getElementById('searchTitleText');
const searchMinPriceText = document.getElementById('searchMinPriceText')
const searchMaxPriceText = document.getElementById('searchMaxPriceText')
const enterToCart = document.getElementById('myCartUrl');
const sortSelect = document.getElementById('sortSelect')
const sortSelectPhone = document.getElementById('sortSelectPhone')

const joinUrl = 'http://localhost:4000/bookshop/create-user'
const loginUrl = 'http://localhost:4000/bookshop/login';
const logoutUrl = 'http://localhost:4000/bookshop/logout';
const addToCartForUserUrl = 'http://localhost:4000/bookshop/user-addToCart';
const addToCartForCustomerUrl = 'http://localhost:4000/bookshop/customer-addToCart'
const allBooksUrl = 'http://localhost:4000/bookshop/home';
const searchBooksUrl = 'http://localhost:4000/bookshop/search';

let allBooksArr = [];
let isPriceLTH = false, isPriceHTL = false, isYearNTO = false, isYearOTN = false;

const modalOnload = () => {
    if (!isUserLogged)
        setTimeout(() => {
            const onLoadModal = document.createElement('div')
            onLoadModal.className = "onLoadModal"
            onLoadModal.style.display = "block";
            const onLoadModalContent = document.createElement('div')
            onLoadModalContent.className = "onLoadModalContent"
            const onLoadModalContentP1 = document.createElement('p')
            onLoadModalContentP1.className = "onLoadModalp1"
            onLoadModalContentP1.innerHTML = "&#128214;  Helloooo, Welcome to the craziest book store EVER !!!  &#128214;"
            setInterval(() => {
                onLoadModalContentP1.className = 'onLoadModalp1 red'
            }, 500);
            setInterval(() => {
                onLoadModalContentP1.className = 'onLoadModalp1 yellow'
            }, 1000);
            const onLoadModalContentP2 = document.createElement('p')
            onLoadModalContentP2.className = "onLoadModalp2"
            onLoadModalContentP2.innerHTML = `Just Notice That if you'll JOIN us You will get <b>${discount}% Discount</b> right away !! So... What are you waiting For??? `
            const onLoadModalContentP3 = document.createElement('p')
            onLoadModalContentP3.className = "onLoadModalp3"
            onLoadModalContentP3.innerHTML = "🙃  😉  🙃"
            onLoadModalContent.appendChild(onLoadModalContentP1)
            onLoadModalContent.appendChild(onLoadModalContentP2)
            onLoadModalContent.appendChild(onLoadModalContentP3)
            onLoadModal.appendChild(onLoadModalContent)
            mainPage.appendChild(onLoadModal)
            window.onclick = function (event) {
                if (event.target == onLoadModal) {
                    // mainPage.removeChild(onLoadModal)
                    onLoadModal.style.display = "none";
                }
            }
        }, 1500)
}
body.onload = modalOnload()

const changeToUserPage = () => {
    if (isUserLogged) {
        logInOrJoin.className = "LoginOrJoin none"
        logout.className = "logout block";
        enterToCart.innerHTML = 'My Cart(' + userConnectedBooksLength + ')';
    }
    else {
        logInOrJoin.className = "LoginOrJoin block"
        logout.className = "logout none";
        enterToCart.innerHTML = 'My Cart(' + (JSON.parse(localStorage.getItem("customerBooksBefore")) == null ? 0 : JSON.parse(localStorage.getItem("customerBooksBefore")).length) + ')';
    }
}
changeToUserPage();

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
        localStorage.setItem('selectedBook', book.title);
        window.location.href = 'http://localhost:4000/bookShop-bookPage.html';
    })
    const bookData = document.createElement('div')
    bookData.className = 'bookData'
    const bookTitle = document.createElement('div')
    bookTitle.className = 'bookTitle'
    bookTitle.innerHTML = book.title
    bookTitle.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('selectedBook', book.title);
        window.location.href = 'http://localhost:4000/bookShop-bookPage.html';
    })
    const bookAuthor = document.createElement('div')
    bookAuthor.className = 'bookAuthor'
    bookAuthor.innerHTML = book.author
    const bookPrice = document.createElement('div')
    bookPrice.className = 'bookPrice';
    let finalPrice = Math.floor(book.price * (100 - discount) / 100)
    bookPrice.innerHTML = (isUserLogged ? `<del> ${book.price}$</del>` + " " + finalPrice : book.price) + "$"
    const bookAddToBasket = document.createElement('button')
    bookAddToBasket.className = 'bookAddToBasket button';
    bookAddToBasket.innerHTML = 'Add to basket';
    bookAddToBasket.addEventListener('click', (event) => {
        event.preventDefault();
        addToCartFunc(book.title)
    })
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
const showBooks = (url) => {
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
            allBooksArr.push(book)
        }
    }).catch((err) => {
        console.log(err)
    })
}
showBooks(allBooksUrl)

const renderBooksDiv = () => {
    while (mainPage.children.length > 0)
        mainPage.removeChild(mainPage.lastChild)

    if (isYearOTN) {
        isYearOTN = false;
        console.log(allBooksArr)
        allBooksArr.sort((a, b) => {
            return a.year_published - b.year_published;
        })
    }
    else if (isYearNTO) {
        isYearNTO = false;
        console.log(allBooksArr)
        allBooksArr.sort((a, b) => {
            return b.year_published - a.year_published;
        })
    }
    else if (isPriceLTH) {
        isPriceLTH = false;
        console.log(allBooksArr)
        allBooksArr.sort((a, b) => {
            return a.price - b.price;
        })
    }
    else if (isPriceHTL) {
        isPriceHTL = false;
        console.log(allBooksArr)
        allBooksArr.sort((a, b) => {
            return b.price - a.price;
        })
    }

    allBooksArr.forEach(book => mainPage.appendChild(createCell(book)))
}
searchBookButtonPhone.addEventListener('submit', (event) => {
    event.preventDefault();
    showBooks(searchBooks());
    searchTitleTextPhone.value = "";
})
searchBookButton.addEventListener('submit', (event) => {
    event.preventDefault();
    showBooks(searchBooks());
    searchTitleText.value = "";
    searchMinPriceText.value = ""
    searchMaxPriceText.value = "";
})

sortSelect.addEventListener('change', (event) => {
    console.log(isPriceLTH, isPriceHTL, isYearNTO, isYearOTN)
    if (event.target.value === 'PLTH') {
        isPriceLTH = true;
        renderBooksDiv()
    }
    else if (event.target.value === 'PHTL') {
        isPriceHTL = true;
        renderBooksDiv()
    }
    else if (event.target.value === 'YNTO') {
        isYearNTO = true;
        renderBooksDiv()
    }
    else if (event.target.value === 'YOTN') {
        isYearOTN = true;
        renderBooksDiv()
    }
})
sortSelectPhone.addEventListener('change', (event) => {
    console.log(isPriceLTH, isPriceHTL, isYearNTO, isYearOTN)
    if (event.target.value === 'PLTH') {
        isPriceLTH = true;
        renderBooksDiv()
    }
    else if (event.target.value === 'PHTL') {
        isPriceHTL = true;
        renderBooksDiv()
    }
    else if (event.target.value === 'YNTO') {
        isYearNTO = true;
        renderBooksDiv()
    }
    else if (event.target.value === 'YOTN') {
        isYearOTN = true;
        renderBooksDiv()
    }
})

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
            localStorage.clear();
            changeToUserPage();
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
const addToCartFunc = (bookTitle) => {
    const title = bookTitle;
    const data = { title };
    console.log('you try to add to cart', data)
    if (isUserLogged)
        fetch(addToCartForUserUrl, {
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
                enterToCart.innerHTML = 'My Cart(' + data.user.myBooks.length + ')';
                localStorage.setItem('connectedUserBooksLength', parseInt(localStorage.getItem('connectedUserBooksLength')) + 1);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    else
        fetch(addToCartForCustomerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                bookAddedModal(title);
                customerBooksArr.push(title)
                localStorage.setItem("customerBooksBefore", JSON.stringify(customerBooksArr));
                enterToCart.innerHTML = 'My Cart(' + JSON.parse(localStorage.getItem("customerBooksBefore")).length + ')';
            })
            .catch((error) => {
                console.error('Error:', error);
            });

}