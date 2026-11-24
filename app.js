(() => {
  const KEY = "zaki-commerce-v1";
  const $ = (id) => document.getElementById(id);
  const money = (value) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(value || 0));
  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const starter = { products: [], orders: [], spending: [], approvals: [] };
  let state;
  try { state = { ...starter, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { state = starter; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));
  const toast = (message) => { $("toast").textContent = message; $("toast").classList.add("show"); setTimeout(() => $("toast").classList.remove("show"), 2200); };
  const productById = (id) => state.products.find((p) => p.id === id);

  function render() {
    const paid = state.orders.filter((o) => o.payment === "paid");
    const sales = paid.reduce((sum, o) => sum + o.price * o.qty, 0);
    const costs = paid.reduce((sum, o) => sum + o.cost * o.qty, 0);
    $("salesTotal").textContent = money(sales);
    $("costTotal").textContent = money(costs);
    $("profitTotal").textContent = money(sales - costs);
    $("orderCount").textContent = state.orders.length;
    $("pendingCount").textContent = state.orders.filter((o) => o.payment !== "paid").length + " awaiting payment";

    $("productsBody").innerHTML = state.products.length ? state.products.map((p) =>
      `<tr><td><b>${esc(p.name)}</b></td><td>${money(p.price)}</td><td>${money(p.cost)}</td><td>${p.stock}</td><td><button class="text-button" data-delete-product="${p.id}">Remove</button></td></tr>`
    ).join("") : '<tr><td colspan="5" class="empty">No products yet. Add your first product to start.</td></tr>';

    $("orderProduct").innerHTML = state.products.length ? state.products.map((p) => `<option value="${p.id}">${esc(p.name)} · ${money(p.price)}</option>`).join("") : '<option value="">Add a product first</option>';
    $("addOrderBtn").disabled = state.products.length === 0;
    $("ordersBody").innerHTML = state.orders.length ? [...state.orders].reverse().map((o) =>
      `<tr><td><b>${esc(o.reference || o.id)}</b><small class="muted"><br>${new Date(o.createdAt).toLocaleDateString("en-ZA")}</small></td><td>${esc(o.name)} × ${o.qty}</td><td>${money(o.price * o.qty)}</td><td><span class="pill ${o.payment === "paid" ? "pill-paid" : "pill-pending"}">${o.payment === "paid" ? "Paid" : "Pending"}</span></td><td><button class="text-button" data-toggle-order="${o.id}">${o.payment === "paid" ? "Mark pending" : "Mark paid"}</button></td></tr>`
    ).join("") : '<tr><td colspan="5" class="empty">No orders recorded yet.</td></tr>';

    $("actionQueue").innerHTML = state.approvals.length ? [...state.approvals].reverse().map((a) =>
      `<div class="spend-item"><div><b>${esc(a.type)}</b><small>${esc(a.details)} · Requested ${new Date(a.createdAt).toLocaleDateString("en-ZA")}</small></div><div class="spend-actions"><span class="pill ${a.status === "approved" ? "pill-approved" : a.status === "rejected" ? "pill-rejected" : "pill-pending"}">${a.status === "pending" ? "Awaiting decision" : a.status === "approved" ? "Approved locally · not executed" : "Rejected"}</span>${a.status === "pending" ? `<button class="text-button" data-action-approve="${a.id}">Approve</button><button class="text-button" data-action-reject="${a.id}">Reject</button>` : ""}</div></div>`
    ).join("") : '<p class="empty">No action proposals.</p>';

    $("spendQueue").innerHTML = state.spending.length ? [...state.spending].reverse().map((s) =>
      `<div class="spend-item"><div><b>${esc(s.name)} · ${money(s.amount)}</b><small>${esc(s.reason || "No provider or reason added")} · Requested ${new Date(s.createdAt).toLocaleDateString("en-ZA")}</small></div><div class="spend-actions"><span class="pill ${s.status === "approved" ? "pill-approved" : s.status === "rejected" ? "pill-rejected" : "pill-pending"}">${s.status === "pending" ? "Awaiting your decision" : s.status === "approved" ? "Approved locally" : "Rejected"}</span>${s.status === "pending" ? `<button class="text-button" data-spend-approve="${s.id}">Approve</button><button class="text-button" data-spend-reject="${s.id}">Reject</button>` : ""}</div></div>`
    ).join("") : '<p class="empty">No spending requests. Nothing can be purchased from this dashboard.</p>';
  }

  $("addProductBtn").onclick = () => $("productForm").classList.remove("hidden");
  $("cancelProductBtn").onclick = () => $("productForm").classList.add("hidden");
  $("productForm").onsubmit = (event) => {
    event.preventDefault();
    const product = { id: crypto.randomUUID(), name: $("productName").value.trim(), price: Number($("productPrice").value), cost: Number($("productCost").value || 0), stock: Math.max(0, Number($("productStock").value || 0)) };
    if (!product.name || product.price <= 0 || product.cost < 0) return toast("Check the product details.");
    state.products.push(product); save(); render(); event.target.reset(); $("productCost").value = "0"; $("productStock").value = "0"; event.target.classList.add("hidden"); toast("Product saved.");
  };
  $("addOrderBtn").onclick = () => $("orderForm").classList.remove("hidden");
  $("cancelOrderBtn").onclick = () => $("orderForm").classList.add("hidden");
  $("orderForm").onsubmit = (event) => {
    event.preventDefault();
    const product = productById($("orderProduct").value);
    const qty = Math.max(1, Number($("orderQty").value));
    if (!product) return toast("Add a product first.");
    const order = { id: crypto.randomUUID(), reference: $("orderReference").value.trim(), name: product.name, productId: product.id, price: product.price, cost: product.cost, qty, payment: $("orderPayment").value, createdAt: new Date().toISOString() };
    state.orders.push(order); product.stock = Math.max(0, product.stock - qty); save(); render(); event.target.reset(); $("orderQty").value = "1"; event.target.classList.add("hidden"); toast("Order recorded.");
  };
  $("actionForm").onsubmit = (event) => {
    event.preventDefault();
    state.approvals.push({ id: crypto.randomUUID(), type: $("actionType").value, details: $("actionDetails").value.trim(), status: "pending", createdAt: new Date().toISOString() });
    save(); render(); event.target.reset(); toast("Proposal queued. Nothing was carried out.");
  };
  $("spendForm").onsubmit = (event) => {
    event.preventDefault();
    const request = { id: crypto.randomUUID(), name: $("spendName").value.trim(), amount: Number($("spendAmount").value), reason: $("spendReason").value.trim(), status: "pending", createdAt: new Date().toISOString() };
    if (!request.name || request.amount <= 0) return toast("Enter an expense and amount.");
    state.spending.push(request); save(); render(); event.target.reset(); toast("Request saved for your decision. No payment was made.");
  };
  document.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-delete-product]");
    const actionApprove = event.target.closest("[data-action-approve]");
    const actionReject = event.target.closest("[data-action-reject]");
    if (actionApprove || actionReject) {
      const id = (actionApprove || actionReject).dataset[actionApprove ? "actionApprove" : "actionReject"];
      const item = state.approvals.find((a) => a.id === id);
      if (item && item.status === "pending") { item.status = actionApprove ? "approved" : "rejected"; save(); render(); toast(actionApprove ? "Decision recorded. Nothing was executed." : "Proposal rejected."); }
    }

    const toggle = event.target.closest("[data-toggle-order]");
    const approve = event.target.closest("[data-spend-approve]");
    const reject = event.target.closest("[data-spend-reject]");
    if (remove) {
      const id = remove.dataset.deleteProduct;
      if (state.orders.some((o) => o.productId === id)) return toast("This product has orders and cannot be removed.");
      state.products = state.products.filter((p) => p.id !== id); save(); render(); toast("Product removed.");
    }
    if (toggle) {
      const order = state.orders.find((o) => o.id === toggle.dataset.toggleOrder);
      if (order) { order.payment = order.payment === "paid" ? "pending" : "paid"; save(); render(); }
    }
    if (approve || reject) {
      const id = (approve || reject).dataset[approve ? "spendApprove" : "spendReject"];
      const request = state.spending.find((s) => s.id === id);
      if (request && request.status === "pending") { request.status = approve ? "approved" : "rejected"; save(); render(); toast(approve ? "Approved locally only. No payment was made." : "Request rejected."); }
    }
  });
  $("exportBtn").onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "zaki-commerce-data.json"; link.click(); URL.revokeObjectURL(url); toast("Data export downloaded.");
  };
  $("year").textContent = new Date().getFullYear();
  render();
})();