// Database of Products
const products = [
    { id: 1, category: 'Apparel', title: 'Classic Cotton T-Shirt', price: 29.00, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80', desc: 'Premium cotton t-shirt for everyday wear.' },
    { id: 2, category: 'Apparel', title: 'Premium Leather Jacket', price: 199.00, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80', desc: 'Sleek leather jacket for all seasons.' },
    { id: 3, category: 'Footwear', title: 'Ultralight Sneakers', price: 89.00, img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=500&q=80', desc: 'Run faster, jump higher with ultra-light technology.' },
    { id: 4, category: 'Accessories', title: 'Minimalist Smartwatch', price: 149.00, img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=500&q=80', desc: 'Track your fitness in style.' },
    { id: 5, category: 'Footwear', title: 'Sport Running Shoes', price: 99.00, img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=500&q=80', desc: 'Durable and comfortable sports shoes.' },
    { id: 6, category: 'Apparel', title: 'Casual Denim Shirt', price: 45.00, img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=80', desc: 'A classic denim look for any casual occasion.' },
    { id: 7, category: 'Electronics', title: 'Raspberry Pi 5 (8GB)', price: 80.00, img: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=500&q=80', desc: 'The latest iteration of the popular single-board computer. Faster and more powerful than ever.' },
    { id: 8, category: 'Electronics', title: 'Raspberry Pi 4 Model B', price: 55.00, img: 'https://images.unsplash.com/photo-1587302912306-cf1ed9c33146?auto=format&fit=crop&w=500&q=80', desc: 'Versatile mini PC for all your DIY projects and coding adventures.' },
    { id: 9, category: 'Electronics', title: 'Raspberry Pi Case & Fan', price: 15.00, img: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=500&q=80', desc: 'Keep your Pi cool and protected with this official case and active cooler.' }
];

const categories = [
    { name: 'All', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80' },
    { name: 'Apparel', img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80' },
    { name: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80' },
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80' }
];

let cart = [];
let currentCategory = 'All';

// Elements
const productContainer = document.getElementById('product-container');
const categoryContainer = document.getElementById('category-container');
const cartCountElement = document.querySelector('.cart-count');
const toast = document.getElementById('toast');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Render Categories
function renderCategories() {
    categoryContainer.innerHTML = '';
    categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = `category-card ${currentCategory === cat.name ? 'active' : ''}`;
        div.innerHTML = `
            <img src="${cat.img}" alt="${cat.name}">
            <div class="category-info">
                <h3>${cat.name}</h3>
            </div>
        `;
        div.addEventListener('click', () => {
            currentCategory = cat.name;
            renderCategories(); // Update active class
            renderProducts();
        });
        categoryContainer.appendChild(div);
    });
}

// Render Products
function renderProducts() {
    productContainer.innerHTML = '';
    const filteredProducts = currentCategory === 'All' 
        ? products 
        : products.filter(p => p.category === currentCategory);

    filteredProducts.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <div class="product-image">
                <img src="${product.img}" alt="${product.title}">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="btn btn-secondary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        // Modal Event
        div.addEventListener('click', () => openModal(product));
        
        // Add to Cart Event
        const addBtn = div.querySelector('.add-to-cart');
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product);
        });

        productContainer.appendChild(div);
    });
}

// Cart Logic
function addToCart(product) {
    cart.push(product);
    updateCartUI();
    showToast();
}

function updateCartUI() {
    // Update Badge
    cartCountElement.textContent = cart.length;
    cartCountElement.style.transition = 'transform 0.2s ease';
    cartCountElement.style.transform = 'scale(1.5)';
    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 200);

    // Update Sidebar items
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.title}">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Toast
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Sidebar Cart Toggle
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.getElementById('close-cart');

cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('open');
});

closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// Modal Functionality
const modal = document.getElementById('product-modal');
const closeModal = document.querySelector('.close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDesc = document.querySelector('.modal-desc');
const modalAddToCart = document.querySelector('.modal-add-to-cart');
let currentModalProduct = null;

function openModal(product) {
    currentModalProduct = product;
    modalImg.src = product.img;
    modalTitle.textContent = product.title;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modalDesc.textContent = product.desc;
    modal.classList.add('show');
}

closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

modalAddToCart.addEventListener('click', () => {
    if (currentModalProduct) {
        addToCart(currentModalProduct);
    }
});

// Initialize App
renderCategories();
renderProducts();
