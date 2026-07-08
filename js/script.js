// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Initialize Hamburger Menu
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });
}

// Global Toast Function
window.showToast = function(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Back to Top functionality
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'btn btn-primary';
backToTopBtn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; border-radius: 50%; width: 50px; height: 50px; display: none; z-index: 999; justify-content: center; align-items: center; font-size: 1.5rem; font-weight: bold; padding: 0; box-shadow: var(--shadow-lg);';
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Generic Search Bar Handler for all pages
const initSearch = () => {
    const searchBars = document.querySelectorAll('.search-bar');
    searchBars.forEach(bar => {
        const input = bar.querySelector('input');
        const btn = bar.querySelector('button');
        
        const performSearch = () => {
            const query = input.value.trim();
            if (query) {
                window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
            }
        };

        if (input && btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                performSearch();
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                }
            });
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}

// Generic Quantity Selector Event Delegation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-plus') || e.target.classList.contains('qty-minus')) {
        const wrapper = e.target.closest('.qty-selector');
        if (wrapper) {
            const input = wrapper.querySelector('.qty-input');
            if (input) {
                let val = parseInt(input.value) || 1;
                if (e.target.classList.contains('qty-plus')) {
                    val++;
                } else if (e.target.classList.contains('qty-minus') && val > 1) {
                    val--;
                }
                input.value = val;
                
                // Update dataset quantity of adjacent add-cart-btn if exists
                const addBtn = wrapper.parentElement.querySelector('.add-cart-btn');
                if (addBtn) {
                    addBtn.dataset.quantity = val;
                }
            }
        }
    }
});

// Flash Sale Countdown Timer
const initCountdown = () => {
    const countdownContainer = document.getElementById('countdown');
    if (countdownContainer) {
        let targetTime = localStorage.getItem('flash_sale_target');
        if (!targetTime) {
            targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('flash_sale_target', targetTime);
        } else {
            targetTime = parseInt(targetTime);
            if (new Date().getTime() > targetTime) {
                targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
                localStorage.setItem('flash_sale_target', targetTime);
            }
        }

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference <= 0) {
                countdownContainer.innerHTML = '<span>Sale Ended!</span>';
                clearInterval(timerInterval);
                return;
            }

            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            countdownContainer.innerHTML = `
                <span>${hours.toString().padStart(2, '0')}h</span> : 
                <span>${minutes.toString().padStart(2, '0')}m</span> : 
                <span>${seconds.toString().padStart(2, '0')}s</span>
            `;
        };

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdown);
} else {
    initCountdown();
}

