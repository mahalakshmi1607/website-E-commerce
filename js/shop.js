const initShop = () => {
    const productGrid = document.getElementById('shop-product-grid');
    const categoryLinks = document.querySelectorAll('.category-filter-link');
    const sortSelect = document.getElementById('sort-select');
    const resultCount = document.getElementById('result-count');

    if (!productGrid) return; // Not on shop page

    let currentCategory = 'all';
    let currentSort = 'default';
    let searchQuery = '';

    // Parse URL parameters (Category and Search)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        currentCategory = categoryParam.toLowerCase();
    }
    const searchParam = urlParams.get('search');
    if (searchParam) {
        searchQuery = searchParam.toLowerCase();
    }

    function renderProducts() {
        // Filter by category
        let filtered = window.GlobalProducts || [];
        if (currentCategory !== 'all') {
            filtered = filtered.filter(p => p.category === currentCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(searchQuery) || 
                p.category.toLowerCase().includes(searchQuery)
            );
        }

        // Sort
        if (currentSort === 'low-high') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'high-low') {
            filtered.sort((a, b) => b.price - a.price);
        }

        // Render HTML
        productGrid.innerHTML = '';
        if (filtered.length === 0) {
            productGrid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No products found matching your criteria.</p>';
            resultCount.textContent = 'Showing 0 results';
            return;
        }

        resultCount.textContent = `Showing 1-${filtered.length} of ${filtered.length} results`;

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-actions">
                        <button class="action-btn wishlist-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}"><i class="far fa-heart"></i></button>
                        <a href="product.html?id=${product.id}" class="action-btn"><i class="far fa-eye"></i></a>
                    </div>
                </div>
                <div class="product-details">
                    <span class="product-category" style="text-transform: capitalize;">${product.category}</span>
                    <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
                    <div class="product-rating" style="color: var(--warning); margin-bottom: 0.5rem; font-size: 0.9rem;">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                        ${product.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </div>
                    <div class="product-price-box">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="btn btn-outline add-cart-btn mt-auto" style="width: 100%;" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(card);
        });
        
        // Update Active Category styling in sidebar
        categoryLinks.forEach(link => {
            if (link.dataset.category === currentCategory) {
                link.style.color = 'var(--primary)';
                link.style.fontWeight = '700';
            } else {
                link.style.color = 'inherit';
                link.style.fontWeight = 'normal';
            }
        });
    }

    // Event Listeners for Sidebar Category Filters (using link closed-over scope instead of e.target for absolute stability)
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = link.dataset.category;
            // Clear any active search query when changing categories to avoid empty results
            searchQuery = '';
            const shopSearchBar = document.querySelector('.search-bar input');
            if (shopSearchBar) shopSearchBar.value = '';
            
            // Update URL without reloading
            const newUrl = currentCategory === 'all' ? 'shop.html' : `shop.html?category=${currentCategory}`;
            window.history.pushState({}, '', newUrl);
            renderProducts();
        });
    });

    // Real-time filtering in search bar (if on the shop page)
    const shopSearchBar = document.querySelector('.search-bar input');
    if (shopSearchBar) {
        if (searchQuery) {
            shopSearchBar.value = searchQuery;
        }
        shopSearchBar.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderProducts();
        });
    }

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    // Initial render
    renderProducts();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShop);
} else {
    initShop();
}
