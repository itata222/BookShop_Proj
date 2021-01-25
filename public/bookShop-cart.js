const cartBooks = document.getElementById('cart-books')
const cartQuantity = document.getElementById('cart-quantity')
const cartOptions = document.getElementById('cart-options')

const cartPayButton = document.getElementById('cart-payButton');

cartPayButton.addEventListener('click', (event) => {
    event.preventDefault();
    alert('Thank You for your Purchase')
    while (cartBooks.children.length > 0)
        cartBooks.removeChild(cartBooks.lastChild)
    while (cartQuantity.children.length > 0)
        cartQuantity.removeChild(cartQuantity.lastChild)
    while (cartOptions.children.length > 0)
        cartOptions.removeChild(cartOptions.lastChild)
})