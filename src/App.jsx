import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { categories, products as initialProducts, store } from './data.js';
import { apiUrl } from './api.js';
import { money } from './utils/format.js';
import { saved, authStorage, isAdminUser } from './utils/storage.js';
import { getVariantImage } from './utils/product.js';
import { Icon } from './components/common/Icon.jsx';
import { Footer } from './components/Footer.jsx';
import { QuickView } from './components/QuickView.jsx';

// Pages
import Home from './pages/Home.jsx';
import BestOffersPage from './pages/BestOffersPage.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CartPage from './pages/CartPage.jsx';
import Checkout from './pages/Checkout.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import VerifyOrderPage from './pages/VerifyOrderPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import AdminPage from './AdminPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import NotFound from './pages/NotFound.jsx';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  const [products, setProducts] = useState(initialProducts);
  const [dbStatus, setDbStatus] = useState({ configured: false, source: 'local' });
  const [cart, setCart] = useState(() => saved('dd-cart', {}));
  const [wishlist, setWishlist] = useState(() => saved('dd-wishlist', []));
  const [coupon, setCoupon] = useState(() => saved('dd-coupon', null));
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [quickView, setQuickView] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    fetch(apiUrl('/api/products'))
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products?.length > 0) {
          setProducts(data.products);
          setDbStatus({ configured: true, source: data.source || 'mongodb' });
        }
      })
      .catch((err) => {
        console.warn('API products fetch failed, using local catalog fallback:', err);
      });
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setRoute(to);
    setMobileOpen(false);
    setMobileSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (mobileOpen) setMobileOpen(false);
        if (mobileSearchOpen) setMobileSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, mobileSearchOpen]);

  useEffect(() => {
    localStorage.setItem('dd-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('dd-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (coupon) localStorage.setItem('dd-coupon', JSON.stringify(coupon));
    else localStorage.removeItem('dd-coupon');
  }, [coupon]);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          }
        );
      });
      gsap.fromTo(
        '.story-copy',
        { opacity: 0.25 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.story-section', start: 'top 80%', end: 'bottom 40%', scrub: true },
        }
      );
    },
    { scope: mainRef, dependencies: [route], revertOnUpdate: true }
  );

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product, quantity = 1, selection = {}) => {
    const size = selection.size || product.sizes?.[0] || 'Standard';
    const colorIndex = selection.colorIndex ?? 0;
    const variantImage = selection.variantImage || getVariantImage(product, colorIndex);
    const cartKey =
      size === (product.sizes?.[0] || 'Standard') && colorIndex === 0
        ? product.id
        : `${product.id}::${size}::${colorIndex}`;
    setCart((current) => ({
      ...current,
      [cartKey]: {
        productId: product.id,
        size,
        colorIndex,
        variantImage,
        quantity: (current[cartKey]?.quantity || 0) + quantity,
      },
    }));
    const colorLabel = product.colorNames?.[colorIndex] ? ` (${product.colorNames[colorIndex]})` : '';
    setToast(`${product.name}${colorLabel} added to your bag`);
  };

  const toggleWishlist = (id) => {
    setWishlist((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
    setToast(wishlist.includes(id) ? 'Removed from your saved pieces' : 'Saved for a softer day');
  };

  const goSearch = (event) => {
    if (event) event.preventDefault();
    const query = search.trim();
    setMobileSearchOpen(false);
    setMobileOpen(false);
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`);
    else navigate('/search');
  };

  const path = route.split('?')[0];
  const query = new URLSearchParams(route.split('?')[1] || '').get('q') || '';
  const categoryName = path.startsWith('/category/') ? decodeURIComponent(path.slice(10)) : '';
  const productId = path.startsWith('/product/') ? path.slice(9) : '';
  const product = products.find((item) => item.id === productId);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => (authStorage.isLoggedIn() ? authStorage.getUser() : null));

  useEffect(() => {
    setCurrentUser(authStorage.isLoggedIn() ? authStorage.getUser() : null);
  }, [route]);

  // Validate session token with backend on mount
  useEffect(() => {
    const token = authStorage.getToken();
    if (token) {
      fetch(apiUrl('/api/auth/me'), {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success && data.user) {
            setCurrentUser(data.user);
            authStorage.setUser(data.user);
          } else {
            authStorage.clearAuth();
            setCurrentUser(null);
          }
        })
        .catch((err) => {
          console.warn('Auth token verification network issue:', err);
        });
    }
  }, []);

  const handleQuickLogout = (source = 'button') => {
    authStorage.clearAuth();
    setCurrentUser(null);
    setToast(source === 'shortcut' ? 'Shortcut (Alt+L): You have been signed out.' : 'You have been securely signed out.');
    navigate('/login');
  };

  // Global Keyboard Shortcut: Alt + L or Ctrl + Shift + L or Alt + Q
  useEffect(() => {
    const handleLogoutShortcut = (e) => {
      const isAltL = e.altKey && (e.key === 'l' || e.key === 'L');
      const isCtrlShiftL = e.ctrlKey && e.shiftKey && (e.key === 'l' || e.key === 'L');
      const isAltQ = e.altKey && (e.key === 'q' || e.key === 'Q');
      if (isAltL || isCtrlShiftL || isAltQ) {
        e.preventDefault();
        handleQuickLogout('shortcut');
      }
    };
    window.addEventListener('keydown', handleLogoutShortcut);
    return () => window.removeEventListener('keydown', handleLogoutShortcut);
  }, []);

  const navLinks = [
    { label: 'Collections', href: '/shop', isActive: path === '/shop' },
    { label: 'Best Offers', href: '/sale', isActive: path === '/sale' || path === '/offers' },
    { label: 'Story', href: '/about', isActive: path === '/about' },
    { label: 'Contact', href: '/contact', isActive: path === '/contact' },
  ];

  const routeContent = () => {
    if (path === '/') {
      return (
        <Home
          navigate={navigate}
          products={products}
          onAdd={addToCart}
          wishlist={wishlist}
          onWish={toggleWishlist}
          onQuick={setQuickView}
        />
      );
    }
    if (path === '/sale' || path === '/offers') {
      return (
        <BestOffersPage
          products={products}
          onAdd={addToCart}
          wishlist={wishlist}
          onWish={toggleWishlist}
          onQuick={setQuickView}
          navigate={navigate}
          coupon={coupon}
          setCoupon={setCoupon}
          setToast={setToast}
        />
      );
    }
    if (path === '/shop') {
      return (
        <Catalog
          title="Find your softer side."
          subtitle="Thoughtfully made comforts for the everyday."
          list={products}
          onAdd={addToCart}
          wishlist={wishlist}
          onWish={toggleWishlist}
          onQuick={setQuickView}
          navigate={navigate}
        />
      );
    }
    if (categoryName) {
      const matches = products.filter((item) => (item.category || '').toLowerCase() === categoryName.toLowerCase());
      return (
        <Catalog
          title={categoryName}
          subtitle={`Soft, considered ${categoryName.toLowerCase()} for the moments that matter.`}
          list={matches}
          onAdd={addToCart}
          wishlist={wishlist}
          onWish={toggleWishlist}
          onQuick={setQuickView}
          navigate={navigate}
        />
      );
    }
    if (path === '/search') {
      const matches = products.filter((item) =>
        `${item.name} ${item.category || ''} ${item.description}`.toLowerCase().includes(query.toLowerCase())
      );
      return (
        <Catalog
          title={query ? `A little something for “${query}”` : 'What feels good to you?'}
          subtitle={
            query
              ? `${matches.length} thoughtful finds for your search.`
              : 'Search our collection by product, room, or feeling.'
          }
          list={matches}
          onAdd={addToCart}
          wishlist={wishlist}
          onWish={toggleWishlist}
          onQuick={setQuickView}
          navigate={navigate}
          emptyTitle="No soft landings just yet."
        />
      );
    }
    if (path.startsWith('/product/') && product) {
      return (
        <ProductDetail
          product={product}
          onAdd={addToCart}
          onWish={toggleWishlist}
          wished={wishlist.includes(product.id)}
          navigate={navigate}
          allProducts={products}
        />
      );
    }
    if (path === '/cart') {
      return (
        <CartPage
          cart={cart}
          setCart={setCart}
          onAdd={addToCart}
          navigate={navigate}
          products={products}
          coupon={coupon}
          setCoupon={setCoupon}
          setToast={setToast}
        />
      );
    }
    if (path === '/checkout') {
      return (
        <Checkout
          cart={cart}
          setCart={setCart}
          navigate={navigate}
          products={products}
          coupon={coupon}
          setCoupon={setCoupon}
          currentUser={currentUser}
          setToast={setToast}
        />
      );
    }
    if (path === '/wishlist') {
      return (
        <WishlistPage
          wishlist={wishlist}
          onWish={toggleWishlist}
          onAdd={addToCart}
          navigate={navigate}
          products={products}
        />
      );
    }
    if (path === '/verify-order') {
      return <VerifyOrderPage navigate={navigate} setToast={setToast} />;
    }
    if (path === '/admin') {
      const isUserAdmin = isAdminUser(currentUser);

      if (!currentUser) {
        return (
          <AuthPage
            signup={false}
            setToast={setToast}
            navigate={navigate}
            redirect="/admin"
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            notice="Aanur Textile Admin: Please sign in with your Admin Gmail to access the Artisan Control Center."
          />
        );
      }

      if (!isUserAdmin) {
        return (
          <div className="admin-access-denied page-pad container">
            <div className="access-denied-card">
              <Icon name="shield" size={48} />
              <h2>Admin Access Required</h2>
              <p>
                Account <strong>{currentUser.email}</strong> is not recognized as a store administrator.
                Please sign in with your verified Admin Gmail.
              </p>
              <div className="access-denied-actions">
                <button
                  type="button"
                  className="button button-dark"
                  onClick={() => {
                    handleQuickLogout('button');
                    navigate('/login');
                  }}
                >
                  Sign In with Admin Gmail
                </button>
                <button type="button" className="button button-soft" onClick={() => navigate('/shop')}>
                  Return to Storefront
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <AdminPage
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          navigate={navigate}
          products={products}
          setProducts={setProducts}
          setToast={setToast}
        />
      );
    }
    if (path === '/logout') {
      authStorage.clearAuth();
      if (currentUser) setCurrentUser(null);
      setTimeout(() => {
        setToast('You have been securely signed out.');
        navigate('/login');
      }, 0);
      return null;
    }
    if (path === '/login' || path === '/signup') {
      return (
        <AuthPage
          signup={path === '/signup'}
          setToast={setToast}
          navigate={navigate}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      );
    }
    if (path === '/account' || path === '/profile') {
      if (!currentUser) {
        return (
          <AuthPage
            signup={false}
            setToast={setToast}
            navigate={navigate}
            redirect="/profile"
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            notice="Please sign in to view your profile and saved account details."
          />
        );
      }
      return (
        <ProfilePage
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          navigate={navigate}
          products={products}
          wishlist={wishlist}
          onWish={toggleWishlist}
          onAdd={addToCart}
          setToast={setToast}
          initialTab="overview"
        />
      );
    }
    if (path === '/orders' || path.startsWith('/orders/')) {
      if (!currentUser) {
        return (
          <AuthPage
            signup={false}
            setToast={setToast}
            navigate={navigate}
            redirect="/orders"
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            notice="Please sign in to track and view your order history."
          />
        );
      }
      return (
        <ProfilePage
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          navigate={navigate}
          products={products}
          wishlist={wishlist}
          onWish={toggleWishlist}
          onAdd={addToCart}
          setToast={setToast}
          initialTab="orders"
        />
      );
    }

    if (path === '/about') return <AboutPage navigate={navigate} />;
    if (path === '/contact') return <ContactPage setToast={setToast} />;
    if (path === '/faq') return <FaqPage />;
    return <NotFound navigate={navigate} />;
  };

  return (
    <div className="site-shell">
      {/* Announcement Bar */}
      <div className="announcement">
        <span>Doorstep delivery across India in 7 to 14 days · Factory direct from Aanur Textile</span>
        <a
          href="/shop"
          onClick={(event) => {
            event.preventDefault();
            navigate('/shop');
          }}
        >
          View Collections <Icon name="arrow" size={14} />
        </a>
      </div>

      {/* Modern Sticky Glassmorphic Header */}
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header-left">
          <button
            className={`icon-button mobile-menu-toggle ${mobileOpen ? 'is-active' : ''}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} />
          </button>
          <a
            className="wordmark"
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate('/');
            }}
            aria-label="Aanur Textile home"
          >
            <span>
              Aanur <i>Textile</i>
            </span>
            <small>COMFORT, CONSIDERED.</small>
          </a>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${link.isActive ? 'is-active' : ''}`}
              onClick={(event) => {
                event.preventDefault();
                navigate(link.href);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          {/* Desktop Search Bar */}
          <form className="header-search" onSubmit={goSearch} role="search">
            <Icon name="search" size={16} className="search-lead-icon" />
            <input
              aria-label="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search collections..."
            />
            {search.trim() && (
              <button
                type="button"
                className="search-clear-btn"
                aria-label="Clear search text"
                onClick={() => setSearch('')}
              >
                <Icon name="close" size={13} />
              </button>
            )}
            <button type="submit" className="search-submit-btn" aria-label="Submit search">
              <Icon name="arrow" size={14} />
            </button>
          </form>

          {/* Mobile Search Toggle Button */}
          <button
            className={`icon-button mobile-search-toggle ${mobileSearchOpen ? 'is-active' : ''}`}
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Icon name={mobileSearchOpen ? 'close' : 'search'} />
          </button>

          {/* Admin Dashboard Action */}
          {(currentUser?.isAdmin || currentUser?.role === 'admin') && (
            <button
              className="icon-button header-admin-btn"
              onClick={() => navigate('/admin')}
              title="Admin Control Center"
              aria-label="Admin Control Center"
              style={{
                color: '#8B1E0F',
                background: 'rgba(139, 30, 15, 0.08)',
                borderRadius: '50%',
              }}
            >
              <Icon name="shield" size={18} />
            </button>
          )}

          {/* User Account / Profile Button */}
          <div className="header-account-wrap">
            {currentUser ? (
              <button
                className="header-avatar-btn"
                onClick={() => navigate('/profile')}
                title={`Signed in as ${currentUser.name}`}
                aria-label="View user profile"
                style={{
                  backgroundColor: currentUser.avatarBg || '#b76b52',
                }}
              >
                <span>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</span>
              </button>
            ) : (
              <button
                className="icon-button header-login-btn"
                onClick={() => navigate('/login')}
                title="Sign In / Register"
                aria-label="Sign In"
              >
                <Icon name="user" />
              </button>
            )}
          </div>

          {/* Wishlist Button with Badge */}
          <button
            className="icon-button"
            aria-label="Saved pieces"
            onClick={() => navigate('/wishlist')}
            style={{ position: 'relative' }}
          >
            <Icon name="heart" />
            {wishlist.length > 0 && <span className="header-badge">{wishlist.length}</span>}
          </button>

          {/* Cart Bag Button with Counter */}
          <button
            className="icon-button bag-trigger"
            aria-label="Shopping bag"
            onClick={() => navigate('/cart')}
            style={{ position: 'relative' }}
          >
            <Icon name="bag" />
            {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* Expandable Mobile Search Tray */}
      {mobileSearchOpen && (
        <div className="mobile-search-tray">
          <form onSubmit={goSearch} role="search">
            <Icon name="search" size={18} />
            <input
              autoFocus
              aria-label="Search all collections"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bedsheets, weaves, colors..."
            />
            {search.trim() && (
              <button
                type="button"
                className="search-clear-btn"
                aria-label="Clear search text"
                onClick={() => setSearch('')}
              >
                <Icon name="close" size={14} />
              </button>
            )}
            <button type="submit" className="button button-dark mobile-search-go-btn">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      <aside
        id="mobile-navigation"
        className={`mobile-drawer ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="drawer-top">
          <span className="eyebrow">AANUR TEXTILE</span>
          <button
            type="button"
            className="icon-button drawer-close-btn"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        {/* User Card in Mobile Drawer */}
        <div className="drawer-user-card">
          {currentUser ? (
            <div className="drawer-user-logged">
              <div
                className="drawer-user-avatar"
                style={{ backgroundColor: currentUser.avatarBg || '#b76b52' }}
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="drawer-user-info">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.email}</small>
              </div>
              <button
                type="button"
                className="drawer-logout-btn"
                onClick={() => {
                  setMobileOpen(false);
                  handleQuickLogout('button');
                }}
                title="Sign out"
                aria-label="Sign out"
              >
                <Icon name="logout" size={16} />
              </button>
            </div>
          ) : (
            <div className="drawer-user-guest">
              <div>
                <strong>Artisan Member Account</strong>
                <small>Sign in to save pieces and track deliveries</small>
              </div>
              <button
                type="button"
                className="button button-dark button-sm"
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/login');
                }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        <nav className="mobile-nav">
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/');
            }}
          >
            Home <Icon name="arrow" size={16} />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/shop');
            }}
          >
            Collections <Icon name="arrow" size={16} />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/sale');
            }}
            style={{ color: '#8B1E0F', fontWeight: 600 }}
          >
            Top 5 Best Offers (15% OFF) <Icon name="arrow" size={16} />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/category/Bedsheets');
            }}
          >
            Bedsheets <Icon name="arrow" size={16} />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/about');
            }}
          >
            Our Story <Icon name="arrow" size={16} />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/contact');
            }}
          >
            Contact & Wholesale <Icon name="arrow" size={16} />
          </button>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/faq');
            }}
          >
            FAQs & Delivery <Icon name="arrow" size={16} />
          </button>

          {/* Account Links */}
          <div
            style={{
              margin: '12px 0 6px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate(currentUser ? '/profile' : '/login');
              }}
            >
              <Icon name="user" size={16} style={{ marginRight: '8px' }} />
              {currentUser ? 'My Profile' : 'Sign In / Register'}
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate(currentUser ? '/orders' : '/login');
              }}
            >
              <Icon name="box" size={16} style={{ marginRight: '8px' }} />
              Track Orders
            </button>
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/wishlist');
              }}
            >
              <Icon name="heart" size={16} style={{ marginRight: '8px' }} />
              Saved Pieces ({wishlist.length})
            </button>

            {(currentUser?.isAdmin || currentUser?.role === 'admin') && (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/admin');
                }}
                style={{ color: '#8B1E0F', fontWeight: 600 }}
              >
                <Icon name="shield" size={16} style={{ marginRight: '8px' }} />
                Artisan Admin Control Center
              </button>
            )}
          </div>
        </nav>

        <div className="drawer-contact">
          <p>
            <strong>Aanur Textile Factory</strong>
            <br />
            Nathakadaiyur, Kangayam · Tiruppur
          </p>
          <a className="button button-outline" href={store.phone}>
            Call {store.phoneDisplay}
          </a>
          <small
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '10px',
              color: 'var(--text-muted, #666)',
            }}
          >
            <Icon name="truck" size={13} />
            Doorstep delivery across India in {store.deliveryTime}
          </small>
        </div>
      </aside>

      <main ref={mainRef} className="page-main">
        {routeContent()}
      </main>

      <Footer navigate={navigate} />

      {/* Enhanced Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        <button className={path === '/' ? 'is-active' : ''} onClick={() => navigate('/')}>
          <Icon name="search" size={19} />
          <span>Discover</span>
        </button>
        <button
          className={path === '/shop' || path.startsWith('/category') || path === '/sale' ? 'is-active' : ''}
          onClick={() => navigate('/shop')}
        >
          <Icon name="bag" size={19} />
          <span>Shop</span>
        </button>
        <button
          className={path === '/wishlist' ? 'is-active' : ''}
          onClick={() => navigate('/wishlist')}
          style={{ position: 'relative' }}
        >
          <Icon name="heart" size={19} />
          {wishlist.length > 0 && <span className="bottom-badge">{wishlist.length}</span>}
          <span>Saved</span>
        </button>
        <button
          className={path === '/account' || path === '/profile' || path === '/orders' ? 'is-active' : ''}
          onClick={() => navigate('/account')}
        >
          <Icon name="user" size={19} />
          <span>Account</span>
        </button>
      </nav>

      {toast && (
        <div className="toast" role="status">
          <span className="toast-check">
            <Icon name="check" size={15} />
          </span>
          {toast}
          <button aria-label="Dismiss notification" onClick={() => setToast('')}>
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      {quickView && (
        <QuickView
          product={quickView.product || quickView}
          initialVariant={quickView.initialVariant || 0}
          onClose={() => setQuickView(null)}
          onAdd={addToCart}
          onDetails={(id) => {
            setQuickView(null);
            navigate(`/product/${id}`);
          }}
        />
      )}
    </div>
  );
}

export default App;
