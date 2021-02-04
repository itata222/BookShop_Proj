const mainPage = document.getElementById('bookPage-container')
const myCartButton = document.getElementById('myCartUrl');
myCartButton.className = "myCartUrl block";
myCartButton.innerHTML = 'My Cart(' + (JSON.parse(localStorage.getItem("customerBooksBefore")) == null ? 0 : JSON.parse(localStorage.getItem("customerBooksBefore")).length) + ')';
const discount = localStorage.getItem('discountPercentage') || 10;
console.log(discount)
const loginButton = document.getElementById('LoginOrJoin')
const logoutButton = document.getElementById('logout')
const isUserLogged = !!localStorage.getItem('myToken')
const token = localStorage.getItem('myToken')
let customerBooksArr = [];
if (isUserLogged) {
    loginButton.className = 'LoginOrJoin none';
    logoutButton.className = 'logout block'
}
else {
    loginButton.className = 'LoginOrJoin block';
    logoutButton.className = 'logout none'
}
const bookContainer = document.getElementById('bookPage-bookContainer')
const bookImgContainer = document.getElementById('bookPage-bookimgContainer')
const bookImg = document.getElementById('bookPage-bookImg')
const bookInfoContainer = document.getElementById('bookPage-bookInfoContainer')
const bookInfoTitle = document.getElementById('bookPage-bookInfoTitle')
const bookInfoCategory = document.getElementById('bookPage-bookInfoCategory')
const bookInfoYear = document.getElementById('bookPage-bookInfoYear')
const bookInfoAuthor = document.getElementById('bookPage-bookInfoAuthor')
const bookInfoDescription = document.getElementById('bookPage-bookInfoDescription')

const bookPriceBox = document.getElementById('bookPage-bookPriceBox');
const bookPrice = document.getElementById('bookPage-bookPrice');
const bookDelivery = document.getElementById('bookPage-bookDelivery');
const bookAddToBasketContainer = document.getElementById('bookPage-bookAddToBasketContainer');
const bookAddToBasketButtonForm = document.getElementById('bookPage-bookAddToBasketButtonForm')

const otherBooksContainer = document.getElementById('bookPage-OtherBooks')
const otherBooksUrl = 'http://localhost:4000/bookshop/category-books?category='

const addToCartForUserUrl = 'http://localhost:4000/bookshop/user-addToCart'
const addToCartForCustomerUrl = 'http://localhost:4000/bookshop/customer-addToCart'
const myCartUser = "http://localhost:4000/bookshop/customer-cart"
const myCartCustomer = 'http://localhost:4000/bookshop/user-cart'

const selectedBookTitle = localStorage.getItem('selectedBook')
const bookUrl = 'http://localhost:4000/bookshop/book-page?title=';
const url = bookUrl + selectedBookTitle;

fetch(url).then((res) => {
    if (res.ok)
        return res.json();
    else
        throw new Error(res)

}).then((selectedBookJson) => {
    createBookBox(selectedBookJson)
}).catch((err) => {
    console.log(err)
})

const createBookBox = (book) => {
    bookInfoTitle.innerHTML = book.title
    bookInfoCategory.innerHTML = 'Category: ' + book.category
    bookInfoYear.innerHTML = 'Year Published: ' + book.year_published
    bookInfoAuthor.innerHTML = 'By (Author) ' + book.author
    bookInfoDescription.innerHTML = book.description
    bookImg.src = book.image;
    bookPrice.innerHTML = 'Price: ' + (isUserLogged ? Math.floor(book.price * (100 - discount) / 100) : book.price) + '$'

    const finalOtherBooksUrl = otherBooksUrl + book.category
    fetch(finalOtherBooksUrl).then((res) => {
        if (res.ok)
            return res.json();
        else
            throw new Error(res)
    }).then((otherBookJson) => {
        for (let book of otherBookJson) {
            if (book.title === selectedBookTitle)
                continue;
            createOtherBook(book)
        }
    }).catch((err) => {
        console.log(err)
    })
}

bookAddToBasketButtonForm.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(selectedBookTitle, token)
    addToCartFunc(selectedBookTitle)
})


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
                let currentBooks = JSON.parse(localStorage.getItem("customerBooksBefore"));
                customerBooksArr = [...currentBooks]
                customerBooksArr.push(title)
                console.log(customerBooksArr)
                localStorage.setItem("customerBooksBefore", JSON.stringify(customerBooksArr));
                myCartButton.innerHTML = 'My Cart(' + JSON.parse(localStorage.getItem("customerBooksBefore")).length + ')';

            })
            .catch((error) => {
                console.error('Error:', error);
            });

}
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
        const storedBooks = JSON.parse(localStorage.getItem("customerBooksBefore"));
        console.log(storedBooks)
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

const createOtherBook = (book) => {
    const otherBookContainer = document.createElement('div')
    otherBookContainer.className = 'otherBookContainer';
    const otherBookImg = document.createElement('img')
    otherBookImg.className = "otherBookImg";
    otherBookImg.src = book.image
    const otherBookTitle = document.createElement('div')
    otherBookTitle.className = "otherBookTitle";
    otherBookTitle.innerHTML = book.title
    const otherBookAuthor = document.createElement('div')
    otherBookAuthor.className = "otherBookAuthor"
    otherBookAuthor.innerHTML = book.author
    const otherBookPrice = document.createElement('div')
    otherBookPrice.className = "otherBookPrice"
    otherBookPrice.innerHTML = (isUserLogged ? Math.floor(book.price * (100 - discount) / 100) : book.price) + '$'
    const otherBookAddToBasketForm = document.createElement('form')
    otherBookAddToBasketForm.className = "otherBookAddToBasketForm"
    const otherBookAddToBasketButton = document.createElement('button');
    otherBookAddToBasketButton.className = "otherBookAddToBasketButton"
    otherBookAddToBasketButton.innerHTML = 'Add To Basket';
    otherBookAddToBasketForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addToCartFunc(otherBookTitle.innerHTML)
    })
    otherBookAddToBasketForm.appendChild(otherBookAddToBasketButton)
    otherBookContainer.appendChild(otherBookImg)
    otherBookContainer.appendChild(otherBookTitle)
    otherBookContainer.appendChild(otherBookAuthor)
    otherBookContainer.appendChild(otherBookPrice)
    otherBookContainer.appendChild(otherBookAddToBasketForm)
    otherBooksContainer.appendChild(otherBookContainer)

    otherBookImg.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('selectedBook', book.title);
        window.location.href = 'http://localhost:4000/bookShop-bookPage.html';
    })
    otherBookTitle.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.setItem('selectedBook', book.title);
        window.location.href = 'http://localhost:4000/bookShop-bookPage.html';
    })
}
