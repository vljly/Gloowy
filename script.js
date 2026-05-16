document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
    });

    // 2. Scroll-triggered Reveal Animations
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const observer = new IntersectionObserver(revealCallback, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 3. Close mobile menu on click link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('open'); // Also close hamburger icon
        });
    });

    // 4. Form Validation & Data Collection
    const contactForm = document.getElementById('gloowy-contact-form');
    const formMessage = document.getElementById('form-message');
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxUMq_IO163J4DevA7gBHz2Bhmttyu1sgQ7q7ymBoQwS0bvjOsrshQbElG-HMcgpTnFsQ/exec'; 

    const showMessage = (text, type) => {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.style.color = type === 'success' ? '#D9D9D9' : '#F5F0EB';
        formMessage.classList.remove('hidden');
        
        // Giữ trình duyệt ở lại vùng thông báo để không bị nhảy trang
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('btn-loading'); // Thêm hiệu ứng xoay tròn
            }
            
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            const phone = data['phone'];
            const phoneRegex = /^\d+$/; // Regex để kiểm tra chỉ chứa ký tự số

            // Kiểm tra số điện thoại
            if (!phoneRegex.test(phone)) {
                showMessage('Số điện thoại không hợp lệ. Vui lòng chỉ nhập số.', 'error');
                if (submitBtn) { // Đảm bảo nút không bị disabled nếu có lỗi
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-loading');
                }
                return; // Ngừng quá trình gửi form
            }

            const name = data['name'] || 'bạn';
            showMessage('Đang gửi thông tin...', 'info');

            fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(() => {
                showMessage(`Cảm ơn ${name}! Gloowy đã ghi nhận thông tin. Ưu đãi 15% đã sẵn sàng dành riêng cho bạn.`, 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Lỗi kết nối:', error);
                showMessage('Oops! Hình như có chút trục trặc mạng nhỏ. Bạn đợi vài giây rồi nhấn gửi lại giúp Gloowy nha.', 'error');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('btn-loading'); // Tắt hiệu ứng xoay tròn
                }
            });
        });
    }

    // 5. Create Random Sparkles for Hero Title
    const initSparkles = () => {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        for (let i = 0; i < 25; i++) { // Tăng số lượng hạt lấp lánh lên 25 hạt
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Vị trí ngẫu nhiên xung quanh tiêu đề
            sparkle.style.top = Math.random() * 40 + 10 + '%';
            sparkle.style.left = Math.random() * 80 + 10 + '%';
            
            // Thời gian và delay ngẫu nhiên
            const duration = 5 + Math.random() * 5; // Kéo dài thời gian lấp lánh để mượt mà hơn
            const delay = Math.random() * 5;
            sparkle.style.animation = `sparkle-anim ${duration}s ease-in-out ${delay}s infinite`;
            
            heroContent.appendChild(sparkle);
        }
    };
    initSparkles();

    // 6. Collection Filtering & Underline Logic
    const filterItems = document.querySelectorAll('.filter-item');
    const priceItems = document.querySelectorAll('.price-item');
    const productCards = document.querySelectorAll('.product-card');
    const underline = document.querySelector('.nav-underline');
    const viewAllBtn = document.getElementById('view-all-btn'); // The button element
    const viewAllBtnText = viewAllBtn.querySelector('span'); // The text inside the button
    const viewAllBtnArrow = viewAllBtn.querySelector('.view-more-arrow'); // The arrow SVG
    let currentCategory = 'all';
    let currentSearchTerm = '';
    let currentPriceRange = 'all';
    let currentSort = 'default'; // 'default', 'low-to-high', 'high-to-low'
    let isShowingAll = false; // Tracks if the "show all" state is active for the current category

    function updateUnderline() {
        const activeItem = document.querySelector('.filter-item.active');
        if (activeItem && underline) {
            underline.style.width = `${activeItem.clientWidth}px`;
            underline.style.left = `${activeItem.offsetLeft}px`;
        }
    }

    // Initial underline position
    window.addEventListener('load', updateUnderline);
    window.addEventListener('resize', updateUnderline);

    // Helper: Find category from navbar links or IDs
    function getCategoryFromId(id) {
        // Kiểm tra 'earrings' trước để không bị nhầm với 'rings'
        if (id.includes('earrings')) return 'earrings';
        if (id.includes('rings')) return 'rings';
        if (id.includes('bracelets')) return 'bracelets';
        return 'all';
    }

    // 7. Navbar Link Integration (Sửa lỗi điều hướng)
    document.querySelectorAll('.nav-links > li > a, .dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                // Chỉ can thiệp filter nếu là link liên quan đến Bộ sưu tập
                const isCollectionLink = href.includes('collection') || href === '#collections';

                if (isCollectionLink) {
                    e.preventDefault();
                    const category = getCategoryFromId(href);
                    
                    const targetFilter = document.querySelector(`.filter-item[data-category="${category}"]`);
                    if (targetFilter) {
                        targetFilter.click();
                        document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
                    }
                }
                // Nếu là các link khác (Trang chủ, Về chúng tôi, Liên hệ...), 
                // scroll-behavior: smooth trong CSS sẽ lo phần cuộn mượt.
            }
            
            // Đóng menu mobile sau khi nhấn vào bất kỳ liên kết nào
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            }
        });
    });

    // Function to handle revealing new cards and setting button state
    function revealNewCardsAndSetButtonState() {
        const isMobile = window.innerWidth <= 768;
        // Mobile: luôn hiện 4 | Desktop: Tất cả hiện 10, Danh mục hiện 5
        const limit = isMobile ? 4 : (currentCategory === 'all' ? 10 : 5);

        let totalInCategory = 0;
        let eligibleCards = [];

        productCards.forEach(card => {
            const matches = currentCategory === 'all' || card.getAttribute('data-category') === currentCategory;
            const productName = card.querySelector('h3').textContent.toLowerCase();
            const matchesSearch = productName.includes(currentSearchTerm.toLowerCase());

            if (matches && matchesSearch) {
                eligibleCards.push(card);
            }
        });

        totalInCategory = eligibleCards.length;

        const noResults = document.getElementById('no-results');
        if (totalInCategory === 0) {
            if (noResults) noResults.classList.remove('hidden');
            viewAllBtn.parentElement.style.display = 'none';
            return;
        } else {
            if (noResults) noResults.classList.add('hidden');
        }

        // Random hóa vị trí nếu ở tab "Tất cả" và không chọn sắp xếp giá
        if (currentCategory === 'all' && currentSort === 'default') {
            eligibleCards.forEach(card => card.style.order = Math.floor(Math.random() * 100));
            eligibleCards.sort((a, b) => parseInt(a.style.order) - parseInt(b.style.order));
        } else if (currentSort !== 'default') {
            // Sắp xếp theo giá (tự động lấy từ text hiển thị để đồng bộ khi bạn đổi giá ở HTML)
            eligibleCards.sort((a, b) => {
                const getPrice = (el) => parseInt(el.querySelector('.price').textContent.replace(/\D/g, '')) || 0;
                const priceA = getPrice(a);
                const priceB = getPrice(b);
                return currentSort === 'low-to-high' ? priceA - priceB : priceB - priceA;
            });
            eligibleCards.forEach((card, i) => card.style.order = i);
        } else {
            eligibleCards.forEach(card => card.style.order = '');
        }

        // Hiển thị sản phẩm dựa trên hạn mức
        eligibleCards.forEach((card, index) => {
            if (isShowingAll || index < limit) {
                card.classList.remove('hidden');
            setTimeout(() => {
                card.style.opacity = '1';
            }, 30 * index);
            }
        });

        // Update "View All" button state
        if (totalInCategory > limit) {
            viewAllBtn.parentElement.style.display = 'block';
            if (isShowingAll) {
                viewAllBtnText.textContent = 'Thu gọn';
                viewAllBtnArrow.style.transform = 'rotate(180deg)';
            } else {
                viewAllBtnText.textContent = 'Xem tất cả';
                viewAllBtnArrow.style.transform = 'rotate(0deg)';
            }
        } else {
            viewAllBtn.parentElement.style.display = 'none';
            // Reset button state when hidden
            viewAllBtnText.textContent = 'Xem tất cả';
            viewAllBtnArrow.style.transform = 'rotate(0deg)';
            isShowingAll = false; // Important: reset this when button is not needed
        }
    }

    function applyFilter() {
        // Simplified faster filtering logic
        productCards.forEach(card => {
            card.style.opacity = '0';
            card.classList.add('hidden');
        });

        // Small timeout to ensure display:none is applied before reveal starts
        setTimeout(revealNewCardsAndSetButtonState, 50);
    }

    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            filterItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            updateUnderline();
            
            currentCategory = item.getAttribute('data-category');
            isShowingAll = false; // Reset to "show limited" when category changes
            applyFilter();
        });
    });

    priceItems.forEach(item => {
        item.addEventListener('click', () => {
            priceItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            currentPriceRange = item.getAttribute('data-range');
            isShowingAll = false; 
            applyFilter();
        });
    });

    // Handle Price Sorting
    const sortBtn = document.getElementById('price-sort-btn');

    sortBtn.addEventListener('click', () => {
        sortBtn.classList.remove('sort-asc', 'sort-desc');

        if (currentSort === 'default') {
            currentSort = 'low-to-high';
            sortBtn.classList.add('sort-asc');
        } else if (currentSort === 'low-to-high') {
            currentSort = 'high-to-low';
            sortBtn.classList.add('sort-desc');
        } else {
            currentSort = 'default';
        }

        isShowingAll = false;
        applyFilter();
    });

    // Handle Search Input
    const searchInput = document.getElementById('search-input');
    const searchBox = document.querySelector('.search-box');
    const searchClear = document.getElementById('search-clear');
    
    if (searchBox && searchInput && searchClear) {
        searchBox.addEventListener('click', () => searchInput.focus());

        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            if (currentSearchTerm !== '') {
                searchClear.classList.add('visible');
            } else {
                searchClear.classList.remove('visible');
            }
            isShowingAll = false; // Reset view more when searching
            applyFilter();
        });

        searchClear.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn sự kiện click lan ra searchBox
            searchInput.value = '';
            currentSearchTerm = '';
            searchClear.classList.remove('visible');
            isShowingAll = false;
            applyFilter();
            searchInput.focus(); // Tập trung lại vào ô input để nhập từ mới
        });
    }

    viewAllBtn.addEventListener('click', () => {
        const wasShowingAll = isShowingAll;
        isShowingAll = !isShowingAll; // Toggle state
        
        applyFilter();

        // If collapsing, scroll back to top of section
        if (wasShowingAll) {
            document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Initial run
    applyFilter();
});