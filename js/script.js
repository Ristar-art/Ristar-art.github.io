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
    // passphrase: "f103e22c0418655fb03991538c51bfd5",
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
       console.log("data.signature is ",data.signature)
       myData["signature"] = data.signature;
     
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
    console.log('form is ', form)
    if (form) {
        // Submit the form
        form.submit();
    }
};


   // Event listener for the checkout button
   const checkoutButton = document.querySelector(".btn-checkout");
   checkoutButton.textContent = "Checkout";
   checkoutButton.addEventListener("click", async function (event) {
   
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

// Define the array of boxes
const boxes = [
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",

        price: 200,
        // discountPrice: 170,
    },
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",
        price: 220,
    },
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",
        price: 120,
    },
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",
        price: 100,
    },
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",
        price: 250,
    },
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",
        price: 150,
    },
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",
        price: 300,
    },
    {
        imgSrc: "../images/product.jpg",
        title: "Stylish cap",
        price: 400,
    },
    // Add more boxes as needed
];

// Function to create a box element
const createBox = (box) => {
    const boxElement = document.createElement('div');
    boxElement.className = 'box';

    const img = document.createElement('img');
    img.src = box.imgSrc;
    boxElement.appendChild(img);

    const h3 = document.createElement('h3');
    h3.textContent = box.title;
    boxElement.appendChild(h3);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent =  box.price;
    if (box.discountPrice) {
        const discountPrice = document.createElement('span');
        discountPrice.textContent = box.discountPrice;
        price.appendChild(discountPrice);
    }
    boxElement.appendChild(price);

    const btnCart = document.createElement('a');
    btnCart.href = '#';
    btnCart.className = 'btn-cart';
    btnCart.textContent = 'add to cart';
    boxElement.appendChild(btnCart);

    return boxElement;
};

// Get the box container
const boxContainer = document.querySelector('.box-container');

// Populate the box container with the boxes
boxes.forEach(box => {
    const boxElement = createBox(box);
    boxContainer.appendChild(boxElement);
});

function removeFromCart(event) {
    // Remove the item from the cartItems array
    let indexToRemove = event.target.parentElement.querySelector("h3").textContent;
    cartItems = cartItems.filter(item => item.productName !== indexToRemove);
    // Remove the cart item element from the DOM
    event.target.parentElement.remove();
    // Update cart count
    updateCartCount();
    // Update cart total
    updateCartTotal();
  }

  // Define an array to keep track of items in the cart
  let cartItems = [];
  
  // Function to update cart count
function updateCartCount() {
    let cartItemsCount = document.querySelectorAll(".cart-items-container .cart-item").length;
  
    // Update cart count display
    let cartCountElement = document.querySelector("#cart-count");
    if (cartCountElement) {
      cartCountElement.innerText = cartItemsCount;
    } else {
      console.log('Element with id "cart-count" not found');
    }
  }
  // Function to add to cart
 
function addToCart(imageSrc, productName, price) {
  // Push the item to the cartItems array
  cartItems.push({ productName: productName, price: price });

  // Create new cart item element
  let cartItemElement = document.createElement("div");
  cartItemElement.classList.add("cart-item");
  // Set inner HTML of the cart item
  cartItemElement.innerHTML = `
        <span class="fas fa-times" onclick="removeFromCart(event)"></span>
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
  myData.amount = totalAmount.toFixed(2);
  myData.item_name = productName;
  console.log("totalAmount.toFixed(2) is ",totalAmount.toFixed(2))
}

  
let totalAmount = 0; // Define a variable to hold the total amount

// Function to update cart total
function updateCartTotal() {
  let total = 0;
  cartItems.forEach((item) => {
    const itemPrice = Number(item.price);
    if (isNaN(itemPrice)) {
      console.error(`Item price is not a valid number: ${item.price}`);
      return;
    }
    total += itemPrice;
  });

  // Ensure total is initialized as a number
  if (typeof total !== 'number' || isNaN(total)) {
    console.error('Total is not a valid number:', total);
    return;
  }

  // Update cart total display
  let cartTotalElement = document.querySelector("#cart-total");
  if (cartTotalElement) {
    cartTotalElement.innerText = 'R' + total.toFixed(2); // Display total with two decimal places
    totalAmount = total; // Store the total amount in the variable
    console.log('totalPrice is ', total.toFixed(2))
  } else {
    console.log('Element with id "cart-total" not found');
  }
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


// this is for Ozow
const ozowData={
   siteCode : "ATL-ATL-008",
   countryCode : "ZA",
   currencyCode :"ZAR",
   amount : 25.01,
   transactionReference : "123",
   bankReference : "ABC123",
   cancelUrl : "http://mydomain.com/cancel.html",
   errorUrl : "http://mydomain.com/error.html",
   successUrl : "http://mydomain.com/success.html",
   notifyUrl : "http://mydomain/notify.html",
}
const generateHashSignature = async () => {
  try {
     const response = await fetch("http://localhost:3000/RequestHash", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",        
       },
       body: JSON.stringify(ozowData),
     });
     if (!response.ok) {
       throw new Error("Failed to generate signature");
     }
     const data = await response.json();
     console.log(" ozow data.signature is ",data.signature)
     ozowData["signature"] = data.signature;
   
  } catch (error) {
     console.error("Error generating signature:", error.message);
  }
 };
 generateHashSignature()
//  'Authorization': `Bearer ${"2d252f05ad694119becccb190574bbc9"}` // Assuming the API uses Bearer token