document.addEventListener("DOMContentLoaded", function () {
  const cart = [];
  const SHIPPING_COST = 120;

  // إضافة المنتج إلى السلة
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = btn.closest(".card");
      const title = card.querySelector(".card-title").textContent;
      const price = parseFloat(card.querySelector(".product-price").dataset.price);
      const sale = parseFloat(card.querySelector(".product-price").dataset.sale);
      const size = card.querySelector(".size-select").value;
      const color = card.querySelector(".color-select").value;
      const qty = parseInt(card.querySelector(".qty-input").value) || 1;

      const existingProduct = cart.find(
        (item) => item.title === title && item.size === size && item.color === color
      );

      if (existingProduct) {
        existingProduct.qty += qty;
      } else {
        cart.push({ title, price, sale, size, color, qty });
      }

      updateCartDisplay();
      showAlert(`✅ Added ${qty} × ${title} to cart`);
    });
  });

  // تحديث عرض السلة
  function updateCartDisplay() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.sale * item.qty;
      total += itemTotal;

      const div = document.createElement("div");
      div.className = "border rounded bg-white shadow-sm p-3 mb-3";

      div.innerHTML = `
      <div class="row align-items-center gy-2">
        <div class="col-12 col-md-8">
          <strong class="d-block">${item.title}</strong>
          <small class="text-muted d-block">Size: ${item.size}, Color: ${item.color}</small>
          <small class="text-muted d-block">৳${item.sale} × ${item.qty} = <strong>৳${itemTotal}</strong></small>
        </div>
        <div class="col-12 col-md-4 text-md-end">
          <div class="btn-group btn-group-sm mt-2 mt-md-0" role="group">
            <button class="btn btn-outline-secondary" onclick="changeQty(${index}, -1)">-</button>
            <button class="btn btn-outline-secondary" onclick="changeQty(${index}, 1)">+</button>
            <button class="btn btn-danger" onclick="removeFromCart(${index})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;

      container.appendChild(div);
    });

    total += SHIPPING_COST;
    document.getElementById("total-price").innerText = `৳${total}`;

    // تحديث حقل المنتج في النموذج
    const productsInput = document.getElementById("product-input");
    productsInput.value = cart
      .map((p) => `${p.title} (${p.size}, ${p.color}) x${p.qty}`)
      .join(" | ");

    // تحديث زر السلة العائم
    const floatingCartBtn = document.getElementById("floating-cart-btn");
    const cartCountBadge = document.getElementById("cart-count-badge");
    const orderFormSection = document.getElementById("order-form");
    const productsSection = document.getElementById("products-section"); // ضيف id للمنتجات
    // تحديث عدد المنتجات
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadge.textContent = totalQty;

    // إظهار الزر أو إخفاؤه حسب الحالة (جوال فقط)
    if (window.innerWidth <= 768) {
      if (totalQty > 0) {
        floatingCartBtn.style.display = "block";
      } else {
        floatingCartBtn.style.display = "none";
      }
    }
    floatingCartBtn.addEventListener("click", function () {
      orderFormSection.scrollIntoView({ behavior: "smooth" });
    });

    const observerOptions = {
      root: null,
      threshold: 0.2 // 20% من العنصر ظاهر
    };

    // إخفاء الزر عند رؤية نموذج الطلب
    const orderObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          floatingCartBtn.style.display = "none";
        } else {
          // إذا ما كان داخل النموذج ورجع لقسم المنتجات
          if (cart.length > 0 && window.innerWidth <= 768) {
            floatingCartBtn.style.display = "block";
          }
        }
      });
    }, observerOptions);

    if (orderFormSection) {
      orderObserver.observe(orderFormSection);
    }
  }

  // تغيير الكمية
  window.changeQty = function (index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCartDisplay();
  };

  // إزالة المنتج من السلة
  window.removeFromCart = function (index) {
    cart.splice(index, 1);
    updateCartDisplay();
  };

  // عرض إشعار مؤقت
  function showAlert(message) {
    const alert = document.createElement("div");
    alert.className = "alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3";
    alert.style.zIndex = "9999";
    alert.innerHTML = message;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 2500);
  }

  // Example starter JavaScript for disabling form submissions if there are invalid fields
  (function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
  })();

  // منع إرسال النموذج إذا كانت السلة فارغة
  document.getElementById("order-form").addEventListener("submit", function (e) {
    if (cart.length === 0) {
      e.preventDefault();
      const alert = document.createElement("div");
      alert.className = "alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3 shadow";
      alert.style.zIndex = "9999";
      alert.innerHTML = "🛒 Please add at least one product before submitting the order.";
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
      return;
    } else {
      e.preventDefault(); // نمنع الإرسال الفعلي مؤقتًا (احذف هذا السطر إذا النموذج فعلاً يرسل للإيميل أو سيرفر)

      // عرض رسالة الشكر
      const alert = document.createElement("div");
      alert.className = "alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3 shadow";
      alert.style.zIndex = "9999";
      alert.innerHTML = "✅ Thank you! Your order has been received.";
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);

      // تفرغ السلة
      cart.length = 0;
      updateCartDisplay();

      // إعادة تعيين النموذج (الاسم، العنوان، إلخ)
      this.reset();
    }
  });

});
