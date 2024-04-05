let navbar = document.querySelector(".navbar");
let searchForm = document.querySelector(".search-form");
let cartItem = document.querySelector(".cart-items-container");
document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
  cartItem.classList.remove("active");
};
document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  navbar.classList.remove("active");
  cartItem.classList.remove("active");
};
document.querySelector("#cart-btn").onclick = () => {
  cartItem.classList.toggle("active");
  navbar.classList.remove("active");
  searchForm.classList.remove("active");
};
// Define myData with your actual data
// const myData = {
//   merchant_id: "10033177",
//   merchant_key: "p67vrkpp4x7ba",
//   return_url: "https://www.example.com/success",
//   cancel_url: "https://www.example.com/cancel",
//   notify_url: "https://www.example.com/notify",
//   name_first: "First Name",
//   name_last: "Last Name",
//   email_address: "test@test.com",
//   m_payment_id: "01AB",
//   amount: "100.00",
//   item_name: "boby",
//   passphrase: "f103e22c0418655fb03991538c51bfd5",
//   // Add other necessary data here
// };
// Function to generate the payment form
// const createPaymentForm = () => {
//   const form = document.createElement("form");
//   form.action = "https://sandbox.payfast.co.za/eng/process";
//   form.method = "post";
//   for (const key in myData) {
//     if (myData.hasOwnProperty(key)) {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = key;
//       input.value = myData[key];
//       form.appendChild(input);
//     }
//   }
//   document.getElementById("paymentFormContainer").appendChild(form);
//   return form;
// };
// Function to generate the signature
// const generateSignature = async () => {
//   try {
//     const response = await fetch("http://localhost:3000/hashData", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(myData),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to generate signature");
//     }
//     const data = await response.json();
//     myData["signature"] = data.signature;
//     console.log("Signature generated:", data.signature);
//   } catch (error) {
//     console.error("Error generating signature:", error.message);
//   }
// };
// // Call the function to generate the signature and create payment form
// const initializePayment = async () => {
//   await generateSignature();
//   createPaymentForm();
// };
// initializePayment();
// Change functionality of Checkout button to submit the form
// Define myData outside the event listener
const myData = {
    merchant_id: "10033177",
    merchant_key: "p67vrkpp4x7ba",
    return_url: "https://www.example.com/success",
    cancel_url: "https://www.example.com/cancel",
    notify_url: "https://www.example.com/notify",
    name_first: "First Name",
    name_last: "Last Name",
    email_address: "test@test.com",
    m_payment_id: "01AB",
    amount: "100.00",
    item_name: "boby",
    passphrase: "f103e22c0418655fb03991538c51bfd5",
    // Add other necessary data here
   };
   
   // Function to generate the signature
   const generateSignature = async () => {
    try {
       const response = await fetch("http://localhost:3000/hashData", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(myData),
       });
       if (!response.ok) {
         throw new Error("Failed to generate signature");
       }
       const data = await response.json();
       myData["signature"] = data.signature;
       console.log("Signature generated:", data.signature);
    } catch (error) {
       console.error("Error generating signature:", error.message);
    }
   };
   
   // Function to generate the payment form
   const createPaymentForm = () => {
    // Create the form element
    const form = document.createElement("form");
    form.action = "https://sandbox.payfast.co.za/eng/process";
    form.method = "post";
    form.style.display = "none";
  
    for (const key in myData) {
      if (myData.hasOwnProperty(key)) {
        const value = myData[key];
        if (value !== "") {
          // Create an input element for each key-value pair in myData
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value.trim();
          // Append the input to the form
          form.appendChild(input);
        }
      }
    }
  
    // Append the form to the body
    console.log(document.body.appendChild(form));
  };
  const submitPaymentForm = () => {
    // Find the form element
    const form = document.querySelector("form[action='https://sandbox.payfast.co.za/eng/process']");
    if (form) {
        // Submit the form
        form.submit();
    }
};


   // Event listener for the checkout button
   const checkoutButton = document.querySelector(".btn-checkout");
   checkoutButton.textContent = "Checkout";
   checkoutButton.addEventListener("click", async function (event) {
    console.log("hey i have been pressed");
    // You can modify myData here if needed before generating the signature
    await generateSignature();
  // Call the createPaymentForm function to create the form
createPaymentForm();
    
// Call the submitPaymentForm function to submit the form
submitPaymentForm();
   });
   
window.onscroll = () => {
  navbar.classList.remove("active");
  searchForm.classList.remove("active");
  cartItem.classList.remove("active");
};
// Function to clear cart items
function clearCartItems() {
  // Select all cart items except the checkout button
  let cartItems = document.querySelectorAll(
    ".cart-items-container .cart-item:not(:last-child)"
  );
  // Remove each cart item except the last one (which is the checkout button)
  cartItems.forEach((item) => {
    item.remove();
  });
}
// Function to add to cart
function addToCart(imageSrc, productName, price) {
  // Create new cart item element
  let cartItemElement = document.createElement("div");
  cartItemElement.classList.add("cart-item");
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
  document.querySelector(".cart-items-container").appendChild(cartItemElement);
  // Update cart count
  updateCartCount();
  // Calculate total and display in the cart
  updateCartTotal(); // Call the function to update the total
}
// Function to update cart count
function updateCartCount() {
  let cartItemsCount = document.querySelectorAll(
    ".cart-items-container .cart-item"
  ).length;
  // Update cart count display
  document.querySelector("#cart-count").innerText = cartItemsCount;
}
// Function to update cart total
function updateCartTotal() {
  let cartItems = document.querySelectorAll(
    ".cart-items-container .cart-item:not(:last-child)"
  );
  let total = 0;
  // Loop through each cart item
  cartItems.forEach((item) => {
    let priceString = item.querySelector(".price").textContent;
    // Extract numerical value from the price string using regex
    let matches = priceString.match(/[\d.]+/);
    if (matches && matches.length > 0) {
      let price = parseFloat(matches[0]);
      total += price;
    }
  });
  // Calculate the total amount to be paid based on the number of products in the cart
  let cartItemCount = cartItems.length;
  let discount = 0; // Assuming no discount initially
  if (cartItemCount >= 2) {
    // Apply a discount if there are 2 or more products in the cart
    discount = total * 0.1; // 10% discount
  }
  // Calculate the total amount to be paid after applying the discount
  let totalAmountToBePaid = total - discount;
  // Display the total amount to be paid in the cart with 'R' symbol for Rands
  document.querySelector(
    "#cart-total"
  ).innerText = `Total: R${totalAmountToBePaid.toFixed(2)}`;
}
// Example usage
document.querySelectorAll(".btn-cart").forEach((button) => {
  button.addEventListener("click", function () {
    let productContainer = this.parentElement;
    let imageSrc = productContainer.querySelector("img").src;
    let productName = productContainer.querySelector("h3").textContent;
    let price = productContainer.querySelector(".price").textContent;
    addToCart(imageSrc, productName, price);
  });
});
// Clear cart initially
clearCartItems();
updateCartTotal();
