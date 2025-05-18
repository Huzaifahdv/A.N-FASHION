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
      div.className = "border p-2 mb-2 bg-white rounded shadow-sm";
      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${item.title}</strong><br>
            Size: ${item.size}, Color: ${item.color}<br>
            ৳${item.sale} x ${item.qty} = ৳${itemTotal}
          </div>
          <div>
            <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQty(${index}, -1)">-</button>
            <button class="btn btn-sm btn-outline-secondary me-1" onclick="changeQty(${index}, 1)">+</button>
            <button class="btn btn-sm btn-danger" onclick="removeFromCart(${index})">
              <i class="bi bi-trash"></i>
            </button>
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

  // منع إرسال النموذج إذا كانت السلة فارغة
  document.getElementById("order-form").addEventListener("submit", function (e) {
    if (cart.length === 0) {
      e.preventDefault();
      alert("🛒 Please add a product before submitting the order.");
    }
  });
});
