
// LOCAL STORE - PRODUCT DATA

const products = [
    { id: 1, name: "Fresh Apples", category: "Fruits", price: 120, unit: "1 kg", icon: "🍎", badge: "Fresh" },
    { id: 2, name: "Bananas", category: "Fruits", price: 50, unit: "1 dozen", icon: "🍌", badge: "Popular" },
    { id: 3, name: "Oranges", category: "Fruits", price: 80, unit: "1 kg", icon: "🍊", badge: "Fresh" },
    { id: 4, name: "Fresh Grapes", category: "Fruits", price: 90, unit: "500 g", icon: "🍇", badge: "Fresh" },

    { id: 5, name: "Tomatoes", category: "Vegetables", price: 35, unit: "1 kg", icon: "🍅", badge: "Daily Pick" },
    { id: 6, name: "Potatoes", category: "Vegetables", price: 30, unit: "1 kg", icon: "🥔", badge: "Popular" },
    { id: 7, name: "Broccoli", category: "Vegetables", price: 60, unit: "1 piece", icon: "🥦", badge: "Fresh" },
    { id: 8, name: "Carrots", category: "Vegetables", price: 45, unit: "1 kg", icon: "🥕", badge: "Fresh" },

    { id: 9, name: "Fresh Milk", category: "Dairy", price: 30, unit: "500 ml", icon: "🥛", badge: "Daily Pick" },
    { id: 10, name: "Butter", category: "Dairy", price: 55, unit: "100 g", icon: "🧈", badge: "Popular" },
    { id: 11, name: "Cheese", category: "Dairy", price: 95, unit: "200 g", icon: "🧀", badge: "Fresh" },

    { id: 12, name: "White Bread", category: "Bakery", price: 40, unit: "1 pack", icon: "🍞", badge: "Fresh" },
    { id: 13, name: "Croissant", category: "Bakery", price: 60, unit: "2 pieces", icon: "🥐", badge: "Popular" },

    { id: 14, name: "Basmati Rice", category: "Grocery", price: 90, unit: "1 kg", icon: "🍚", badge: "Popular" },
    { id: 15, name: "Cooking Oil", category: "Grocery", price: 145, unit: "1 litre", icon: "🫗", badge: "Daily Pick" },
    { id: 16, name: "Sugar", category: "Grocery", price: 45, unit: "1 kg", icon: "🍬", badge: "Daily Pick" }
];

let cart = [];
let selectedCategory = "All";

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const noProducts = document.getElementById("noProducts");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");

const checkoutModal = document.getElementById("checkoutModal");
const successModal = document.getElementById("successModal");

// Show products on the page
function displayProducts() {
    const searchText = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        const categoryMatch =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchMatch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return categoryMatch && searchMatch;
    });

    productGrid.innerHTML = "";
    noProducts.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-image";

        const emoji = document.createElement("span");
        emoji.textContent = product.icon;

        const badge = document.createElement("span");
        badge.className = "product-badge";
        badge.textContent = product.badge;

        image.append(emoji, badge);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("span");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const unit = document.createElement("p");
        unit.className = "product-unit";
        unit.textContent = product.unit;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = "₹" + product.price;

        const addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.textContent = "+ Add";
        addButton.addEventListener("click", () => addToCart(product.id));

        bottom.append(price, addButton);
        info.append(category, name, unit, bottom);
        card.append(image, info);
        productGrid.appendChild(card);
    });
}

// Category buttons
document.querySelectorAll(".category-card").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category-card.active")
            ?.classList.remove("active");

        button.classList.add("active");
        selectedCategory = button.dataset.category;
        displayProducts();
    });
});

// Search products
searchInput.addEventListener("input", displayProducts);

// Add product to cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(item => item.id === productId);
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    openCart();
}

// Change quantity
function changeQuantity(productId, change) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
}

// Calculate totals
function getTotals() {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 30;

    return {
        subtotal,
        delivery,
        total: subtotal + delivery
    };
}

// Show cart
function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-cart";
        empty.textContent = "🛒 Your cart is empty. Add some fresh products!";
        cartItems.appendChild(empty);
    } else {
        cart.forEach(item => {
            const row = document.createElement("div");
            row.className = "cart-item";

            const icon = document.createElement("div");
            icon.className = "cart-item-icon";
            icon.textContent = item.icon;

            const details = document.createElement("div");

            const title = document.createElement("h4");
            title.textContent = item.name;

            const unit = document.createElement("small");
            unit.textContent = "₹" + item.price + " / " + item.unit;

            const quantity = document.createElement("div");
            quantity.className = "quantity";

            const minus = document.createElement("button");
            minus.textContent = "−";
            minus.setAttribute("aria-label", "Decrease quantity");
            minus.addEventListener("click", () => changeQuantity(item.id, -1));

            const number = document.createElement("span");
            number.textContent = item.quantity;

            const plus = document.createElement("button");
            plus.textContent = "+";
            plus.setAttribute("aria-label", "Increase quantity");
            plus.addEventListener("click", () => changeQuantity(item.id, 1));

            quantity.append(minus, number, plus);
            details.append(title, unit, quantity);

            const lineTotal = document.createElement("strong");
            lineTotal.textContent = "₹" + (item.price * item.quantity);

            row.append(icon, details, lineTotal);
            cartItems.appendChild(row);
        });
    }

    const totals = getTotals();

    document.getElementById("subtotal").textContent = "₹" + totals.subtotal;
    document.getElementById("delivery").textContent =
        totals.delivery === 0 ? (totals.subtotal === 0 ? "₹0" : "FREE") :
        "₹" + totals.delivery;
    document.getElementById("total").textContent = "₹" + totals.total;
    document.getElementById("checkoutTotal").textContent = "₹" + totals.total;
}

// Open and close cart
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("show");
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("show");
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Open checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Please add products to your cart first.");
        return;
    }

    closeCart();
    checkoutModal.classList.add("show");
});

document.getElementById("closeCheckout").addEventListener("click", () => {
    checkoutModal.classList.remove("show");
});

// Place order - Demo only
document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const payment = document.getElementById("paymentMethod").value;

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const totals = getTotals();

    const orderLines = cart.map(item =>
        `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
    );

    const orderDetails = [
        "Customer: " + name,
        "Mobile: " + phone,
        "Address: " + address,
        "",
        "Products:",
        ...orderLines,
        "",
        "Payment: " + payment,
        "Order Total: ₹" + totals.total
    ].join("\n");

    // This is a demo confirmation, not a real order submission.
    document.getElementById("successMessage").textContent =
        "Thank you, " + name + "! Your demo order details have been prepared. " +
        "Payment selected: " + payment + ". Total: ₹" + totals.total +
        ". No real order or payment has been submitted.";

    console.log("Demo order details:\n" + orderDetails);

    checkoutModal.classList.remove("show");
    successModal.classList.add("show");

    cart = [];
    renderCart();
    document.getElementById("checkoutForm").reset();
});

// Finish order
document.getElementById("finishOrder").addEventListener("click", () => {
    successModal.classList.remove("show");
    document.getElementById("home").scrollIntoView();
});

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
    });
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Initial load
displayProducts();
renderCart();
