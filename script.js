const products = [
  { id: 1, name: 'Kaju Katli', price: 600 },
  { id: 2, name: 'Rasgulla', price: 250 },
  { id: 3, name: 'Gulab Jamun', price: 300 }
];

const cart = [];

const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Display products
products.forEach(product => {
  const card = document.createElement('div');
  card.classList.add('product-card');
  card.innerHTML = `
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  productList.appendChild(card);
});

// Add to cart with quantity tracking
function addToCart(id) {
  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    if (product) cart.push({ ...product, qty: 1 });
  }
  updateCart();
}

// Update cart display
function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - ₹${item.price} x${item.qty} = ₹${item.price * item.qty}
      <button onclick="changeQty(${item.id}, 1)">+</button>
      <button onclick="changeQty(${item.id}, -1)">-</button>
      <button onclick="removeItem(${item.id})">🗑️</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
  });

  cartTotal.textContent = total;
}

// Quantity change
function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeItem(id);
    }
    updateCart();
  }
}

// Remove item
function removeItem(id) {
  const index = cart.findIndex(p => p.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
    updateCart();
  }
}

// PLACE ORDER CODE
const placeOrderBtn = document.getElementById('place-order');
const orderMessage = document.getElementById('order-message');

placeOrderBtn.addEventListener('click', function () {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();

  if (cart.length === 0) {
    orderMessage.textContent = "Your cart is empty!";
    orderMessage.style.color = "red";
    return;
  }

  if (name === "" || phone.length !== 10 || isNaN(phone)) {
    orderMessage.textContent = "Please enter valid name and 10-digit phone number.";
    orderMessage.style.color = "red";
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const orderData = {
    customerName: name,
    customerPhone: phone,
    items: cart.map(item => ({
      name: item.name,
      price: item.price,
      qty: item.qty
    })),
    total,
    timestamp: new Date().toISOString()
  };

  // Save order to backend
  fetch('http://localhost:3000/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
    .then(res => res.json())
    .then(data => {
      // WhatsApp message after saving to backend
      const itemsList = cart.map(item => `• ${item.name} x${item.qty} - ₹${item.price * item.qty}`).join('%0A');
      const message = `Order from ${name} (${phone}):%0A${itemsList}%0A%0ATotal: ₹${total}`;
      const shopNumber = "8269040738";
      const whatsappURL = `https://wa.me/${shopNumber}?text=${message}`;

      cart.length = 0;
      updateCart();

      window.open(whatsappURL, '_blank');
      orderMessage.textContent = "Redirecting to WhatsApp...";
      orderMessage.style.color = "green";
    })
    .catch(err => {
      console.error('Order save failed:', err);
      orderMessage.textContent = "Error saving order. Try again.";
      orderMessage.style.color = "red";
    });
});
