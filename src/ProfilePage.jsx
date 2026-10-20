import React, { useState, useEffect, useMemo } from 'react';
import { store } from './data.js';

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

const saved = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

function ProfileIcon({ name, size = 18, ...props }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    box: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 12v10" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    heart: <path d="M20.8 8.8c0 4.5-8.8 10-8.8 10s-8.8-5.5-8.8-10A4.5 4.5 0 0 1 12 6.2a4.5 4.5 0 0 1 8.8 2.6Z" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    truck: <><path d="M3 6h11v11H3z" /><path d="M14 10h4l3 3v4h-7" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {paths[name] || paths.check}
    </svg>
  );
}

export default function ProfilePage({
  initialTab = 'overview',
  navigate,
  products = [],
  wishlist = [],
  onWish,
  onAdd,
  setToast,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orderFilter, setOrderFilter] = useState('all');

  // ---------------------------------------------------------------------------
  // 01. Profile Overview State
  // ---------------------------------------------------------------------------
  const [profile, setProfile] = useState(() => {
    const data = saved('aanur_profile_info', {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98427 51234',
      city: 'Tiruppur',
      state: 'Tamil Nadu',
      joinedDate: 'October 2024',
      avatarBg: '#b76b52',
      loomCredits: 450,
    });
    if (data && data.membership) {
      delete data.membership;
    }
    return data;
  });

  useEffect(() => {
    localStorage.setItem('aanur_profile_info', JSON.stringify(profile));
  }, [profile]);

  // ---------------------------------------------------------------------------
  // 02. My Orders State
  // ---------------------------------------------------------------------------
  const FAKE_ORDER_REFS = ['AT-892415', 'AT-742918', 'AT-619024', 'AT-501239'];

  const [orders, setOrders] = useState(() => {
    const raw = saved('aanur_profile_orders', []);
    if (!Array.isArray(raw)) return [];
    return raw.filter((o) => o && o.orderRef && !FAKE_ORDER_REFS.includes(o.orderRef));
  });

  useEffect(() => {
    localStorage.setItem('aanur_profile_orders', JSON.stringify(orders));
  }, [orders]);

  // ---------------------------------------------------------------------------
  // 03. My Addresses State
  // ---------------------------------------------------------------------------
  const [addresses, setAddresses] = useState(() =>
    saved('aanur_profile_addresses', [
      {
        id: 'addr-1',
        type: 'Home',
        isDefault: true,
        fullName: 'Priya Sharma',
        phone: '+91 98427 51234',
        street: 'Flat 402, Green Meadow Apartments, Palayakottai Road',
        landmark: 'Near Palayakottai Bus Stop',
        city: 'Kangayam',
        state: 'Tamil Nadu',
        pincode: '638108',
      },
      {
        id: 'addr-2',
        type: 'Work',
        isDefault: false,
        fullName: 'Priya Sharma (Design Studio)',
        phone: '+91 98427 51234',
        street: 'Studio 4B, Mill Compound, Avinashi Road',
        landmark: 'Behind New Bus Stand',
        city: 'Tiruppur',
        state: 'Tamil Nadu',
        pincode: '641602',
      },
    ])
  );

  useEffect(() => {
    localStorage.setItem('aanur_profile_addresses', JSON.stringify(addresses));
  }, [addresses]);

  // ---------------------------------------------------------------------------
  // 04. Wishlist & Preferences State
  // ---------------------------------------------------------------------------
  const defaultSavedAccessories = [
    {
      id: 'acc-01',
      name: 'Handcrafted Pure Cotton Bolster Pillows (Set of 2)',
      category: 'Pillows',
      price: 449,
      originalPrice: 599,
      material: '100% Combed Cotton Casing',
      image: '/products/p07/folded-1.jpeg',
      badge: 'Artisan Bolster',
    },
    {
      id: 'acc-02',
      name: 'Artisan Woven Waffle Bath Towel (Dusty Olive)',
      category: 'Towels',
      price: 399,
      originalPrice: 499,
      material: 'Ultra-absorbent Waffle Weave',
      image: '/products/p07/folded-3.jpeg',
      badge: 'Quick-Dry Waffle',
    },
  ];

  const [savedAccessories, setSavedAccessories] = useState(() =>
    saved('aanur_saved_accessories', defaultSavedAccessories)
  );

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
    setProfile({ ...profileForm });
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
    if (addresses.length <= 1) {
      if (setToast) setToast('You must keep at least one delivery address.');
      return;
    }
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

  const handleDownloadData = () => {
    const dataDump = {
      profile,
      addresses,
      orders,
      preferences,
      exportDate: new Date().toISOString(),
      store: 'Aanur Textile (Nathakadaiyur, Tamil Nadu)',
    };
    const blob = new Blob([JSON.stringify(dataDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aanur-textile-account-data-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (setToast) setToast('Account data export downloaded.');
  };

  const handleLogout = () => {
    setLogoutModalOpen(false);
    if (setToast) setToast('You have been securely signed out. Have a wonderful day!');
    if (navigate) navigate('/');
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
            {profile.name
              .split(' ')
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
              <ProfileIcon name="mail" size={14} /> {profile.email}
            </span>
            <span className="dot-sep">·</span>
            <span>
              <ProfileIcon name="phone" size={14} /> {profile.phone}
            </span>
            <span className="dot-sep">·</span>
            <span>
              <ProfileIcon name="pin" size={14} /> {profile.city}, {profile.state}
            </span>
          </p>
        </div>

        <div className="profile-hero-actions">
          <button
            type="button"
            className="button button-dark edit-profile-btn"
            onClick={() => {
              setProfileForm({ ...profile });
              setEditProfileOpen(true);
            }}
          >
            <ProfileIcon name="edit" size={15} />
            <span>Edit Profile</span>
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
            <ProfileIcon name="user" size={17} />
            <span>01. Profile Overview</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ProfileIcon name="box" size={17} />
            <span>02. My Orders</span>
            {activeOrdersCount > 0 && <span className="nav-badge">{activeOrdersCount} active</span>}
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'addresses' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <ProfileIcon name="pin" size={17} />
            <span>03. My Addresses</span>
            <span className="nav-count">{addresses.length}</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'wishlist' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <ProfileIcon name="heart" size={17} />
            <span>04. Wishlist & Preferences</span>
            <span className="nav-count">{combinedSavedItems.length}</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <ProfileIcon name="settings" size={17} />
            <span>05. Account Settings</span>
          </button>
        </nav>

        {/* Tab Content Panels */}
        <main className="profile-content-panel">
          {/* ================================================================= */}
          {/* TAB 1: PROFILE OVERVIEW                                           */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="tab-pane tab-overview">
              <div className="welcome-guild-card">
                <div className="guild-card-left">
                  <span className="eyebrow">AANUR ARTISAN GUILD · MEMBER REWARDS</span>
                  <h2>Welcome back, {profile.name.split(' ')[0]}!</h2>
                  <p>
                    Your account is directly linked to our workshop in Nathakadaiyur, Tamil Nadu. You have{' '}
                    <strong>₹{profile.loomCredits} Loom Reward Credits</strong> available for factory-direct savings, plus priority loom
                    scheduling on all pure cotton weaves.
                  </p>
                </div>
                <div className="guild-card-right">
                  <div className="credits-badge">
                    <span className="credits-num">₹{profile.loomCredits}</span>
                    <span className="credits-lbl">Loom Credits</span>
                  </div>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="profile-stats-grid">
                <div className="stat-card" onClick={() => setActiveTab('orders')}>
                  <span className="stat-icon">
                    <ProfileIcon name="box" size={20} />
                  </span>
                  <div className="stat-details">
                    <span className="stat-value">{orders.length}</span>
                    <span className="stat-title">Total Orders</span>
                    <span className="stat-sub">{activeOrdersCount > 0 ? `${activeOrdersCount} in progress` : 'No active orders'}</span>
                  </div>
                  <ProfileIcon name="arrow" size={14} className="stat-arrow" />
                </div>

                <div className="stat-card" onClick={() => setActiveTab('addresses')}>
                  <span className="stat-icon">
                    <ProfileIcon name="pin" size={20} />
                  </span>
                  <div className="stat-details">
                    <span className="stat-value">{addresses.length}</span>
                    <span className="stat-title">Saved Addresses</span>
                    <span className="stat-sub">{addresses.find((a) => a.isDefault)?.city || 'Primary'} default</span>
                  </div>
                  <ProfileIcon name="arrow" size={14} className="stat-arrow" />
                </div>

                <div className="stat-card" onClick={() => setActiveTab('wishlist')}>
                  <span className="stat-icon">
                    <ProfileIcon name="heart" size={20} />
                  </span>
                  <div className="stat-details">
                    <span className="stat-value">{combinedSavedItems.length}</span>
                    <span className="stat-title">Saved Pieces</span>
                    <span className="stat-sub">Bedsheets & Towels</span>
                  </div>
                  <ProfileIcon name="arrow" size={14} className="stat-arrow" />
                </div>

                <div className="stat-card" onClick={() => setActiveTab('settings')}>
                  <span className="stat-icon">
                    <ProfileIcon name="settings" size={20} />
                  </span>
                  <div className="stat-details">
                    <span className="stat-value">Active</span>
                    <span className="stat-title">Preferences</span>
                    <span className="stat-sub">Notifications & Data</span>
                  </div>
                  <ProfileIcon name="arrow" size={14} className="stat-arrow" />
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
                      <ProfileIcon name="truck" size={15} />
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
                    <ProfileIcon name="box" size={16} />
                    <span>View all orders & invoices</span>
                  </button>
                  <button type="button" onClick={() => handleOpenAddressModal('add')}>
                    <ProfileIcon name="plus" size={16} />
                    <span>Add a new delivery address</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab('wishlist')}>
                    <ProfileIcon name="heart" size={16} />
                    <span>Manage favorite fabrics & colors</span>
                  </button>
                  <button type="button" onClick={() => setActiveTab('settings')}>
                    <ProfileIcon name="settings" size={16} />
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
                  <ProfileIcon name="arrow" size={14} />
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
                    <ProfileIcon name="box" size={32} />
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
                                <ProfileIcon name="refresh" size={13} />
                                <span>Buy Again</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-card-footer">
                        <div className="order-delivery-status">
                          <ProfileIcon name="truck" size={16} />
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
                              <ProfileIcon name="truck" size={14} />
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
                  <ProfileIcon name="plus" size={15} />
                  <span>Add a New Address</span>
                </button>
              </div>

              {/* Delivery Serviceability Callout */}
              <div className="delivery-pincode-banner">
                <ProfileIcon name="shield" size={18} />
                <div>
                  <strong>Factory-Direct Delivery Coverage (7 to 14 Days)</strong>
                  <p>
                    All saved addresses in Kangayam, Tiruppur, Coimbatore, and across India are serviced directly from our
                    Nathakadaiyur workshop with Cash on Delivery and pre-paid options.
                  </p>
                </div>
              </div>

              {/* Addresses Cards Grid */}
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
                          <ProfileIcon name="edit" size={15} />
                        </button>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            className="icon-action-btn delete-btn"
                            title="Delete address"
                            onClick={() => handleDeleteAddress(addr.id)}
                          >
                            <ProfileIcon name="trash" size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="address-body">
                      <h3>{addr.fullName}</h3>
                      <p className="addr-phone">
                        <ProfileIcon name="phone" size={14} /> {addr.phone}
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
                          <ProfileIcon name="check" size={14} /> Default Delivery Address
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
                    Browse Full Catalog <ProfileIcon name="arrow" size={13} />
                  </button>
                </div>

                {combinedSavedItems.length === 0 ? (
                  <div className="empty-state">
                    <ProfileIcon name="heart" size={32} />
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
                            <ProfileIcon name="close" size={14} />
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
                            <ProfileIcon name="bag" size={14} />
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
                              {isSelected && <ProfileIcon name="check" size={13} />}
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
                            {isSelected && <ProfileIcon name="check" size={13} />}
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
                              {isSelected && <ProfileIcon name="check" size={12} style={{ color: '#fff' }} />}
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
                    <ProfileIcon name="mail" size={20} />
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

                {/* 2. Privacy & Data Export */}
                <div className="settings-card">
                  <div className="settings-card-header">
                    <ProfileIcon name="download" size={20} />
                    <div>
                      <h3>Privacy & Data Controls</h3>
                      <p>Export a portable copy of your account profile, addresses, and order history.</p>
                    </div>
                  </div>
                  <div className="privacy-actions">
                    <button type="button" className="button button-outline mini-btn" onClick={handleDownloadData}>
                      <ProfileIcon name="download" size={14} />
                      <span>Download Account Data (.JSON)</span>
                    </button>
                  </div>
                </div>

                {/* 3. Logout */}
                <div className="settings-card danger-card">
                  <div className="settings-card-header">
                    <ProfileIcon name="logout" size={20} />
                    <div>
                      <h3>Sign Out</h3>
                      <p>Sign out of your Aanur Textile account on this browser.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-outline danger-btn mini-btn"
                    onClick={() => setLogoutModalOpen(true)}
                  >
                    <ProfileIcon name="logout" size={14} />
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
                <ProfileIcon name="close" size={18} />
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
                <ProfileIcon name="close" size={18} />
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
                <ProfileIcon name="close" size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="tracking-timeline-v">
                <div className="timeline-step is-complete">
                  <div className="step-bullet">
                    <ProfileIcon name="check" size={12} />
                  </div>
                  <div className="step-content">
                    <strong>1. Order Confirmed</strong>
                    <span>Received at Nathakadaiyur Workshop · {trackingOrder.date}</span>
                  </div>
                </div>

                <div className={`timeline-step ${trackingOrder.status !== 'cancelled' ? 'is-complete' : ''}`}>
                  <div className="step-bullet">
                    <ProfileIcon name="check" size={12} />
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
                      <ProfileIcon name="check" size={12} />
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
                  <div className="step-bullet">{trackingOrder.status === 'delivered' ? <ProfileIcon name="check" size={12} /> : '4'}</div>
                  <div className="step-content">
                    <strong>4. Out for Delivery</strong>
                    <span>Courier out for doorstep verification</span>
                  </div>
                </div>

                <div className={`timeline-step ${trackingOrder.status === 'delivered' ? 'is-complete' : ''}`}>
                  <div className="step-bullet">{trackingOrder.status === 'delivered' ? <ProfileIcon name="check" size={12} /> : '5'}</div>
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
                <ProfileIcon name="close" size={18} />
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
                  <ProfileIcon name="truck" size={18} />
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
                <ProfileIcon name="close" size={18} />
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
