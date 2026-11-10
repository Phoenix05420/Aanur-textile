import React, { useState, useEffect, useMemo } from 'react';
import { store } from './data.js';
import { money } from './utils/format.js';
import { saved, authStorage, ordersStorage, STORAGE_KEYS } from './utils/storage.js';
import { Icon } from './components/common/Icon.jsx';

export default function ProfilePage({
  initialTab = 'overview',
  navigate,
  products = [],
  wishlist = [],
  onWish,
  onAdd,
  setToast,
  currentUser,
  setCurrentUser,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orderFilter, setOrderFilter] = useState('all');

  // ---------------------------------------------------------------------------
  // 01. Profile Overview State
  // ---------------------------------------------------------------------------
  const [profile, setProfile] = useState(() => {
    if (currentUser) return currentUser;
    const data = saved('aanur_profile_info', {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98427 51234',
      city: 'Tiruppur',
      state: 'Tamil Nadu',
      joinedDate: 'October 2024',
      avatarBg: '#b76b52',
    });
    if (data) {
      delete data.membership;
      delete data.loomCredits;
    }
    return data;
  });

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
      setProfileForm({ ...currentUser });
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aanur_profile_info', JSON.stringify(profile));
  }, [profile]);

  // ---------------------------------------------------------------------------
  // 02. My Orders State
  // ---------------------------------------------------------------------------
  const [orders, setOrders] = useState(() => {
    return ordersStorage.getOrders().filter((o) => o && o.orderRef);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // ---------------------------------------------------------------------------
  // 03. My Addresses State
  // ---------------------------------------------------------------------------
  const [addresses, setAddresses] = useState(() => {
    const raw = saved(STORAGE_KEYS.ADDRESSES, []);
    return Array.isArray(raw) ? raw.filter((a) => a && a.id) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  // ---------------------------------------------------------------------------
  // 04. Wishlist & Preferences State
  // ---------------------------------------------------------------------------
  const [savedAccessories, setSavedAccessories] = useState(() => {
    const raw = saved('aanur_saved_accessories', []);
    return Array.isArray(raw) ? raw.filter((a) => a && a.id) : [];
  });

  useEffect(() => {
    localStorage.setItem('aanur_saved_accessories', JSON.stringify(savedAccessories));
  }, [savedAccessories]);

  const [preferences, setPreferences] = useState(() =>
    saved('aanur_profile_preferences', {
      sizes: ['Double (90" x 100")', 'Queen (90" x 108")'],
      materials: ['100% Pure Cotton Weave', '100% Breathable Combed Cotton'],
      colors: ['#4f566e', '#7d4b2f', '#5b8650'],
      notifyWhatsapp: true,
      notifyLoomDrops: true,
      notifyNewsletter: false,
    })
  );

  useEffect(() => {
    localStorage.setItem('aanur_profile_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Combined saved list: saved pillows/towels + user's saved bedsheet products
  const combinedSavedItems = useMemo(() => {
    const fromProducts = products.filter((p) => wishlist.includes(p.id));
    return [...savedAccessories, ...fromProducts];
  }, [savedAccessories, products, wishlist]);

  // ---------------------------------------------------------------------------
  // Modals & UI States
  // ---------------------------------------------------------------------------
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...profile });

  const [addressModal, setAddressModal] = useState({
    isOpen: false,
    mode: 'add',
    data: {
      type: 'Home',
      fullName: '',
      phone: '',
      street: '',
      landmark: '',
      city: '',
      state: 'Tamil Nadu',
      pincode: '',
      isDefault: false,
    },
  });

  const [trackingOrder, setTrackingOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnForm, setReturnForm] = useState({ reason: 'Size or Dimension Adjustment', note: '', action: 'Replace with another size/color' });
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    const updated = { ...profile, ...profileForm };
    setProfile(updated);
    if (setCurrentUser) setCurrentUser(updated);
    localStorage.setItem('aanur_profile_info', JSON.stringify(updated));
    setEditProfileOpen(false);
    if (setToast) setToast('Profile details successfully updated.');
  };

  const handleOpenAddressModal = (mode, address = null) => {
    if (mode === 'edit' && address) {
      setAddressModal({ isOpen: true, mode: 'edit', data: { ...address } });
    } else {
      setAddressModal({
        isOpen: true,
        mode: 'add',
        data: {
          id: `addr-${Date.now()}`,
          type: 'Home',
          fullName: profile.name,
          phone: profile.phone,
          street: '',
          landmark: '',
          city: profile.city || 'Tiruppur',
          state: 'Tamil Nadu',
          pincode: '',
          isDefault: addresses.length === 0,
        },
      });
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    const data = addressModal.data;
    if (!data.street || !data.pincode || !data.city) {
      if (setToast) setToast('Please fill all required address fields.');
      return;
    }

    let updatedList;
    if (addressModal.mode === 'edit') {
      updatedList = addresses.map((addr) => {
        if (addr.id === data.id) {
          return { ...data };
        }
        return data.isDefault ? { ...addr, isDefault: false } : addr;
      });
    } else {
      const newAddr = { ...data, id: `addr-${Date.now()}` };
      if (data.isDefault) {
        updatedList = [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr];
      } else {
        updatedList = [...addresses, newAddr];
      }
    }

    setAddresses(updatedList);
    setAddressModal({ isOpen: false, mode: 'add', data: null });
    if (setToast) setToast('Delivery address saved successfully.');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    if (setToast) setToast('Default delivery address updated.');
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
    if (setToast) setToast('Address removed.');
  };

  const handleBuyAgain = (item) => {
    const productToBuy = products.find((p) => p.id === item.id) || {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      sizes: [item.size || 'Standard'],
      colors: [],
    };

    if (onAdd) {
      onAdd(productToBuy, 1, {
        colorIndex: 0,
        variantImage: item.image,
      });
    }
    if (setToast) setToast(`Added "${item.name}" back to your bag!`);
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    const ref = returnOrder?.orderRef || '';
    setReturnOrder(null);
    if (setToast) {
      setToast(`Request logged for ${ref}! Our Nathakadaiyur factory coordinator will call you to arrange doorstep pickup.`);
    }
  };

  const handleMoveWishlistToCart = (item) => {
    if (onAdd) {
      onAdd(item, 1, { colorIndex: 0, variantImage: item.image });
    }
    // Remove from saved list
    if (wishlist.includes(item.id) && onWish) {
      onWish(item.id);
    } else {
      setSavedAccessories((prev) => prev.filter((a) => a.id !== item.id));
    }
    if (setToast) setToast(`Moved "${item.name}" to your bag!`);
  };

  const handleRemoveSaved = (item) => {
    if (wishlist.includes(item.id) && onWish) {
      onWish(item.id);
    } else {
      setSavedAccessories((prev) => prev.filter((a) => a.id !== item.id));
    }
    if (setToast) setToast(`Removed "${item.name}" from saved list.`);
  };

  const handleTogglePreference = (type, value) => {
    setPreferences((prev) => {
      const currentList = prev[type] || [];
      const exists = currentList.includes(value);
      const updated = exists ? currentList.filter((v) => v !== value) : [...currentList, value];
      return { ...prev, [type]: updated };
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem('aanur_profile_preferences', JSON.stringify(preferences));
    if (setToast) setToast('Fabric preferences saved! We will customize your recommendations.');
  };

  const handleLogout = () => {
    authStorage.clearAuth();
    if (setCurrentUser) setCurrentUser(null);
    setLogoutModalOpen(false);
    if (setToast) setToast('You have been securely signed out.');
    if (navigate) navigate('/login');
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderFilter);
  }, [orders, orderFilter]);

  const activeOrdersCount = orders.filter((o) => o.status === 'processing' || o.status === 'shipped').length;

  return (
    <div className="profile-page page-pad">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <button onClick={() => navigate('/')}>Home</button>
        <span>/</span>
        <span>My Account</span>
      </div>

      <div className="profile-hero-banner">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar" style={{ backgroundColor: profile.avatarBg || '#b76b52' }}>
            {(profile.name || 'Artisan')
              .split(' ')
              .filter(Boolean)
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <span className="profile-online-dot" title="Account Active" />
        </div>

        <div className="profile-hero-info">
          <div className="profile-name-line">
            <h1>{profile.name}</h1>
          </div>
          <p className="profile-contact-meta">
            <span>
              <Icon name="mail" size={14} /> {profile.email}
            </span>
            <span className="dot-sep">·</span>
            <span>
              <Icon name="phone" size={14} /> {profile.phone}
            </span>
            <span className="dot-sep">·</span>
            <span>
              <Icon name="pin" size={14} /> {profile.city}, {profile.state}
            </span>
          </p>
        </div>

        <div className="profile-hero-actions">
          <button
            type="button"
            className="edit-profile-btn"
            onClick={() => {
              setProfileForm({ ...profile });
              setEditProfileOpen(true);
            }}
          >
            <Icon name="edit" size={15} />
            <span>Edit Profile</span>
          </button>
          <button
            type="button"
            className="profile-hero-logout-btn"
            onClick={handleLogout}
            title="Sign out of account (Shortcut: Alt+L)"
          >
            <Icon name="logout" size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Navigation Sidebar + Tab Content */}
      <div className="profile-layout">
        {/* Navigation Sidebar / Horizontal Pills on Mobile */}
        <nav className="profile-nav-sidebar" aria-label="Profile Sections">
          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'overview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Icon name="user" size={17} />
            <span>01. Profile Overview</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Icon name="box" size={17} />
            <span>02. My Orders</span>
            {activeOrdersCount > 0 && <span className="nav-badge">{activeOrdersCount} active</span>}
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'addresses' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <Icon name="pin" size={17} />
            <span>03. My Addresses</span>
            <span className="nav-count">{addresses.length}</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'wishlist' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <Icon name="heart" size={17} />
            <span>04. Wishlist & Preferences</span>
            <span className="nav-count">{combinedSavedItems.length}</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Icon name="settings" size={17} />
            <span>05. Account Settings</span>
          </button>

          <div className="profile-nav-divider" />

          <button
            type="button"
            className="profile-nav-btn profile-nav-logout-btn"
            onClick={handleLogout}
            title="Sign out of account (Shortcut: Alt+L)"
          >
            <Icon name="logout" size={17} />
            <span>Sign Out</span>
            <kbd className="profile-kbd-hint">Alt+L</kbd>
          </button>
        </nav>

        {/* Tab Content Panels */}
        <main className="profile-content-panel">
          {/* ================================================================= */}
          {/* TAB 1: PROFILE OVERVIEW                                           */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="tab-pane tab-overview">
              {/* 3 Stats Cards */}
              <div className="profile-stats-grid">
                <div className="stat-card" onClick={() => setActiveTab('orders')}>
                  <span className="stat-icon">
                    <Icon name="box" size={20} />
                  </span>
                  <div className="stat-details">
                    <span className="stat-value">{orders.length}</span>
                    <span className="stat-title">Total Orders</span>
                    <span className="stat-sub">{activeOrdersCount > 0 ? `${activeOrdersCount} in progress` : 'No active orders'}</span>
                  </div>
                  <Icon name="arrow" size={14} className="stat-arrow" />
                </div>

                <div className="stat-card" onClick={() => setActiveTab('addresses')}>
                  <span className="stat-icon">
                    <Icon name="pin" size={20} />
                  </span>
                  <div className="stat-details">
                    <span className="stat-value">{addresses.length}</span>
                    <span className="stat-title">Saved Addresses</span>
                    <span className="stat-sub">
                      {addresses.length > 0
                        ? `${addresses.find((a) => a.isDefault)?.city || 'Primary'} default`
                        : 'No addresses saved'}
                    </span>
                  </div>
                  <Icon name="arrow" size={14} className="stat-arrow" />
                </div>

                <div className="stat-card" onClick={() => setActiveTab('wishlist')}>
                  <span className="stat-icon">
                    <Icon name="heart" size={20} />
                  </span>
                  <div className="stat-details">
                    <span className="stat-value">{combinedSavedItems.length}</span>
                    <span className="stat-title">Saved Pieces</span>
                    <span className="stat-sub">
                      {combinedSavedItems.length > 0 ? 'Bedsheets & Towels' : 'No items saved'}
                    </span>
                  </div>
                  <Icon name="arrow" size={14} className="stat-arrow" />
                </div>


              </div>


              {/* Active Order Spotlight */}
              {orders.find((o) => o.status === 'processing') && (
                <div className="active-order-spotlight">
                  <div className="spotlight-head">
                    <div>
                      <span className="eyebrow">ACTIVE FACTORY ORDER</span>
                      <h3>Order {orders.find((o) => o.status === 'processing').orderRef} is on the Loom</h3>
                      <p>
                        Woven in Nathakadaiyur · Doorstep delivery expected by{' '}
                        <strong>{orders.find((o) => o.status === 'processing').deliveryEstimate}</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="button button-dark"
                      onClick={() => setTrackingOrder(orders.find((o) => o.status === 'processing'))}
                    >
                      <Icon name="truck" size={15} />
                      <span>Track Order</span>
                    </button>
                  </div>
                  <div className="spotlight-item-row">
                    <img
                      src={orders.find((o) => o.status === 'processing').items[0].image}
                      alt="Active bedsheet order"
                    />
                    <div>
                      <strong>{orders.find((o) => o.status === 'processing').items[0].name}</strong>
                      <span>
                        Size: {orders.find((o) => o.status === 'processing').items[0].size} · Color:{' '}
                        {orders.find((o) => o.status === 'processing').items[0].color}
                      </span>
                      <span>Total: {money(orders.find((o) => o.status === 'processing').total)} · Cash on Delivery</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Shortcuts */}
              <div className="profile-quick-shortcuts">
                <h3>Quick Shortcuts</h3>
                <div className="shortcuts-grid">
                  <button type="button" onClick={() => setActiveTab('orders')}>
                    <Icon name="box" size={16} />
                    <span>View all orders & invoices</span>
                  </button>
                  <button type="button" onClick={() => handleOpenAddressModal('add')}>
                    <Icon name="plus" size={16} />
                    <span>Add a new delivery address</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab('wishlist')}>
                    <Icon name="heart" size={16} />
                    <span>Manage favorite fabrics & colors</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab('settings')}>
                    <Icon name="settings" size={16} />
                    <span>Notification & privacy preferences</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: MY ORDERS                                                  */}
          {/* ================================================================= */}
          {activeTab === 'orders' && (
            <div className="tab-pane tab-orders">
              <div className="pane-header">
                <div>
                  <span className="eyebrow">YOUR FACTORY DISPATCHES</span>
                  <h2>My Orders</h2>
                  <p>Track progress from loom weaving to doorstep delivery across India.</p>
                </div>
                <button type="button" className="button button-outline" onClick={() => navigate('/shop')}>
                  <span>Shop New Arrivals</span>
                  <Icon name="arrow" size={14} />
                </button>
              </div>

              {/* Order Status Tabs */}
              <div className="order-filter-bar">
                {[
                  ['all', `All (${orders.length})`],
                  ['processing', `Processing (${orders.filter((o) => o.status === 'processing').length})`],
                  ['shipped', `Shipped (${orders.filter((o) => o.status === 'shipped').length})`],
                  ['delivered', `Delivered (${orders.filter((o) => o.status === 'delivered').length})`],
                  ['cancelled', `Cancelled (${orders.filter((o) => o.status === 'cancelled').length})`],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`order-tab-btn ${orderFilter === key ? 'is-active' : ''}`}
                    onClick={() => setOrderFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              <div className="orders-cards-list">
                {filteredOrders.length === 0 ? (
                  <div className="empty-state">
                    <Icon name="box" size={32} />
                    <h3>{orderFilter === 'all' ? 'No orders placed yet' : `No ${orderFilter} orders found`}</h3>
                    <p>
                      {orderFilter === 'all'
                        ? 'When you order handcrafted bedsheets or home textiles from our workshop, they will appear here with live tracking.'
                        : `You don’t have any orders under ${orderFilter} at the moment.`}
                    </p>
                    <button
                      type="button"
                      className="button button-dark"
                      onClick={() => (orderFilter === 'all' ? navigate('/shop') : setOrderFilter('all'))}
                    >
                      {orderFilter === 'all' ? 'Browse Collections' : 'View all orders'}
                    </button>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <article key={order.orderRef} className="profile-order-card">
                      <div className="order-card-header">
                        <div className="order-meta-col">
                          <span className="order-ref-code">{order.orderRef}</span>
                          <span className="order-date-text">Placed on {order.date}</span>
                        </div>
                        <div className="order-status-col">
                          <span className={`status-pill status-${order.status}`}>{order.statusLabel}</span>
                          <span className="order-total-amount">{money(order.total)}</span>
                        </div>
                      </div>

                      <div className="order-card-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <img src={item.image} alt={item.name} />
                            <div className="order-item-info">
                              <h4>{item.name}</h4>
                              <p className="order-item-specs">
                                Size: <strong>{item.size}</strong> · Color: <strong>{item.color}</strong> · Qty: {item.quantity}
                              </p>
                              <span className="order-item-price">{money(item.price)}</span>
                            </div>
                            <div className="order-item-actions">
                              <button
                                type="button"
                                className="button button-outline mini-btn"
                                onClick={() => handleBuyAgain(item)}
                              >
                                <Icon name="refresh" size={13} />
                                <span>Buy Again</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <div className="order-delivery-status">
                          <Icon name="truck" size={16} />
                          <div>
                            <strong>{order.courier}</strong>
                            <span>
                              {order.status === 'delivered'
                                ? 'Delivered successfully to doorstep'
                                : order.status === 'cancelled'
                                ? 'Cancelled & refund completed'
                                : `Tracking: ${order.trackingNumber} · Est. ${order.deliveryEstimate}`}
                            </span>
                          </div>
                        </div>

                        <div className="order-footer-btn-group">
                          {order.status !== 'cancelled' && (
                            <button
                              type="button"
                              className="button button-dark mini-btn"
                              onClick={() => setTrackingOrder(order)}
                            >
                              <Icon name="truck" size={14} />
                              <span>Track Order</span>
                            </button>
                          )}

                          {order.status === 'delivered' && (
                            <button
                              type="button"
                              className="button button-outline mini-btn"
                              onClick={() => setReturnOrder(order)}
                            >
                              <span>Return or Replace</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: MY ADDRESSES                                               */}
          {/* ================================================================= */}
          {activeTab === 'addresses' && (
            <div className="tab-pane tab-addresses">
              <div className="pane-header">
                <div>
                  <span className="eyebrow">SAVED DELIVERY DESTINATIONS</span>
                  <h2>My Addresses</h2>
                  <p>Manage your home, studio, and workplace addresses for fast doorstep delivery.</p>
                </div>
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => handleOpenAddressModal('add')}
                >
                  <Icon name="plus" size={15} />
                  <span>Add a New Address</span>
                </button>
              </div>

              {/* Delivery Serviceability Callout */}
              <div className="delivery-pincode-banner">
                <Icon name="shield" size={18} />
                <div>
                  <strong>Factory-Direct Delivery Coverage (7 to 14 Days)</strong>
                  <p>
                    All saved addresses in Kangayam, Tiruppur, Coimbatore, and across India are serviced directly from our
                    Nathakadaiyur workshop with Cash on Delivery and pre-paid options.
                  </p>
                </div>
              </div>

              {/* Addresses Cards Grid */}
              {addresses.length === 0 ? (
                <div className="empty-state">
                  <Icon name="pin" size={32} />
                  <h3>No delivery addresses saved yet</h3>
                  <p>Add your home or workplace delivery address for fast doorstep delivery across India.</p>
                  <button
                    type="button"
                    className="button button-dark"
                    onClick={() => handleOpenAddressModal('add')}
                  >
                    <Icon name="plus" size={15} />
                    <span>Add Delivery Address</span>
                  </button>
                </div>
              ) : (
                <div className="addresses-grid">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`address-card ${addr.isDefault ? 'is-default-card' : ''}`}>
                      <div className="address-card-top">
                        <div className="address-badges">
                          <span className="addr-type-pill">{addr.type.toUpperCase()}</span>
                          {addr.isDefault && <span className="default-pill">DEFAULT ADDRESS</span>}
                        </div>
                        <div className="addr-actions-top">
                          <button
                            type="button"
                            className="icon-action-btn"
                            title="Edit address"
                            onClick={() => handleOpenAddressModal('edit', addr)}
                          >
                            <Icon name="edit" size={15} />
                          </button>
                          <button
                            type="button"
                            className="icon-action-btn delete-btn"
                            title="Delete address"
                            onClick={() => handleDeleteAddress(addr.id)}
                          >
                            <Icon name="trash" size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="address-body">
                        <h3>{addr.fullName}</h3>
                        <p className="addr-phone">
                          <Icon name="phone" size={14} /> {addr.phone}
                        </p>
                        <p className="addr-street">{addr.street}</p>
                        {addr.landmark && <p className="addr-landmark">Landmark: {addr.landmark}</p>}
                        <p className="addr-city-pin">
                          {addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                        </p>
                      </div>

                      <div className="address-card-footer">
                        {addr.isDefault ? (
                          <span className="default-check-text">
                            <Icon name="check" size={14} /> Default Delivery Address
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-link"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                          >
                            Set as default delivery address
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: WISHLIST & PREFERENCES                                     */}
          {/* ================================================================= */}
          {activeTab === 'wishlist' && (
            <div className="tab-pane tab-wishlist">
              <div className="pane-header">
                <div>
                  <span className="eyebrow">CURATED COMFORTS</span>
                  <h2>Wishlist & Preferences</h2>
                  <p>Your saved handcrafted bedsheets, pillows, towels, and fabric taste profile.</p>
                </div>
              </div>

              {/* Section 1: Saved Items (Pillows, Towels & Bedsheets) */}
              <div className="wishlist-sub-section">
                <div className="sub-section-head">
                  <h3>Saved Pillows, Towels & Bedsheets ({combinedSavedItems.length})</h3>
                  <button type="button" className="text-link" onClick={() => navigate('/shop')}>
                    Browse Full Catalog <Icon name="arrow" size={13} />
                  </button>
                </div>

                {combinedSavedItems.length === 0 ? (
                  <div className="empty-state">
                    <Icon name="heart" size={32} />
                    <h3>Your saved collection is empty</h3>
                    <p>Explore our pure cotton bedsheets and waffle towels, and save your favorite pieces here.</p>
                    <button type="button" className="button button-dark" onClick={() => navigate('/shop')}>
                      Browse Collections
                    </button>
                  </div>
                ) : (
                  <div className="saved-items-grid">
                    {combinedSavedItems.map((item) => (
                      <article key={item.id} className="saved-item-card">
                        <div className="saved-img-wrap">
                          <img src={item.image} alt={item.name} />
                          {item.badge && <span className="saved-badge">{item.badge}</span>}
                          <button
                            type="button"
                            className="saved-remove-btn"
                            title="Remove from saved"
                            onClick={() => handleRemoveSaved(item)}
                          >
                            <Icon name="close" size={14} />
                          </button>
                        </div>
                        <div className="saved-item-info">
                          <h4>{item.name}</h4>
                          <span className="saved-material">{item.material || '100% Pure Combed Cotton'}</span>
                          <div className="saved-price-line">
                            <strong>{money(item.price)}</strong>
                            {item.originalPrice > item.price && <del>{money(item.originalPrice)}</del>}
                          </div>
                          <button
                            type="button"
                            className="button button-dark full-width mini-btn"
                            onClick={() => handleMoveWishlistToCart(item)}
                          >
                            <Icon name="bag" size={14} />
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Preferred Colors, Sizes & Materials */}
              <div className="fabric-preferences-section">
                <div className="sub-section-head">
                  <div>
                    <h3>Your Fabric & Loom Preferences</h3>
                    <p>Tell us what fits your sleeping habits so we can tailor future artisan loom batches.</p>
                  </div>
                  <button type="button" className="button button-dark mini-btn" onClick={handleSavePreferences}>
                    <span>Save Preferences</span>
                  </button>
                </div>

                <div className="preferences-form-grid">
                  {/* Preferred Sizes */}
                  <div className="pref-group">
                    <label className="pref-label">Preferred Bedsheet Sizes</label>
                    <div className="chip-group">
                      {['Single (60" x 90")', 'Double (90" x 100")', 'Queen (90" x 108")', 'King (108" x 108")'].map(
                        (sz) => {
                          const isSelected = preferences.sizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              className={`pref-chip ${isSelected ? 'is-selected' : ''}`}
                              onClick={() => handleTogglePreference('sizes', sz)}
                            >
                              {isSelected && <Icon name="check" size={13} />}
                              <span>{sz}</span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Preferred Materials */}
                  <div className="pref-group">
                    <label className="pref-label">Preferred Textile Materials</label>
                    <div className="chip-group">
                      {[
                        '100% Pure Cotton Weave',
                        '100% Breathable Combed Cotton',
                        'Breathable Cotton-Linen',
                        'Easy-Care Poly-Cotton Blend',
                        'Organic Artisan Sateen',
                      ].map((mat) => {
                        const isSelected = preferences.materials.includes(mat);
                        return (
                          <button
                            key={mat}
                            type="button"
                            className={`pref-chip ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => handleTogglePreference('materials', mat)}
                          >
                            {isSelected && <Icon name="check" size={13} />}
                            <span>{mat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Preferred Color Tones */}
                  <div className="pref-group">
                    <label className="pref-label">Preferred Color Palette</label>
                    <div className="color-pref-grid">
                      {[
                        { color: '#4f566e', label: 'Midnight Navy' },
                        { color: '#7d4b2f', label: 'Terracotta Rust' },
                        { color: '#5b8650', label: 'Forest Olive' },
                        { color: '#7a6d66', label: 'Cocoa Brown' },
                        { color: '#ad7f45', label: 'Mustard Ochre' },
                        { color: '#b03c45', label: 'Rustic Crimson' },
                      ].map(({ color, label }) => {
                        const isSelected = preferences.colors.includes(color);
                        return (
                          <button
                            key={color}
                            type="button"
                            className={`color-pref-pill ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => handleTogglePreference('colors', color)}
                          >
                            <span className="color-swatch-circle" style={{ backgroundColor: color }}>
                              {isSelected && <Icon name="check" size={12} style={{ color: '#fff' }} />}
                            </span>
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: ACCOUNT SETTINGS                                           */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="tab-pane tab-settings">
              <div className="pane-header">
                <div>
                  <span className="eyebrow">PREFERENCES & PRIVACY</span>
                  <h2>Account Settings</h2>
                  <p>Manage communications, notification preferences, and privacy controls.</p>
                </div>
              </div>

              <div className="settings-cards-stack">
                {/* 1. Notification Preferences */}
                <div className="settings-card">
                  <div className="settings-card-header">
                    <Icon name="mail" size={20} />
                    <div>
                      <h3>Notification Preferences</h3>
                      <p>Control what updates and messages you receive from the factory team.</p>
                    </div>
                  </div>
                  <div className="toggles-list">
                    <label className="toggle-row">
                      <div>
                        <strong>Order Status via WhatsApp & SMS</strong>
                        <span>Real-time dispatch, transit, and delivery updates</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifyWhatsapp}
                        onChange={(e) => setPreferences({ ...preferences, notifyWhatsapp: e.target.checked })}
                      />
                    </label>

                    <label className="toggle-row">
                      <div>
                        <strong>Loom Drops & Secret Coupon Alerts</strong>
                        <span>Receive exclusive 15% offers and limited artisan runs</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifyLoomDrops}
                        onChange={(e) => setPreferences({ ...preferences, notifyLoomDrops: e.target.checked })}
                      />
                    </label>

                    <label className="toggle-row">
                      <div>
                        <strong>Aanur Textile Monthly Care Journal</strong>
                        <span>Fabric longevity guides and natural washing tips</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifyNewsletter}
                        onChange={(e) => setPreferences({ ...preferences, notifyNewsletter: e.target.checked })}
                      />
                    </label>
                  </div>
                </div>

               
                {/* 3. Logout */}
                <div className="settings-card danger-card">
                  <div className="settings-card-header">
                    <Icon name="logout" size={20} />
                    <div>
                      <div className="settings-card-title-row">
                        <h3>Sign Out</h3>
                        <kbd className="settings-kbd-hint">Alt+L</kbd>
                      </div>
                      <p>Sign out of your Aanur Textile account on this browser. Shortcut: Press Alt+L from any page.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-outline danger-btn mini-btn"
                    onClick={() => setLogoutModalOpen(true)}
                  >
                    <Icon name="logout" size={14} />
                    <span>Log Out of Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: EDIT PROFILE                                                 */}
      {/* ===================================================================== */}
      {editProfileOpen && (
        <div className="profile-modal-backdrop" onClick={() => setEditProfileOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile Information</h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditProfileOpen(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleEditProfileSubmit}>
              <div className="modal-body">
                <label>
                  Full Name
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </label>
                <label>
                  Email Address
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  />
                </label>
                <label>
                  Phone Number
                  <input
                    type="tel"
                    required
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  />
                </label>
                <div className="form-row-2">
                  <label>
                    City
                    <input
                      type="text"
                      required
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    />
                  </label>
                  <label>
                    State
                    <input
                      type="text"
                      required
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                    />
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="button button-outline" onClick={() => setEditProfileOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="button button-dark">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ADD / EDIT ADDRESS                                           */}
      {/* ===================================================================== */}
      {addressModal.isOpen && addressModal.data && (
        <div className="profile-modal-backdrop" onClick={() => setAddressModal({ isOpen: false, mode: 'add', data: null })}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{addressModal.mode === 'edit' ? 'Edit Delivery Address' : 'Add New Delivery Address'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setAddressModal({ isOpen: false, mode: 'add', data: null })}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveAddress}>
              <div className="modal-body">
                <div className="form-row-2">
                  <label>
                    Address Type
                    <select
                      value={addressModal.data.type}
                      onChange={(e) =>
                        setAddressModal({
                          ...addressModal,
                          data: { ...addressModal.data, type: e.target.value },
                        })
                      }
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work / Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label>
                    Recipient Name
                    <input
                      type="text"
                      required
                      value={addressModal.data.fullName}
                      onChange={(e) =>
                        setAddressModal({
                          ...addressModal,
                          data: { ...addressModal.data, fullName: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  Phone Number
                  <input
                    type="tel"
                    required
                    value={addressModal.data.phone}
                    onChange={(e) =>
                      setAddressModal({
                        ...addressModal,
                        data: { ...addressModal.data, phone: e.target.value },
                      })
                    }
                  />
                </label>

                <label>
                  Street Address & Flat / House No.
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1/367 Merkuthottam, Palayakottai Road"
                    value={addressModal.data.street}
                    onChange={(e) =>
                      setAddressModal({
                        ...addressModal,
                        data: { ...addressModal.data, street: e.target.value },
                      })
                    }
                  />
                </label>

                <label>
                  Landmark (Optional)
                  <input
                    type="text"
                    placeholder="e.g. Near Bus Stop"
                    value={addressModal.data.landmark}
                    onChange={(e) =>
                      setAddressModal({
                        ...addressModal,
                        data: { ...addressModal.data, landmark: e.target.value },
                      })
                    }
                  />
                </label>

                <div className="form-row-3">
                  <label>
                    City
                    <input
                      type="text"
                      required
                      value={addressModal.data.city}
                      onChange={(e) =>
                        setAddressModal({
                          ...addressModal,
                          data: { ...addressModal.data, city: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    State
                    <input
                      type="text"
                      required
                      value={addressModal.data.state}
                      onChange={(e) =>
                        setAddressModal({
                          ...addressModal,
                          data: { ...addressModal.data, state: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    PIN Code
                    <input
                      type="text"
                      required
                      placeholder="638108"
                      value={addressModal.data.pincode}
                      onChange={(e) =>
                        setAddressModal({
                          ...addressModal,
                          data: { ...addressModal.data, pincode: e.target.value },
                        })
                      }
                    />
                  </label>
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={addressModal.data.isDefault}
                    onChange={(e) =>
                      setAddressModal({
                        ...addressModal,
                        data: { ...addressModal.data, isDefault: e.target.checked },
                      })
                    }
                  />
                  <span>Make this my default delivery address</span>
                </label>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setAddressModal({ isOpen: false, mode: 'add', data: null })}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-dark">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: TRACK ORDER TIMELINE                                         */}
      {/* ===================================================================== */}
      {trackingOrder && (
        <div className="profile-modal-backdrop" onClick={() => setTrackingOrder(null)}>
          <div className="profile-modal tracking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Order Tracking · {trackingOrder.orderRef}</h3>
                <span className="modal-sub">
                  Courier: <strong>{trackingOrder.courier}</strong> (AWB: {trackingOrder.trackingNumber})
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setTrackingOrder(null)}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="tracking-timeline-v">
                <div className="timeline-step is-complete">
                  <div className="step-bullet">
                    <Icon name="check" size={12} />
                  </div>
                  <div className="step-content">
                    <strong>1. Order Confirmed</strong>
                    <span>Received at Nathakadaiyur Workshop · {trackingOrder.date}</span>
                  </div>
                </div>

                <div className={`timeline-step ${trackingOrder.status !== 'cancelled' ? 'is-complete' : ''}`}>
                  <div className="step-bullet">
                    <Icon name="check" size={12} />
                  </div>
                  <div className="step-content">
                    <strong>2. Loom Weaving & Inspection</strong>
                    <span>Handcrafted long-staple cotton weave verified in-house</span>
                  </div>
                </div>

                <div
                  className={`timeline-step ${
                    trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'is-complete' : ''
                  }`}
                >
                  <div className="step-bullet">
                    {trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? (
                      <Icon name="check" size={12} />
                    ) : (
                      '3'
                    )}
                  </div>
                  <div className="step-content">
                    <strong>3. Dispatched from Workshop</strong>
                    <span>Handed over to {trackingOrder.courier}</span>
                  </div>
                </div>

                <div className={`timeline-step ${trackingOrder.status === 'delivered' ? 'is-complete' : ''}`}>
                  <div className="step-bullet">{trackingOrder.status === 'delivered' ? <Icon name="check" size={12} /> : '4'}</div>
                  <div className="step-content">
                    <strong>4. Out for Delivery</strong>
                    <span>Courier out for doorstep verification</span>
                  </div>
                </div>

                <div className={`timeline-step ${trackingOrder.status === 'delivered' ? 'is-complete' : ''}`}>
                  <div className="step-bullet">{trackingOrder.status === 'delivered' ? <Icon name="check" size={12} /> : '5'}</div>
                  <div className="step-content">
                    <strong>5. Doorstep Delivery</strong>
                    <span>
                      {trackingOrder.status === 'delivered'
                        ? 'Delivered to your address'
                        : `Estimated by ${trackingOrder.deliveryEstimate}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="button button-dark" onClick={() => setTrackingOrder(null)}>
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: RETURN OR REPLACE                                            */}
      {/* ===================================================================== */}
      {returnOrder && (
        <div className="profile-modal-backdrop" onClick={() => setReturnOrder(null)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Return or Replace Items</h3>
                <span className="modal-sub">Order {returnOrder.orderRef} · 7-Day Hassle-Free Factory Exchange</span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setReturnOrder(null)}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit}>
              <div className="modal-body">
                <label>
                  Preferred Resolution
                  <select
                    value={returnForm.action}
                    onChange={(e) => setReturnForm({ ...returnForm, action: e.target.value })}
                  >
                    <option value="Replace with another size/color">Replace with another size / color variant</option>
                    <option value="Full Refund to UPI / Bank">Return and receive full refund to UPI / Bank</option>
                    <option value="Loom Credits Bonus">Convert to Loom Store Credits (with +10% bonus)</option>
                  </select>
                </label>

                <label>
                  Reason for Return or Exchange
                  <select
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  >
                    <option value="Size or Dimension Adjustment">Size adjustment (e.g. Queen to King)</option>
                    <option value="Color or Pattern Preference">Color preference (exchange for another variant)</option>
                    <option value="Fabric Softness or Material Query">Fabric or material query</option>
                    <option value="Transit Packaging Defect">Packaging or transit issue</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label>
                  Additional Details / Notes
                  <textarea
                    rows={3}
                    placeholder="Tell us any specific instructions for our workshop team..."
                    value={returnForm.note}
                    onChange={(e) => setReturnForm({ ...returnForm, note: e.target.value })}
                  />
                </label>

                <div className="pickup-callout">
                  <Icon name="truck" size={18} />
                  <div>
                    <strong>Complimentary Doorstep Factory Pickup</strong>
                    <p>Our courier partner will pick up the item securely from your default address within 48 hours.</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="button button-outline" onClick={() => setReturnOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="button button-dark">
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: LOGOUT CONFIRMATION                                          */}
      {/* ===================================================================== */}
      {logoutModalOpen && (
        <div className="profile-modal-backdrop" onClick={() => setLogoutModalOpen(false)}>
          <div className="profile-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sign Out of Aanur Textile?</h3>
              <button type="button" className="modal-close-btn" onClick={() => setLogoutModalOpen(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to sign out? Your saved cart and favorites will remain safely in your browser.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="button button-outline" onClick={() => setLogoutModalOpen(false)}>
                Stay Signed In
              </button>
              <button type="button" className="button button-dark danger-confirm-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
