document.addEventListener('DOMContentLoaded', () => {
    // التحكم في إخفاء وإظهار الهيدر والسايدبار عند التمرير
    let lastScrollTop = 0;
    const adminHeader = document.querySelector('.admin-header');
    const adminSidebar = document.getElementById('adminSidebar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // التمرير للأسفل
            adminHeader.classList.add('header-hidden');
            adminSidebar.classList.add('sidebar-hidden');
        } else {
            // التمرير للأعلى
            adminHeader.classList.remove('header-hidden');
            adminSidebar.classList.remove('sidebar-hidden');
        }

        lastScrollTop = scrollTop;
    });

    // Sidebar functionality
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // تبديل حالة السايدبار
    function toggleSidebar() {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
        document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
    }

    // مستمعات الأحداث للسايدبار
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // التبديل بين الأقسام
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');

            if (window.innerWidth < 992 && sidebar.classList.contains('show')) {
                toggleSidebar();
            }

            const targetSection = e.currentTarget.dataset.section;
            contentSections.forEach(content => {
                if (content.id === targetSection + 'Section') {
                    content.classList.remove('d-none');
                    content.style.opacity = '0';
                    setTimeout(() => {
                        content.style.opacity = '1';
                    }, 50);
                } else {
                    content.classList.add('d-none');
                }
            });
        });
    });

    // Product Management Functions
    function initializeProducts() {
        const productIds = ['PNJ001', 'PNJ002', 'PNJ003', 'PNJ004', 'PNJ005', 'PNJ006'];

        productIds.forEach(id => {
            attachProductEventListeners(id);
            loadProductData(id);
        });
    }

    function attachProductEventListeners(productId) {
        // Image Upload Handler
        const imageUpload = document.getElementById(`imageUpload-${productId}`);
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => handleImageUpload(e, productId));
        }

        // Size Tag Handler
        const sizeTagsContainer = document.getElementById(`sizeTags-${productId}`);
        if (sizeTagsContainer) {
            const addSizeBtn = sizeTagsContainer.querySelector('.add-size');
            const sizeInput = sizeTagsContainer.querySelector('input');

            addSizeBtn.addEventListener('click', () => {
                const size = sizeInput.value.trim().toUpperCase();
                if (size) {
                    addSizeTag(productId, size);
                    sizeInput.value = '';
                }
            });
        }

        // Color Tag Handler
        const colorTagsContainer = document.getElementById(`colorTags-${productId}`);
        if (colorTagsContainer) {
            const addColorBtn = colorTagsContainer.querySelector('.add-color');
            const colorInput = colorTagsContainer.querySelector('input');

            addColorBtn.addEventListener('click', () => {
                const color = colorInput.value.trim();
                if (color) {
                    addColorTag(productId, color);
                    colorInput.value = '';
                }
            });
        }

        // Form Submit Handler
        const form = document.querySelector(`#product-${productId} form`);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                saveProductData(productId);
            });
        }
    }

    const initialProductData = {
        'PNJ001': {
            images: Array.from({ length: 6 }, (_, i) => `../assets/images/product1/WhatsApp Image 2025-05-24 at 4.26.${i < 2 ? '25' : '26'} PM${i === 0 ? '' : i === 1 ? '' : ' (1)'}.jpeg`),
            defaultData: {
                productName: 'Product 1',
                shortDescription: 'First product description',
                regularPrice: 2999,
                salePrice: 2499
            }
        },
        'PNJ002': {
            images: Array.from({ length: 6 }, (_, i) => `../assets/images/product2/WhatsApp Image 2025-05-24 at 4.27.${i < 2 ? '03' : '04'} PM${i === 0 ? '' : i === 1 ? ' (1)' : ` (${i - 1})`}.jpeg`),
            defaultData: {
                productName: 'Product 2',
                shortDescription: 'Second product description',
                regularPrice: 3499,
                salePrice: 2999
            }
        },
        'PNJ003': {
            images: Array.from({ length: 6 }, (_, i) => `../assets/images/product3/WhatsApp Image 2025-05-24 at 4.27.${i < 2 ? '28' : '29'} PM${i === 0 ? '' : ' (1)'}.jpeg`),
            defaultData: {
                productName: 'Product 3',
                shortDescription: 'Third product description',
                regularPrice: 3999,
                salePrice: 3499
            }
        },
        'PNJ004': {
            images: Array.from({ length: 4 }, (_, i) => `../assets/images/product4/WhatsApp Image 2025-05-25 at 8.45.${i < 2 ? '12' : '13'} PM${i % 2 === 0 ? '' : ' (1)'}.jpeg`),
            defaultData: {
                productName: 'Product 4',
                shortDescription: 'Fourth product description',
                regularPrice: 2499,
                salePrice: 1999
            }
        },
        'PNJ005': {
            images: Array.from({ length: 4 }, (_, i) => `../assets/images/product5/WhatsApp Image 2025-05-25 at 8.46.${i < 2 ? '33' : '34'} PM${i % 2 === 0 ? '' : ' (1)'}.jpeg`),
            defaultData: {
                productName: 'Product 5',
                shortDescription: 'Fifth product description',
                regularPrice: 4499,
                salePrice: 3999
            }
        },
        'PNJ006': {
            images: [], // Will be populated from product6 folder
            defaultData: {
                productName: 'Product 6',
                shortDescription: 'Sixth product description',
                regularPrice: 3999,
                salePrice: 3499
            }
        }
    };

    function loadProductData(productId) {
        const productData = initialProductData[productId];
        if (!productData) return;

        // Load images
        productData.images.forEach(imageUrl => {
            addImageToContainer(productId, imageUrl);
        });

        // Load form data
        const form = document.querySelector(`#product-${productId} form`);
        if (form && productData.defaultData) {
            Object.entries(productData.defaultData).forEach(([key, value]) => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = value;
                }
            });
        }

        // Add some default sizes
        const defaultSizes = ['S', 'M', 'L', 'XL'];
        defaultSizes.forEach(size => addSizeTag(productId, size));

        // Add some default colors
        const defaultColors = ['Black', 'White', 'Navy'];
        defaultColors.forEach(color => addColorTag(productId, color));
    }

    function loadProductImages(productId) {
        const container = document.querySelector(`#product-${productId} .product-images-container`);
        if (!container) return;

        // Get all images for this product from the assets folder
        const productNum = productId.slice(-1);
        const images = [
            { src: `../assets/images/product${productNum}/WhatsApp Image 2025-05-24 at 4.26.25 PM.jpeg` },
            { src: `../assets/images/product${productNum}/WhatsApp Image 2025-05-24 at 4.26.26 PM.jpeg` },
            { src: `../assets/images/product${productNum}/WhatsApp Image 2025-05-24 at 4.26.27 PM.jpeg` }
        ];

        images.forEach(image => {
            addImageToContainer(image.src, container);
        });
    }

    function addImageToContainer(src, container) {
        const div = document.createElement('div');
        div.className = 'col-4';
        div.innerHTML = `
        <div class="product-image-item">
            <img src="${src}" class="img-fluid rounded">
            <button class="btn btn-sm btn-danger remove-image" title="Remove Image">×</button>
        </div>
    `;

        // Add remove functionality
        const removeBtn = div.querySelector('.remove-image');
        removeBtn.addEventListener('click', () => {
            const imagesCount = container.querySelectorAll('.product-image-item').length;
            if (imagesCount > 1) {
                div.remove();
            } else {
                alert('Cannot remove the last image. Products must have at least one image.');
            }
        });

        container.appendChild(div);
    }

    function handleImageUpload(event, productId) {
        const files = Array.from(event.target.files);
        const container = document.getElementById(`productImages-${productId}`);
        const existingImages = container.querySelectorAll('.product-image').length;

        if (existingImages + files.length > 5) {
            alert('Maximum 5 images allowed per product');
            return;
        }

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    addImageToContainer(productId, e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    function addImageToContainer(productId, imageUrl) {
        const container = document.getElementById(`productImages-${productId}`);
        const imageCount = container.querySelectorAll('.product-image').length;

        if (imageCount >= 5) {
            alert('Maximum 5 images allowed per product');
            return;
        }

        const col = document.createElement('div');
        col.className = 'col-4';

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'product-image position-relative';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'img-fluid rounded';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm position-absolute top-0 end-0 m-2';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function () {
            const remainingImages = container.querySelectorAll('.product-image').length;
            if (remainingImages > 1) {
                col.remove();
            } else {
                alert('At least one image is required');
            }
        };

        imageWrapper.appendChild(img);
        imageWrapper.appendChild(deleteBtn);
        col.appendChild(imageWrapper);
        container.appendChild(col);
    }

    function addSizeTag(productId, size) {
        const container = document.getElementById(`sizeTags-${productId}`).querySelector('.d-flex');
        const existingSize = Array.from(container.children).find(tag => tag.textContent.includes(size));

        if (!existingSize) {
            const tag = document.createElement('div');
            tag.className = 'badge bg-secondary p-2 d-flex align-items-center';
            tag.innerHTML = `
            ${size}
            <button type="button" class="btn-close ms-2" aria-label="Remove"></button>
        `;

            tag.querySelector('.btn-close').addEventListener('click', () => tag.remove());
            container.appendChild(tag);
        }
    }

    function addColorTag(productId, color) {
        const container = document.getElementById(`colorTags-${productId}`).querySelector('.d-flex');
        const existingColor = Array.from(container.children).find(tag => tag.textContent.includes(color));

        if (!existingColor) {
            const tag = document.createElement('div');
            tag.className = 'badge bg-primary p-2 d-flex align-items-center';
            tag.innerHTML = `
            ${color}
            <button type="button" class="btn-close ms-2" aria-label="Remove"></button>
        `;

            tag.querySelector('.btn-close').addEventListener('click', () => tag.remove());
            container.appendChild(tag);
        }
    }

    // Initialize products when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initializeProducts();
    });

    // Orders Form Settings
    const shippingForm = document.getElementById('shippingForm');
    const couponForm = document.getElementById('couponForm');
    const activeCoupons = document.getElementById('activeCoupons');

    // Load saved shipping cost
    const savedShippingCost = localStorage.getItem('shippingCost');
    if (savedShippingCost) {
        document.getElementById('shippingCost').value = savedShippingCost;
    }

    // Handle shipping cost changes
    shippingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const cost = document.getElementById('shippingCost').value;
        localStorage.setItem('shippingCost', cost);
        showToast('Shipping cost updated successfully!');
    });

    // Handle coupon form submission
    couponForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const coupon = {
            code: document.getElementById('couponCode').value,
            type: document.getElementById('discountType').value,
            value: document.getElementById('discountValue').value,
            validUntil: document.getElementById('validUntil').value
        };

        // Save coupon to localStorage
        const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
        coupons.push(coupon);
        localStorage.setItem('coupons', JSON.stringify(coupons));

        // Add coupon to UI
        addCouponToUI(coupon);
        couponForm.reset();
        showToast('Coupon added successfully!');
    });

    // Load existing coupons
    function loadCoupons() {
        if (!activeCoupons) return;

        const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
        activeCoupons.innerHTML = '';

        if (coupons.length === 0) {
            activeCoupons.innerHTML = '<p class="text-muted">No active coupons</p>';
            return;
        }

        coupons.forEach(coupon => addCouponToUI(coupon));
    }

    // Add coupon to UI
    function addCouponToUI(coupon) {
        if (!activeCoupons) return;

        const couponEl = document.createElement('div');
        couponEl.className = 'list-group-item d-flex justify-content-between align-items-center';

        const discountText = coupon.type === 'percentage' ? `${coupon.value}%` : `৳${coupon.value}`;
        const validUntil = new Date(coupon.validUntil).toLocaleDateString();

        couponEl.innerHTML = `
            <div>
                <strong>${coupon.code}</strong>
                <small class="text-muted d-block">
                    ${discountText} off | Valid until: ${validUntil}
                </small>
            </div>
            <button class="btn btn-sm btn-outline-danger delete-coupon" data-code="${coupon.code}">
                <i class="bi bi-trash"></i>
            </button>
        `;

        activeCoupons.appendChild(couponEl);

        // Add delete functionality
        couponEl.querySelector('.delete-coupon').addEventListener('click', () => {
            const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
            const updatedCoupons = coupons.filter(c => c.code !== coupon.code);
            localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
            couponEl.remove();
            if (updatedCoupons.length === 0) {
                activeCoupons.innerHTML = '<p class="text-muted">No active coupons</p>';
            }
            showToast('Coupon deleted successfully!');
        });
    }

    // Show toast message
    function showToast(message) {
        // You can implement a toast notification here
        alert(message); // For now, using simple alert
    }

    // Initialize coupons
    loadCoupons();

    // معالج زر تسجيل الخروج
    const logoutButton = document.getElementById('logoutButton');
    logoutButton?.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            // سيتم تنفيذ تسجيل الخروج من Firebase لاحقاً
            window.location.href = 'login.html';
        }
    });
});