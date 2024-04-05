let navbar = document.querySelector('.navbar');
let searchForm = document.querySelector('.search-form');
let cartItem = document.querySelector('.cart-items-container');
document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}
document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
    cartItem.classList.remove('active');
}
document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}
window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}
// Function to clear cart items
function clearCartItems() {
    // Select all cart items except the checkout button
    let cartItems = document.querySelectorAll('.cart-items-container .cart-item:not(:last-child)');
    // Remove each cart item except the last one (which is the checkout button)
    cartItems.forEach(item => {
        item.remove();
    });
}
// Function to add to cart
function addToCart(imageSrc, productName, price) {
    clearCartItems(); // Clear the cart before adding new items
    // Create new cart item element
    let cartItemElement = document.createElement('div');
    cartItemElement.classList.add('cart-item');
    // Set inner HTML of the cart item
    cartItemElement.innerHTML = `
        <span class="fas fa-times"></span>
        <img src="${imageSrc}" alt="${productName}">
        <div class="content">
            <h3>${productName}</h3>
            <div class="price">${price}</div>
        </div>
    `;
    // Append the cart item element to the cart container
    cartItem.appendChild(cartItemElement);
}
// Example usage
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        let productContainer = this.parentElement;
        let imageSrc = productContainer.querySelector('img').src;
        let productName = productContainer.querySelector('h3').textContent;
        let price = productContainer.querySelector('.price').textContent;
        addToCart(imageSrc, productName, price);
    });
});



