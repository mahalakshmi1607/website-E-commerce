// LocalStorage Cart Logic
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('ecommerce_cart')) || [];
        this.updateBadge();
    }

    save() {
        localStorage.setItem('ecommerce_cart', JSON.stringify(this.items));
        this.updateBadge();
    }

    add(product, qty = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            this.items.push({ ...product, quantity: qty });
        }
        this.save();
        if (window.showToast) window.showToast('Added to Cart!');
    }

    remove(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) this.remove(id);
        }
        this.save();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        badges.forEach(badge => badge.textContent = count);
    }
}

// Global instance
window.CartManager = new Cart();

// Event delegation for Add To Cart buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.add-cart-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.add-cart-btn');
        const qty = parseInt(btn.dataset.quantity) || 1;
        const productData = {
            id: btn.dataset.id,
            title: btn.dataset.title,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image
        };
        window.CartManager.add(productData, qty);
    }
});
