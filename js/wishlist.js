// LocalStorage Wishlist Logic
class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('ecommerce_wishlist')) || [];
        this.updateBadge();
    }

    save() {
        localStorage.setItem('ecommerce_wishlist', JSON.stringify(this.items));
        this.updateBadge();
    }

    toggle(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index > -1) {
            this.items.splice(index, 1);
            if (window.showToast) window.showToast('Removed from Wishlist!');
        } else {
            this.items.push(product);
            if (window.showToast) window.showToast('Added to Wishlist!');
        }
        this.save();
    }

    updateBadge() {
        const badges = document.querySelectorAll('.wishlist-badge');
        badges.forEach(badge => badge.textContent = this.items.length);
    }
    
    isInWishlist(id) {
        return this.items.some(item => item.id === id);
    }
}

// Global instance
window.WishlistManager = new Wishlist();

// Event delegation for Wishlist buttons
document.addEventListener('click', (e) => {
    if (e.target.closest('.wishlist-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.wishlist-btn');
        const productData = {
            id: btn.dataset.id,
            title: btn.dataset.title,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image
        };
        window.WishlistManager.toggle(productData);
        
        // Toggle icon visual
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            if(icon.classList.contains('fas')) {
                icon.style.color = 'var(--secondary)';
            } else {
                icon.style.color = '';
            }
        }
    }
});
