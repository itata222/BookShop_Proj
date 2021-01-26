const token = localStorage.getItem('myToken');
const cartBooks = document.getElementById('cart-books');
const cartQuantity = document.getElementById('cart-quantity');
const cartOptions = document.getElementById('cart-options');
const cartPrices = document.getElementById('cart-prices');
const cartPayButton = document.getElementById('cart-payButton');
const cartTotalPrice = document.getElementById('cart-totalPrice');
const myCartUrl = 'http://localhost:4000/bookshop/user-cart';

let totalPrice = 0, totalQuantity = 0;

cartPayButton.addEventListener('click', (event) => {
    event.preventDefault();
    while (cartBooks.children.length > 0)
        cartBooks.removeChild(cartBooks.lastChild)
    while (cartQuantity.children.length > 0)
        cartQuantity.removeChild(cartQuantity.lastChild)
    while (cartOptions.children.length > 0)
        cartOptions.removeChild(cartOptions.lastChild)
    while (cartPrices.children.length > 0)
        cartPrices.removeChild(cartPrices.lastChild)
    cartTotalPrice.innerHTML = `TOTAL PRICE: 0$ ---- TOTAL QUANTITY: 0`;
    alert('Thank You for your Purchase')
})

const getBooksFromDB = () => {
    fetch(myCartUrl, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        if (res.ok)
            return res.json();
        else
            throw res;
    }).then((resJson) => {
        const totalBooks = resJson;
        const booksFC = {};
        for (let i = 0; i < totalBooks.length; i++) {
            booksFC[totalBooks[i].title] = (booksFC[totalBooks[i].title] || 0) + 1;
        }
        const booksFCPrices = {};
        for (let i = 0; i < totalBooks.length; i++) {
            booksFCPrices[totalBooks[i].title] = totalBooks[i].price;
        }
        console.log(booksFC);
        console.log(booksFCPrices)
        console.log(totalBooks);
        for (let book in booksFC) {
            const bookTitle = document.createElement('div');
            bookTitle.className = "bookTitleInCart";
            bookTitle.innerHTML = book;
            cartBooks.appendChild(bookTitle);
            const bookPrice = document.createElement('div');
            bookPrice.className = "bookPriceInCart";
            cartPrices.appendChild(bookPrice)
            const bookQuantity = document.createElement('div');
            bookQuantity.className = "bookQuantityInCart";
            bookQuantity.innerHTML = booksFC[book];
            cartQuantity.appendChild(bookQuantity)
            bookPrice.innerHTML = booksFCPrices[book] * booksFC[book];
            const bookOptions = document.createElement('div')
            bookOptions.className = "bookOptionsInCart";
            cartOptions.appendChild(bookOptions)
            bookOptions.innerHTML = '+    -    x'
            totalPrice += booksFCPrices[book] * booksFC[book];
            totalQuantity += booksFC[book];
        }
        cartTotalPrice.innerHTML = `TOTAL PRICE: ${totalPrice}$ ---- TOTAL QUANTITY: ${totalQuantity}`

        // for (let book of totalBooks) {
        //     const enteredBooks = [];
        //     totalPrice += book.price;
        //     totalQuantity++;
        //     const bookTitle = document.createElement('div');
        //     bookTitle.className = "bookTitleInCart";
        //     bookTitle.innerHTML = book.title;
        //     enteredBooks.push(bookTitle);
        //     cartBooks.appendChild(bookTitle);
        //     const bookPrice = document.createElement('div');
        //     bookPrice.className = "bookPriceInCart";
        //     bookPrice.innerHTML = book.price;
        //     cartPrices.appendChild(bookPrice)
        //     const bookQuantity = document.createElement('div');
        //     bookQuantity.className = "bookQuantityInCart";
        //     bookQuantity.innerHTML = 1
        // }


    }).catch((err) => {
        console.log(err)
        alert(err)
    })
}
getBooksFromDB();