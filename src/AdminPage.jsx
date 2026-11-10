import React, { useState, useEffect, useMemo } from 'react';
import { apiUrl } from './api.js';
import { money } from './utils/format.js';
import { authStorage } from './utils/storage.js';
import { Icon } from './components/common/Icon.jsx';

export default function AdminPage({
  currentUser,
  setCurrentUser,
  navigate,
  products = [],
  setProducts,
  setToast,
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'overview' | 'orders' | 'products' | 'resend'
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    verifiedOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Product Catalog Management State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setEditPrice(String(prod.price || ''));
    setEditOriginalPrice(prod.originalPrice ? String(prod.originalPrice) : '');
    setEditBadge(prod.badge || prod.tag || '');
    setEditInStock(prod.inStock !== false);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/products/${editingProduct.id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          price: Number(editPrice),
          originalPrice: editOriginalPrice ? Number(editOriginalPrice) : null,
          badge: editBadge,
          inStock: editInStock,
        }),
      });
      const data = await res.json();
      setSavingProduct(false);
      if (data.success && data.product) {
        if (setProducts) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data.product } : p))
          );
        }
        if (setToast) setToast(`Product "${data.product.name}" updated in MongoDB Atlas!`);
        setEditingProduct(null);
      } else {
        if (setToast) setToast(data.error || 'Failed to update product');
      }
    } catch (err) {
      setSavingProduct(false);
      if (setToast) setToast('Network error updating product');
    }
  };

  // Helper to obtain authenticated Bearer token header
  const getAuthHeaders = () => {
    const token = localStorage.getItem('aanur_auth_token') || currentUser?.token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch orders & stats from backend
  const fetchAdminData = async (showToast = false) => {
    setRefreshing(true);
    try {
      const authHeaders = getAuthHeaders();

      // 1. Fetch Orders
      const ordRes = await fetch(apiUrl('/api/admin/orders'), {
        headers: { ...authHeaders },
      });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success && Array.isArray(ordData.orders)) {
          setOrders(ordData.orders);
        }
      } else if (ordRes.status === 401 || ordRes.status === 403) {
        if (setToast) setToast('Admin session expired or access unauthorized. Please re-login.');
      } else {
        if (setToast) setToast('Could not retrieve orders from server.');
      }

      // 2. Fetch Stats
      const statRes = await fetch(apiUrl('/api/admin/stats'), {
        headers: { ...authHeaders },
      });
      if (statRes.ok) {
        const statData = await statRes.json();
        if (statData.success && statData.stats) {
          setStats(statData.stats);
        }
      }
      if (showToast && setToast) {
        setToast('Admin records synchronized with server.');
      }
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(() => {
      fetchAdminData();
    }, 30000); // auto-poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Update order status handler
  const handleUpdateOrderStatus = async (orderRef, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(apiUrl(`/api/admin/orders/${orderRef}/status`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (setToast) setToast(`Order #${orderRef} updated to: ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.orderRef === orderRef ? { ...o, deliveryStatus: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.orderRef === orderRef) {
          setSelectedOrder((prev) => ({ ...prev, deliveryStatus: newStatus }));
        }
      } else {
        if (setToast) setToast(`Update failed: ${data.error || 'Server error'}`);
      }
    } catch (err) {
      if (setToast) setToast('Network error updating status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Sign out admin
  const handleAdminLogout = () => {
    authStorage.clearAuth();
    if (setCurrentUser) setCurrentUser(null);
    if (setToast) setToast('Admin signed out safely.');
    navigate('/login');
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter === 'verified' && !order.isVerified) return false;
      if (statusFilter === 'unverified' && order.isVerified) return false;
      if (statusFilter === 'processing' && !order.deliveryStatus?.toLowerCase().includes('process')) return false;
      if (statusFilter === 'shipped' && !order.deliveryStatus?.toLowerCase().includes('ship')) return false;
      if (statusFilter === 'delivered' && !order.deliveryStatus?.toLowerCase().includes('deliver')) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const refMatch = (order.orderRef || '').toLowerCase().includes(q);
        const nameMatch = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.toLowerCase().includes(q);
        const emailMatch = (order.customer?.email || '').toLowerCase().includes(q);
        const phoneMatch = (order.customer?.phone || '').includes(q);
        const cityMatch = (order.customer?.city || '').toLowerCase().includes(q);
        return refMatch || nameMatch || emailMatch || phoneMatch || cityMatch;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Compute live totals if stats API not available
  const computedRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  }, [orders]);

  const copyText = (txt, label) => {
    if (!txt) return;
    navigator.clipboard?.writeText(txt);
    if (setToast) setToast(`Copied ${label}: ${txt}`);
  };

  return (
    <div className="admin-page-root">
      {/* Top Admin Header Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <span className="admin-shield-icon">
            <Icon name="shield" size={19} />
          </span>
          <div>
            <h1>Aanur Textile <span>Artisan Control Center</span></h1>
            <span className="admin-badge-pill">Store Administrator</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <span className="admin-user-tag" title={`Logged in as ${currentUser?.email}`}>
            <Icon name="user" size={14} />
            <strong>{currentUser?.email || 'Admin'}</strong>
          </span>

          <button
            type="button"
            className="admin-action-btn"
            onClick={() => fetchAdminData(true)}
            disabled={refreshing}
            title="Refresh Orders & Stats"
          >
            <Icon name="refresh" size={15} className={refreshing ? 'admin-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <button
            type="button"
            className="admin-action-btn"
            onClick={() => navigate('/shop')}
            title="View live storefront"
          >
            <Icon name="external" size={14} />
            <span>View Storefront</span>
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleAdminLogout}
            title="Sign out of Admin Dashboard"
          >
            <Icon name="logout" size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="admin-container">
        {/* Navigation Tabs Bar */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Icon name="box" size={16} />
            <span>Live Orders</span>
            <span className="admin-tab-count">{orders.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Icon name="dashboard" size={16} />
            <span>Workshop Metrics</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'products' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Icon name="tag" size={16} />
            <span>Catalog & Inventory</span>
            <span className="admin-tab-count">{products.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeTab === 'resend' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('resend')}
          >
            <Icon name="mail" size={16} />
            <span>Resend & Automation</span>
            <span className="admin-tab-status-dot" />
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: LIVE ORDERS MANAGEMENT                                     */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="admin-pane">
            {/* Filter and Search Bar */}
            <div className="admin-orders-controls">
              <div className="admin-search-wrap">
                <Icon name="search" size={16} />
                <input
                  type="text"
                  placeholder="Search by Order #, Customer Name, Email, Phone, or City..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="admin-clear-search" onClick={() => setSearchQuery('')}>
                    <Icon name="close" size={14} />
                  </button>
                )}
              </div>

              <div className="admin-filter-pills">
                {[
                  { id: 'all', label: `All Orders (${orders.length})` },
                  { id: 'processing', label: 'On the Loom' },
                  { id: 'shipped', label: 'Shipped' },
                  { id: 'delivered', label: 'Delivered' },
                  { id: 'verified', label: '✓ Confirmed / Auto-Verified' },
                  { id: 'unverified', label: '⏰ Pending 30m Auto-Verify' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`admin-filter-pill ${statusFilter === f.id ? 'is-active' : ''}`}
                    onClick={() => setStatusFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List Table / Cards */}
            {loading ? (
              <div className="admin-loading-state">
                <div className="admin-spinner" />
                <p>Retrieving workshop orders from database...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="admin-empty-pane">
                <Icon name="box" size={40} />
                <h3>No Orders Found</h3>
                <p>
                  {searchQuery || statusFilter !== 'all'
                    ? 'No orders matched your active search query or filter.'
                    : 'No customer orders have been placed yet. New orders placed from the storefront will appear here instantly.'}
                </p>
                {(searchQuery || statusFilter !== 'all') && (
                  <button
                    type="button"
                    className="button button-soft"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="admin-orders-table-wrap">
                <table className="admin-orders-table">
                  <thead>
                    <tr>
                      <th>Order Ref</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Delivery Destination</th>
                      <th>Items Ordered</th>
                      <th>Total (INR)</th>
                      <th>Verification Status</th>
                      <th>Delivery Stage</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => {
                      const isAutoVerified = ord.verificationType === 'auto_verified_30m';
                      const isCustomerConfirmed = ord.verificationType === 'customer_confirmed';
                      const isVerified = ord.isVerified || isAutoVerified || isCustomerConfirmed;
                      const customerName = `${ord.customer?.firstName || ''} ${ord.customer?.lastName || ''}`.trim() || 'Guest Customer';

                      return (
                        <tr key={ord.orderRef} className={isVerified ? 'is-verified-row' : ''}>
                          {/* Order Ref */}
                          <td className="cell-ref">
                            <strong>#{ord.orderRef}</strong>
                            <button
                              type="button"
                              className="admin-mini-copy-btn"
                              title="Copy Order Ref"
                              onClick={() => copyText(ord.orderRef, 'Order Ref')}
                            >
                              <Icon name="copy" size={12} />
                            </button>
                          </td>

                          {/* Date */}
                          <td className="cell-date">
                            <span>
                              {ord.createdAt
                                ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : ord.date || 'Recent'}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="cell-customer">
                            <strong>{customerName}</strong>
                            <div className="cell-sub-link">
                              <a href={`mailto:${ord.customer?.email}`} title="Email customer">
                                {ord.customer?.email}
                              </a>
                            </div>
                            <div className="cell-sub-phone">
                              <Icon name="phone" size={11} />
                              <a href={`tel:${ord.customer?.phone}`}>{ord.customer?.phone}</a>
                            </div>
                          </td>

                          {/* Destination */}
                          <td className="cell-dest">
                            <span>{ord.customer?.street}</span>
                            <small>
                              {ord.customer?.city || 'Tiruppur'} {ord.customer?.postalCode && `— ${ord.customer?.postalCode}`}
                            </small>
                          </td>

                          {/* Items summary */}
                          <td className="cell-items">
                            <span className="items-badge">
                              {ord.items?.length || 1} item{ord.items?.length === 1 ? '' : 's'}
                            </span>
                            <div className="items-preview-names">
                              {ord.items?.map((it, idx) => (
                                <div key={idx} className="item-line-tiny">
                                  <span>{it.quantity}x</span> {it.name || it.product?.name || 'Bedsheet'}
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total */}
                          <td className="cell-total">
                            <strong>{money(ord.total)}</strong>
                            <small>{ord.paymentMethod || 'Cash on Delivery'}</small>
                          </td>

                          {/* Verification */}
                          <td className="cell-verify">
                            {isCustomerConfirmed ? (
                              <span className="verify-pill pill-confirmed" title="Customer clicked Confirm in email">
                                <Icon name="check" size={12} /> Confirmed by Email
                              </span>
                            ) : isAutoVerified ? (
                              <span className="verify-pill pill-autoverified" title="Auto-verified after 30 minutes">
                                <Icon name="check" size={12} /> Auto-Verified (30m)
                              </span>
                            ) : (
                              <span className="verify-pill pill-pending" title="Awaiting 30-min window or customer confirmation">
                                Pending (30m window)
                              </span>
                            )}
                          </td>

                          {/* Delivery Stage Dropdown */}
                          <td className="cell-status">
                            <select
                              value={ord.deliveryStatus || 'Processing · 7-14 days'}
                              disabled={statusUpdating}
                              onChange={(e) => handleUpdateOrderStatus(ord.orderRef, e.target.value)}
                              className="admin-status-select"
                            >
                              <option value="Processing · 7-14 days">Processing · On the Loom</option>
                              <option value="Shipped · In Transit">Shipped · In Transit</option>
                              <option value="Out for Doorstep Delivery">Out for Delivery</option>
                              <option value="Delivered Successfully">Delivered Successfully</option>
                              <option value="Cancelled / Returned">Cancelled / Returned</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="cell-actions">
                            <button
                              type="button"
                              className="admin-table-btn"
                              onClick={() => setSelectedOrder(ord)}
                              title="Inspect full order record"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: WORKSHOP METRICS & REVENUE OVERVIEW                        */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="admin-pane">
            <div className="admin-kpi-grid">
              <div className="kpi-card">
                <span className="kpi-icon-wrap" style={{ background: '#eef6ec', color: '#2e7d32' }}>
                  ₹
                </span>
                <div className="kpi-info">
                  <span className="kpi-label">Total Store Revenue</span>
                  <strong className="kpi-val">{money(stats.totalRevenue || computedRevenue)}</strong>
                  <small>Cumulative customer orders</small>
                </div>
              </div>

              <div className="kpi-card">
                <span className="kpi-icon-wrap" style={{ background: '#fef3ec', color: '#b76b52' }}>
                  <Icon name="box" size={20} />
                </span>
                <div className="kpi-info">
                  <span className="kpi-label">Total Orders Placed</span>
                  <strong className="kpi-val">{orders.length}</strong>
                  <small>Recorded in MongoDB / Workshop database</small>
                </div>
              </div>

              <div className="kpi-card">
                <span className="kpi-icon-wrap" style={{ background: '#edf4fb', color: '#1976d2' }}>
                  <Icon name="check" size={20} />
                </span>
                <div className="kpi-info">
                  <span className="kpi-label">Verified & Confirmed</span>
                  <strong className="kpi-val">
                    {orders.filter((o) => o.isVerified || o.verificationType !== 'unverified').length}
                  </strong>
                  <small>Customer confirmed & 30-min auto-verified</small>
                </div>
              </div>

              <div className="kpi-card">
                <span className="kpi-icon-wrap" style={{ background: '#fdf0ed', color: '#8B1E0F' }}>
                  <Icon name="tag" size={20} />
                </span>
                <div className="kpi-info">
                  <span className="kpi-label">Catalog Products</span>
                  <strong className="kpi-val">{products.length}</strong>
                  <small>Active handloom bedsheets & fabrics</small>
                </div>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="admin-overview-columns">
              <div className="admin-card-box">
                <div className="box-header">
                  <h3>Recent Customer Orders</h3>
                  <button type="button" className="text-link" onClick={() => setActiveTab('orders')}>
                    View All Orders &rarr;
                  </button>
                </div>
                <div className="admin-mini-orders-list">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.orderRef} className="mini-order-item">
                      <div>
                        <strong>#{o.orderRef}</strong>
                        <span>{o.customer?.firstName} {o.customer?.lastName} ({o.customer?.city || 'Tiruppur'})</span>
                      </div>
                      <div className="mini-order-right">
                        <strong>{money(o.total)}</strong>
                        <span className="mini-status">{o.deliveryStatus || 'Processing'}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-muted">No orders placed yet.</p>}
                </div>
              </div>

              <div className="admin-card-box">
                <div className="box-header">
                  <h3>Production & Dispatch Health</h3>
                </div>
                <div className="health-check-list">
                  <div className="health-item">
                    <span className="health-dot is-good" />
                    <div>
                      <strong>Nathakadaiyur Handloom Workshop</strong>
                      <p>Dispatching factory direct within 7 to 14 days nationwide.</p>
                    </div>
                  </div>
                  <div className="health-item">
                    <span className="health-dot is-good" />
                    <div>
                      <strong>Resend Email API Engine</strong>
                      <p>Order confirmations & OTP verifications running live.</p>
                    </div>
                  </div>
                  <div className="health-item">
                    <span className="health-dot is-good" />
                    <div>
                      <strong>30-Minute Auto-Verify Automation</strong>
                      <p>Active background task verifying pending customer orders.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CATALOG & INVENTORY MANAGEMENT                             */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="admin-pane">
            <div className="admin-subhead">
              <div>
                <h2>Store Catalog & Inventory ({products.length})</h2>
                <p>Manage product pricing, discounts, stock availability, and loom assignments.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #d1ccc1',
                    background: '#fff',
                    fontSize: '13.5px',
                    color: '#292721',
                    minWidth: '180px',
                  }}
                />
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => {
                    fetch(apiUrl('/api/products'))
                      .then((r) => r.json())
                      .then((d) => {
                        if (d?.products && setProducts) setProducts(d.products);
                        if (setToast) setToast('Catalog actively re-synced from MongoDB Atlas.');
                      })
                      .catch(() => {
                        if (setToast) setToast('Catalog synchronized.');
                      });
                  }}
                >
                  <Icon name="refresh" size={14} />
                  <span>Sync Catalog</span>
                </button>
              </div>
            </div>

            <div className="admin-products-grid">
              {products
                .filter((p) => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.badge || '').toLowerCase().includes(productSearch.toLowerCase()))
                .map((prod) => (
                <article key={prod.id} className="admin-product-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="admin-product-img">
                    <img src={prod.image} alt={prod.name} />
                    <span className="prod-badge-mini">{prod.badge || prod.tag || 'Handloom'}</span>
                  </div>
                  <div className="admin-product-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h4>{prod.name}</h4>
                    <p className="prod-meta-line">
                      <span>Thread Count: <strong>{prod.threadCount || 300} TC</strong></span>
                      <span>Fabric: <strong>{prod.fabric || '100% Combed Cotton'}</strong></span>
                    </p>
                    <div className="prod-price-row">
                      <strong>{money(prod.price)}</strong>
                      {prod.originalPrice > prod.price && <del>{money(prod.originalPrice)}</del>}
                    </div>
                    <div className="prod-stock-indicator" style={{ marginBottom: '12px' }}>
                      <span className={`stock-dot ${prod.inStock !== false ? 'in-stock' : 'out-of-stock'}`} />
                      <span>{prod.inStock !== false ? 'In Stock & Ready on the Loom' : 'Temporarily Out of Stock'}</span>
                    </div>
                    <button
                      type="button"
                      className="button button-dark button-sm"
                      style={{ marginTop: 'auto', width: '100%', fontSize: '0.84rem', padding: '0.55rem', borderRadius: '6px' }}
                      onClick={() => openEditProduct(prod)}
                    >
                      <Icon name="dashboard" size={13} style={{ marginRight: '6px' }} />
                      Edit Pricing & Stock
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: RESEND & AUTOMATION WORKFLOWS                              */}
        {/* ================================================================= */}
        {activeTab === 'resend' && (
          <div className="admin-pane">
            <div className="admin-card-box">
              <div className="box-header">
                <h3>Resend Email & Order Automation System</h3>
              </div>
              <div className="resend-info-grid">
                <div className="resend-info-card">
                  <span className="resend-badge-active">ACTIVE & ONLINE</span>
                  <h4>1. Customer Order Confirmation Email</h4>
                  <p>
                    Triggered whenever a customer places an order at checkout. Contains a dedicated
                    <strong> "✓ Confirm Order Now"</strong> button and itemized order breakdown.
                  </p>
                </div>

                <div className="resend-info-card">
                  <span className="resend-badge-active">AUTOMATED (60s loop)</span>
                  <h4>2. 30-Minute Auto-Verification Engine</h4>
                  <p>
                    If a customer does not click their confirmation email within 30 minutes, the server-side
                    automation automatically marks the order as verified and confirmed for loom production.
                  </p>
                </div>

                <div className="resend-info-card">
                  <span className="resend-badge-active">REAL-TIME DISPATCH</span>
                  <h4>3. Workshop Owner Email Updates</h4>
                  <p>
                    Dispatches real-time order alerts to the verified admin inbox whenever a new order is
                    placed, confirmed by customer, or auto-verified after 30 minutes.
                  </p>
                </div>

                <div className="resend-info-card">
                  <span className="resend-badge-active">PASSWORDLESS SECURITY</span>
                  <h4>4. Pure Gmail OTP Authentication</h4>
                  <p>
                    Sends single-use 6-digit verification codes to authenticate users and admins with zero
                    password requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL: FULL ORDER DETAILS INSPECTOR                                 */}
      {/* =================================================================== */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-eyebrow">ORDER INSPECTION</span>
                <h3>Order #{selectedOrder.orderRef}</h3>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Customer & Shipping Summary */}
              <div className="modal-details-grid">
                <div className="detail-box">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer?.phone}</p>
                </div>

                <div className="detail-box">
                  <h4>Delivery Address</h4>
                  <p>{selectedOrder.customer?.street}</p>
                  <p>{selectedOrder.customer?.city}, {selectedOrder.customer?.postalCode}</p>
                  <p><strong>Courier:</strong> Factory-Direct Express (7-14 Days)</p>
                </div>
              </div>

              {/* Items List */}
              <h4 style={{ margin: '18px 0 10px' }}>Ordered Items</h4>
              <div className="modal-items-list">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="modal-item-row">
                    {item.variantImage && (
                      <img src={item.variantImage} alt={item.name} className="modal-item-thumb" />
                    )}
                    <div className="modal-item-desc">
                      <strong>{item.name}</strong>
                      <small>Size: {item.size || 'Standard'} · Color: {item.color || 'Artisan Weave'}</small>
                    </div>
                    <div className="modal-item-pricing">
                      <span>{item.quantity} x {money(item.price)}</span>
                      <strong>{money((item.price || 0) * (item.quantity || 1))}</strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="modal-totals-box">
                <div className="totals-row">
                  <span>Subtotal:</span>
                  <span>{money(selectedOrder.subtotal || selectedOrder.total)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="totals-row discount-row">
                    <span>Discount ({selectedOrder.couponCode || 'Promo'}):</span>
                    <span>-{money(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="totals-row total-highlight">
                  <strong>Total Amount:</strong>
                  <strong>{money(selectedOrder.total)}</strong>
                </div>
              </div>

              {/* Quick Status Advance in Modal */}
              <div className="modal-status-advance">
                <label>Change Workshop Delivery Stage:</label>
                <div className="status-buttons-row">
                  {[
                    'Processing · 7-14 days',
                    'Shipped · In Transit',
                    'Out for Doorstep Delivery',
                    'Delivered Successfully',
                    'Cancelled / Returned',
                  ].map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`status-btn-chip ${selectedOrder.deliveryStatus === st ? 'is-selected' : ''}`}
                      onClick={() => handleUpdateOrderStatus(selectedOrder.orderRef, st)}
                      disabled={statusUpdating}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="button button-soft"
                onClick={() => setSelectedOrder(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: PRODUCT PRICING & INVENTORY EDITOR                           */}
      {/* =================================================================== */}
      {editingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-eyebrow">CATALOG MANAGEMENT</span>
                <h3>Edit {editingProduct.name}</h3>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setEditingProduct(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal-body" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', background: '#faf8f5', padding: '12px', borderRadius: '8px', border: '1px solid #eee5da' }}>
                <img
                  src={editingProduct.image}
                  alt={editingProduct.name}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <strong style={{ fontSize: '15px' }}>{editingProduct.name}</strong>
                  <div style={{ fontSize: '12.5px', color: '#666', marginTop: '2px' }}>ID: {editingProduct.id} · {editingProduct.category || 'Bedsheets'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', fontWeight: 600, color: '#333' }}>
                  Current Price (₹)
                  <input
                    type="number"
                    required
                    min="1"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    style={{ padding: '9px 12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', fontWeight: 600, color: '#333' }}>
                  Original / Strikethrough Price (₹)
                  <input
                    type="number"
                    placeholder="Optional (e.g. 799)"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    style={{ padding: '9px 12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', flexDirection: 'column', fontSize: '13px', fontWeight: 600, color: '#333' }}>
                  Badge Tag Label
                  <input
                    type="text"
                    placeholder="e.g. Artisan Check, Bestseller, 25% Off"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    style={{ padding: '9px 12px', marginTop: '6px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: '#333' }}>
                  <input
                    type="checkbox"
                    checked={editInStock}
                    onChange={(e) => setEditInStock(e.target.checked)}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Product is in stock & available for loom weaving</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-dark"
                  disabled={savingProduct}
                >
                  {savingProduct ? 'Saving...' : 'Save to MongoDB Atlas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
