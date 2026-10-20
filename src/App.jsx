import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { categories, products as initialProducts, store } from './data.js';
import ProfilePage from './ProfilePage.jsx';

gsap.registerPlugin(ScrollTrigger);

const money = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

const saved = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    if (error instanceof SyntaxError) return fallback;
    return fallback;
  }
};

const validateCoupon = (inputCode) => {
  if (!inputCode) return null;
  const cleaned = inputCode.trim().toUpperCase();
  if (cleaned === 'BESTOFFER' || cleaned === 'BESTOFFERS' || cleaned === 'SECRET15') {
    return { code: 'BESTOFFER', discountPercent: 15, label: '15% Secret Offer Discount' };
  }
  if (cleaned === 'AANUR10' || cleaned === 'SECRET10') {
    return { code: 'AANUR10', discountPercent: 10, label: '10% Factory Discount' };
  }
  if (cleaned === 'OFFER50') {
    return { code: 'OFFER50', discountAmount: 50, label: '₹50 Flat Off' };
  }
  return null;
};

function Icon({ name, size = 20, ...props }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    heart: <path d="M20.8 8.8c0 4.5-8.8 10-8.8 10s-8.8-5.5-8.8-10A4.5 4.5 0 0 1 12 6.2a4.5 4.5 0 0 1 8.8 2.6Z" />,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    truck: <><path d="M3 6h11v11H3z" /><path d="M14 10h4l3 3v4h-7" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    leaf: <><path d="M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-6 8-16Z" /><path d="M4 21c2-5 6-8 11-11" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></>,
    edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    box: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 12v10" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name] || paths.check}</svg>;
}

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
    fetch('/api/products')
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

  useEffect(() => { localStorage.setItem('dd-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('dd-wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => {
    if (coupon) localStorage.setItem('dd-coupon', JSON.stringify(coupon));
    else localStorage.removeItem('dd-coupon');
  }, [coupon]);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.utils.toArray('.reveal').forEach((element) => {
      gsap.fromTo(element, { opacity: 0, y: 24, scale: 0.98 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true },
      });
    });
    gsap.fromTo('.story-copy', { opacity: 0.25 }, {
      opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '.story-section', start: 'top 80%', end: 'bottom 40%', scrub: true },
    });
  }, { scope: mainRef, dependencies: [route], revertOnUpdate: true });

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const addToCart = (product, quantity = 1, selection = {}) => {
    const size = selection.size || product.sizes[0];
    const colorIndex = selection.colorIndex ?? 0;
    const variantImage = selection.variantImage || product.images?.[colorIndex] || product.image;
    const cartKey = size === product.sizes[0] && colorIndex === 0
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
    setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
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
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const isAuth = localStorage.getItem('aanur_is_logged_in') === 'true';
      const raw = localStorage.getItem('aanur_profile_info');
      return isAuth && raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const isAuth = localStorage.getItem('aanur_is_logged_in') === 'true';
      const raw = localStorage.getItem('aanur_profile_info');
      setCurrentUser(isAuth && raw ? JSON.parse(raw) : null);
    } catch {
      setCurrentUser(null);
    }
  }, [route]);

  const handleQuickLogout = (source = 'button') => {
    try {
      localStorage.removeItem('aanur_is_logged_in');
    } catch {}
    setCurrentUser(null);
    setToast(
      source === 'shortcut'
        ? 'Shortcut (Alt+L): You have been signed out.'
        : 'You have been securely signed out.'
    );
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
        try {
          localStorage.removeItem('aanur_is_logged_in');
        } catch {}
        setCurrentUser(null);
        setToast('Shortcut (Alt+L): You have been signed out.');
        navigate('/login');
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
    if (path === '/') return <Home navigate={navigate} products={products} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} onQuick={setQuickView} />;
    if (path === '/sale' || path === '/offers') return <BestOffersPage products={products} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} onQuick={setQuickView} navigate={navigate} coupon={coupon} setCoupon={setCoupon} setToast={setToast} />;
    if (path === '/shop') return <Catalog title="Find your softer side." subtitle="Thoughtfully made comforts for the everyday." list={products} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} onQuick={setQuickView} navigate={navigate} />;
    if (categoryName) {
      const matches = products.filter((item) => (item.category || '').toLowerCase() === categoryName.toLowerCase());
      return <Catalog title={categoryName} subtitle={`Soft, considered ${categoryName.toLowerCase()} for the moments that matter.`} list={matches} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} onQuick={setQuickView} navigate={navigate} />;
    }
    if (path === '/search') {
      const matches = products.filter((item) => `${item.name} ${item.category || ''} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
      return <Catalog title={query ? `A little something for “${query}”` : 'What feels good to you?'} subtitle={query ? `${matches.length} thoughtful finds for your search.` : 'Search our collection by product, room, or feeling.'} list={matches} onAdd={addToCart} wishlist={wishlist} onWish={toggleWishlist} onQuick={setQuickView} navigate={navigate} emptyTitle="No soft landings just yet." />;
    }
    if (path.startsWith('/product/') && product) return <ProductDetail product={product} onAdd={addToCart} onWish={toggleWishlist} wished={wishlist.includes(product.id)} navigate={navigate} allProducts={products} />;
    if (path === '/cart') return <CartPage cart={cart} setCart={setCart} onAdd={addToCart} navigate={navigate} products={products} coupon={coupon} setCoupon={setCoupon} setToast={setToast} />;
    if (path === '/checkout') return <Checkout cart={cart} setCart={setCart} navigate={navigate} products={products} coupon={coupon} setCoupon={setCoupon} />;
    if (path === '/wishlist') return <WishlistPage wishlist={wishlist} onWish={toggleWishlist} onAdd={addToCart} navigate={navigate} products={products} />;
    if (path === '/verify-order') return <VerifyOrderPage navigate={navigate} setToast={setToast} />;
    if (path === '/logout') {
      try {
        localStorage.removeItem('aanur_is_logged_in');
      } catch {}
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
        <a href="/shop" onClick={(event) => { event.preventDefault(); navigate('/shop'); }}>
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
            onClick={(event) => { event.preventDefault(); navigate('/'); }}
            aria-label="Aanur Textile home"
          >
            <span>Aanur <i>Textile</i></span>
            <small>COMFORT, CONSIDERED.</small>
          </a>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${link.isActive ? 'is-active' : ''}`}
              onClick={(event) => { event.preventDefault(); navigate(link.href); }}
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

          {/* Account Button & Sign In Action */}
          <button
            className={`icon-button account-action ${path === '/account' || path === '/profile' || path === '/orders' || path === '/login' || path === '/signup' ? 'is-current' : ''}`}
            aria-label={currentUser ? "Your account" : "Sign in to Aanur Textile"}
            onClick={() => navigate(currentUser ? '/account' : '/login')}
            title={currentUser ? `Signed in as ${currentUser.name || 'Artisan'}` : "Sign In to Your Account"}
          >
            <Icon name="user" />
            {currentUser && <span className="account-dot-online" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className={`header-auth-label-btn ${path === '/login' || path === '/signup' ? 'is-current' : ''}`}
            onClick={() => navigate(currentUser ? '/account' : '/login')}
            title={currentUser ? "View your account & orders" : "Sign In / Register"}
          >
            {currentUser ? (currentUser.name ? currentUser.name.split(' ')[0] : 'Account') : 'Sign In'}
          </button>

          {currentUser && (
            <button
              type="button"
              className="icon-button header-logout-btn"
              onClick={() => handleQuickLogout('header')}
              title="Sign out of account (Shortcut: Alt+L)"
              aria-label="Sign out of account (Shortcut: Alt+L)"
            >
              <Icon name="logout" size={17} />
            </button>
          )}

          {/* Wishlist Button with Badge Counter */}
          <button
            className={`icon-button wish-action ${path === '/wishlist' ? 'is-current' : ''}`}
            aria-label={`Wishlist, ${wishlist.length} items`}
            onClick={() => navigate('/wishlist')}
            title="Saved pieces"
          >
            <Icon name="heart" />
            {wishlist.length > 0 && (
              <span className="nav-badge wishlist-badge" aria-hidden="true">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Bag Button with Badge Counter */}
          <button
            className={`icon-button bag-action ${path === '/cart' ? 'is-current' : ''}`}
            aria-label={`Shopping bag, ${cartCount} items`}
            onClick={() => navigate('/cart')}
            title="Shopping bag"
          >
            <Icon name="bag" />
            {cartCount > 0 && (
              <span className="nav-badge bag-badge" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Search */}
        {mobileSearchOpen && (
          <div className="mobile-search-bar">
            <form onSubmit={goSearch} className="mobile-search-form">
              <Icon name="search" size={17} />
              <input
                autoFocus
                aria-label="Search all products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search bedsheets, cotton, weaves..."
              />
              {search.trim() && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <Icon name="close" size={14} />
                </button>
              )}
              <button type="submit" className="button button-dark mobile-search-go">
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      <div
        className={`mobile-drawer-overlay ${mobileOpen ? 'is-visible' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-Over Navigation Drawer */}
      <aside
        className={`mobile-drawer ${mobileOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation menu"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-drawer-head">
          <a
            className="wordmark"
            href="/"
            onClick={(event) => { event.preventDefault(); navigate('/'); }}
          >
            <span>Aanur <i>Textile</i></span>
            <small>FACTORY DIRECT · NATHAKADAIYUR</small>
          </a>
          <button
            className="icon-button drawer-close-btn"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-search-wrap">
          <form onSubmit={goSearch} className="drawer-search-form">
            <Icon name="search" size={16} />
            <input
              placeholder="Search bedsheets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search.trim() && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearch('')}
                aria-label="Clear"
              >
                <Icon name="close" size={12} />
              </button>
            )}
          </form>
        </div>

        <div className="drawer-section">
          <span className="drawer-section-title">NAVIGATION</span>
          <nav className="drawer-links">
            <button
              className={`drawer-link ${path === '/shop' ? 'is-active' : ''}`}
              onClick={() => navigate('/shop')}
            >
              <span>Collections</span>
              <Icon name="arrow" size={14} />
            </button>
            <button
              className={`drawer-link ${path === '/sale' ? 'is-active' : ''}`}
              onClick={() => navigate('/sale')}
            >
              <span>Best Offers</span>
              <span className="drawer-tag sale-tag">% Off</span>
            </button>
            <button
              className={`drawer-link ${path === '/about' ? 'is-active' : ''}`}
              onClick={() => navigate('/about')}
            >
              <span>Story</span>
              <Icon name="arrow" size={14} />
            </button>
            <button
              className={`drawer-link ${path === '/contact' ? 'is-active' : ''}`}
              onClick={() => navigate('/contact')}
            >
              <span>Contact</span>
              <Icon name="arrow" size={14} />
            </button>
          </nav>
        </div>

        {/* Drawer User Card */}
        <div className="drawer-user-card-wrap">
          {currentUser ? (
            <div className="drawer-user-box-container">
              <div
                className="drawer-user-box"
                onClick={() => { setMobileOpen(false); navigate('/account'); }}
                role="button"
                tabIndex={0}
              >
                <div className="drawer-user-avatar-circle">
                  {(currentUser.name || 'A')[0].toUpperCase()}
                </div>
                <div className="drawer-user-meta">
                  <strong>{currentUser.name || 'Artisan Customer'}</strong>
                  <small>{currentUser.phone || 'Member'}</small>
                </div>
                <Icon name="arrow" size={14} />
              </div>
              <button
                type="button"
                className="drawer-quick-logout-btn"
                onClick={() => {
                  setMobileOpen(false);
                  handleQuickLogout('drawer');
                }}
                title="Sign out of account (Shortcut: Alt+L)"
              >
                <Icon name="logout" size={14} />
                <span>Sign Out Shortcut</span>
                <kbd>Alt+L</kbd>
              </button>
            </div>
          ) : (
            <div className="drawer-guest-box">
              <div className="drawer-guest-text">
                <strong>Welcome to Aanur Textile</strong>
                <p>Sign in to your account for order tracking, saved addresses, and faster checkout.</p>
              </div>
              <button
                type="button"
                className="button button-dark mini-btn"
                onClick={() => { setMobileOpen(false); navigate('/login'); }}
              >
                Sign In / Register <Icon name="arrow" size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="drawer-section">
          <span className="drawer-section-title">ACCOUNT & SERVICES</span>
          <nav className="drawer-links">
            {currentUser && (
              <button
                type="button"
                className="drawer-link drawer-logout-link"
                onClick={() => {
                  setMobileOpen(false);
                  handleQuickLogout('drawer');
                }}
              >
                <span className="drawer-link-logout-inner">
                  <Icon name="logout" size={16} />
                  <span>Sign Out</span>
                </span>
                <kbd className="drawer-kbd-hint">Alt+L</kbd>
              </button>
            )}
            <button
              className={`drawer-link ${path === '/login' || path === '/signup' ? 'is-active' : ''}`}
              onClick={() => { setMobileOpen(false); navigate('/login'); }}
            >
              <span>{currentUser ? 'Switch Account' : 'Sign In / Register'}</span>
              <Icon name="arrow" size={14} />
            </button>
            <button
              className={`drawer-link ${path === '/account' || path === '/profile' ? 'is-active' : ''}`}
              onClick={() => { setMobileOpen(false); navigate('/account'); }}
            >
              <span>My Profile & Addresses</span>
              <Icon name="arrow" size={14} />
            </button>
            <button
              className={`drawer-link ${path === '/orders' ? 'is-active' : ''}`}
              onClick={() => { setMobileOpen(false); navigate('/orders'); }}
            >
              <span>Track Orders</span>
              <Icon name="arrow" size={14} />
            </button>
            <button
              className={`drawer-link ${path === '/faq' ? 'is-active' : ''}`}
              onClick={() => { setMobileOpen(false); navigate('/faq'); }}
            >
              <span>Delivery & FAQs</span>
              <Icon name="arrow" size={14} />
            </button>
          </nav>
        </div>

        <div className="drawer-quick-bar">
          <button
            className="drawer-quick-btn"
            onClick={() => { setMobileOpen(false); navigate('/wishlist'); }}
          >
            <div className="quick-btn-icon">
              <Icon name="heart" size={18} />
              {wishlist.length > 0 && <span className="drawer-badge">{wishlist.length}</span>}
            </div>
            <span>Saved Pieces</span>
          </button>
          <button
            className="drawer-quick-btn"
            onClick={() => { setMobileOpen(false); navigate('/cart'); }}
          >
            <div className="quick-btn-icon">
              <Icon name="bag" size={18} />
              {cartCount > 0 && <span className="drawer-badge">{cartCount}</span>}
            </div>
            <span>Shopping Bag</span>
          </button>
          <button
            className="drawer-quick-btn"
            onClick={() => {
              setMobileOpen(false);
              navigate(currentUser ? '/account' : '/login');
            }}
          >
            <div className="quick-btn-icon">
              <Icon name="user" size={18} />
              {currentUser && <span className="drawer-badge" style={{ background: '#2e7d32' }}>✓</span>}
            </div>
            <span>{currentUser ? 'Account' : 'Sign In'}</span>
          </button>
        </div>

        <div className="drawer-factory-card">
          <div className="factory-card-top">
            <strong>Direct from the Maker</strong>
            <span>Nathakadaiyur, Tamil Nadu</span>
          </div>
          <p>Over 13 years crafting pure cotton home textiles. Household & bulk wholesale orders welcome.</p>
          <a href={store.phone} className="drawer-call-btn">
            <Icon name="phone" size={15} />
            <span>Call {store.phoneDisplay}</span>
          </a>
          <small className="factory-delivery-note">
            <Icon name="truck" size={13} />
            Doorstep delivery across India in {store.deliveryTime}
          </small>
        </div>
      </aside>

      <main ref={mainRef} className="page-main">{routeContent()}</main>
      <Footer navigate={navigate} />

      {/* Enhanced Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav" aria-label="Quick navigation">
        <button
          className={path === '/' ? 'is-active' : ''}
          onClick={() => navigate('/')}
        >
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
      {toast && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={15} /></span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={16} /></button></div>}
      {quickView && <QuickView product={quickView.product || quickView} initialVariant={quickView.initialVariant || 0} onClose={() => setQuickView(null)} onAdd={addToCart} onDetails={(id) => { setQuickView(null); navigate(`/product/${id}`); }} />}
    </div>
  );
}

function SectionTitle({ eyebrow, title, copy, link, navigate }) {
  return <div className="section-title reveal"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{link && <button className="text-link" onClick={() => navigate(link.to)}>{link.label}<Icon name="arrow" size={16} /></button>}</div>;
}

function ProductCard({ product, onAdd, wishlist, onWish, onQuick, navigate }) {
  const isWished = wishlist.includes(product.id);
  const [activeVariant, setActiveVariant] = useState(0);
  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const currentImage = images[activeVariant] || product.image;

  const handleCardClick = () => {
    if (navigate) {
      navigate(`/product/${product.id}`);
    } else {
      onQuick({ product, initialVariant: activeVariant });
    }
  };

  return <article className="product-card">
    <div className="product-image-wrap">
      <button className="product-image-button" aria-label={`View ${product.name}`} onClick={handleCardClick}><img src={currentImage} alt={product.name} loading="lazy" /></button>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <button className={`wish-button ${isWished ? 'is-wished' : ''}`} aria-label={isWished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`} aria-pressed={isWished} onClick={() => onWish(product.id)}><Icon name="heart" size={19} /></button>
      <button className="quick-view" onClick={() => onQuick({ product, initialVariant: activeVariant })}>Quick view <Icon name="arrow" size={15} /></button>
    </div>
    <div className="product-info">
      <div className="product-title-line"><button className="product-name" onClick={handleCardClick}>{product.name}</button></div>
      <p className="product-description">{product.description}</p>
      <div className="product-meta"><div className="product-prices"><strong>{money(product.price)}</strong>{product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}</div>{product.originalPrice > product.price && <span className="discount">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>}</div>
      <div className="product-card-bottom">
        <div className="swatches" aria-label={`${product.colors.length} colors`}>
          {product.colors.map((color, index) => (
            <button
              key={color}
              type="button"
              className={`card-swatch-dot ${activeVariant === index ? 'active' : ''}`}
              style={{ backgroundColor: color }}
              title={product.colorNames?.[index] || `Color ${index + 1}`}
              onClick={(e) => { e.stopPropagation(); setActiveVariant(index); }}
              onMouseEnter={() => setActiveVariant(index)}
              aria-label={product.colorNames?.[index] || `Color ${index + 1}`}
            />
          ))}
        </div>
        <button className="mini-add" onClick={() => onAdd(product, 1, { colorIndex: activeVariant, variantImage: currentImage })} aria-label={`Add ${product.name} to bag`}><Icon name="plus" size={17} /></button>
      </div>
    </div>
  </article>;
}

function ProductGrid({ list, onAdd, wishlist, onWish, onQuick, navigate }) {
  return <div className="product-grid">{list.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} wishlist={wishlist} onWish={onWish} onQuick={onQuick} navigate={navigate} />)}</div>;
}

function Home({ navigate, products: all, onAdd, wishlist, onWish, onQuick }) {
  const featured = all.slice(0, 4);
  return <>
    <section className="hero-section">
      <div className="hero-copy">
        <span className="hero-kicker"><span className="tiny-sun" /> AANUR TEXTILE · EST. 2013</span>
        <h1>Sleep better.<br /><em>Live softer.</em></h1>
        <p>Thoughtfully woven bedsheets, made with local textile craftsmanship in Nathakadaiyur.</p>
        <div className="hero-actions"><button className="button button-dark" onClick={() => navigate('/shop')}>Shop the collection <Icon name="arrow" size={17} /></button><button className="button button-light" onClick={() => navigate('/about')}>Our story</button></div>
      </div>
      <div className="hero-visual">
        <div className="hero-photo"><img src="/products/p01/variant-1.jpeg" alt="Signature check bedsheet from the Aanur Textile collection" /></div>
        <div className="hero-caption"><span>THE SLOW LIVING EDIT</span><span>01 — 06</span></div>
        <div className="hero-note"><span className="note-mark">d.</span><span>Softness you<br />can come home to.</span></div>
      </div>
    </section>
    <div className="trust-strip"><div><Icon name="leaf" /><span>100% Pure cotton & rich blends</span></div><div><Icon name="truck" /><span>Doorstep delivery in 7 to 14 days</span></div><div><Icon name="shield" /><span>In-house quality inspected</span></div><div><Icon name="star" /><span>Crafting textiles since 2013</span></div></div>
    <section className="section-wrap category-section">
      <SectionTitle eyebrow="Made close to home" title="Everyday textiles, made with care." copy="Thoughtful bedsheets, made by Aanur Textile in Nathakadaiyur." link={{ label: 'Explore the collection', to: '/shop' }} navigate={navigate} />
      <div className="category-grid">{categories.map((category, index) => <button className={`category-card category-card-${index + 1}`} key={category.name} onClick={() => navigate(`/category/${category.name}`)}><img src={category.image} alt="" loading="lazy" /><span className="category-shade" /><span className="category-copy"><span>{category.count} designs</span><strong>{category.name}</strong><span className="category-link">Discover <Icon name="arrow" size={16} /></span></span></button>)}</div>
    </section>
    <section className="section-wrap bestsellers-section">
      <SectionTitle eyebrow="From the Aanur Textile collection" title="Comfort for the everyday." copy="Six bedsheet designs, made by the team in Nathakadaiyur." link={{ label: 'Shop the collection', to: '/shop' }} navigate={navigate} />
      <ProductGrid list={featured} onAdd={onAdd} wishlist={wishlist} onWish={onWish} onQuick={onQuick} navigate={navigate} />
    </section>
    <section className="editorial-band">
      <div className="editorial-image"><img src="/products/p03/variant-1.jpeg" alt="Geometric grid woven cotton bed set" loading="lazy" /></div>
      <div className="editorial-copy"><span className="eyebrow">A better kind of everyday</span><h2>Made for the way you <em>really</em> live.</h2><p>Soft enough to stay in bed a little longer. Thoughtful enough to feel good in every way. These are comforts made to be used, loved, and lived in.</p><button className="button button-outline" onClick={() => navigate('/about')}>A little about us <Icon name="arrow" size={17} /></button></div>
    </section>
    <section className="section-wrap story-section">
      <div className="story-layout">
        <div className="story-sticky"><span className="eyebrow">The feeling of home</span><h2>Small comforts.<br /><em>Big exhale.</em></h2><p>For the early risers, the one-more-chapter readers, and the people who find their best ideas in bed.</p><button className="text-link" onClick={() => navigate('/shop')}>Come on in <Icon name="arrow" size={16} /></button></div>
        <div className="story-visual"><img src="/products/p04/variant-1.jpeg" alt="A colorful bed made with Rustic Earth Stripe bedsheet" loading="lazy" /><div className="story-caption story-copy">“Your home should feel like a deep breath.”</div><div className="story-side-note">DESIGNED TO BE LIVED IN · SINCE DAY ONE</div></div>
      </div>
    </section>
    <section className="review-section">
      <div className="review-inner"><span className="eyebrow">A little more about our making</span><div className="review-stars">EST. 2013 · TIRUPPUR, TAMIL NADU</div><blockquote>“From village tailoring to everyday bedsheets, made with care in Nathakadaiyur.”</blockquote><div className="review-author"><span className="author-dot">A</span><span><strong>Aanur Textile</strong><small>Founded by {store.founder} · Kangayam</small></span></div><div className="review-controls"><button className="text-link" onClick={() => navigate('/about')}>Our story <Icon name="arrow" size={15} /></button></div></div>
      <div className="review-image"><img src="/products/p02/variant-1.jpeg" alt="Heritage plaid bedding made by Aanur Textile" loading="lazy" /></div>
    </section>
    <section className="promo-banner"><div><span className="eyebrow">FROM NATHAKADAIYUR, WITH CARE</span><h2>Made by many<br /><em>skilled hands.</em></h2><p>More than 20 local artisans bring Aanur Textile’s bedsheets to life in a pioneering village manufacturing hub.</p><button className="button button-light" onClick={() => navigate('/about')}>Meet the maker <Icon name="arrow" size={16} /></button></div><span className="promo-scribble">since<br />2013</span></section>
    <section className="section-wrap instagram-section"><div className="instagram-head"><div><span className="eyebrow">THE COLLECTION · MADE IN TIRUPPUR</span><h2>Woven for everyday.</h2></div><button className="text-link" onClick={() => navigate('/shop')}>Shop bedsheets <Icon name="arrow" size={15} /></button></div><div className="instagram-grid">{['p01', 'p02', 'p03', 'p05'].map((id) => <button key={id} onClick={() => navigate(`/product/${id}`)}><img src={`/products/${id}/variant-1.jpeg`} alt="Bedsheet design from Aanur Textile" loading="lazy" /><span>↗</span></button>)}</div></section>
  </>;
}

function BestOffersPage({ products: all, onAdd, wishlist, onWish, onQuick, navigate, coupon, setCoupon, setToast }) {
  const [copied, setCopied] = useState(false);
  // Strictly display only 5 curated products as requested
  const offerProducts = useMemo(() => all.slice(0, 5), [all]);
  const secretCode = 'BESTOFFER';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(secretCode).catch(() => {});
    }
    setCopied(true);
    if (setToast) setToast(`Secret coupon "${secretCode}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleAutoApply = () => {
    if (setCoupon) {
      setCoupon({ code: secretCode, discountPercent: 15, label: '15% Secret Offer Discount' });
      if (setToast) setToast(`Secret coupon "${secretCode}" applied! (15% OFF)`);
    }
  };

  return (
    <div className="catalog-page best-offers-page">
      <div className="breadcrumbs">
        <button onClick={() => navigate('/')}>Home</button>
        <span>/</span>
        <span>Best Offers</span>
      </div>

      <div className="catalog-heading">
        <div>
          <span className="eyebrow">EXCLUSIVE FACTORY DEALS · LIMITED RUN</span>
          <h1>Top 5 Best Offers.</h1>
          <p>Hand-picked artisan bedsheets direct from our Nathakadaiyur loom with an exclusive secret coupon.</p>
        </div>
        <div className="catalog-count">5 pieces<br /><span>curated offers</span></div>
      </div>

      {/* Secret Coupon Banner */}
      <div className="secret-coupon-banner">
        <div className="coupon-left">
          <div className="coupon-tag-badge">
            <Icon name="star" size={13} />
            <span>SECRET FACTORY COUPON</span>
          </div>
          <h2>Unlock Extra 15% OFF</h2>
          <p>Apply this exclusive secret code at checkout to take an additional 15% off your entire order on these top 5 bedsheets.</p>
          <div className="coupon-code-wrap">
            <div className="coupon-code-display">
              <span className="coupon-code-label">SECRET CODE:</span>
              <strong className="coupon-code-value">{secretCode}</strong>
            </div>
            <button
              type="button"
              className="coupon-copy-btn"
              onClick={handleCopy}
              aria-label="Copy secret coupon code"
            >
              <Icon name={copied ? 'check' : 'plus'} size={14} />
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        <div className="coupon-right">
          <div className="coupon-savings-pill">
            <span className="savings-val">15%</span>
            <span className="savings-lbl">OFF TOTAL</span>
          </div>
          <button
            type="button"
            className={`button ${coupon?.code === secretCode ? 'button-outline' : 'button-dark'} coupon-auto-apply`}
            onClick={handleAutoApply}
          >
            {coupon?.code === secretCode ? (
              <>
                <Icon name="check" size={15} />
                <span>Coupon Active in Bag</span>
              </>
            ) : (
              <>
                <span>Auto-Apply to Bag</span>
                <Icon name="arrow" size={14} />
              </>
            )}
          </button>
          <small className="coupon-terms">Valid on all 5 featured bedsheet designs · Direct from loom</small>
        </div>
      </div>

      <div className="catalog-toolbar">
        <span>Curated collection of 5 best offers</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#686d51' }}>
          <Icon name="shield" size={14} />
          <span>Factory direct · Inspected in-house</span>
        </div>
      </div>

      <div className="catalog-layout">
        <div className="catalog-results">
          <ProductGrid
            list={offerProducts}
            onAdd={onAdd}
            wishlist={wishlist}
            onWish={onWish}
            onQuick={onQuick}
            navigate={navigate}
          />
        </div>
      </div>
    </div>
  );
}

function Catalog({ title, subtitle, list, onAdd, wishlist, onWish, onQuick, navigate, emptyTitle = 'A little quiet here.' }) {
  const [sort, setSort] = useState('Featured');
  const sorted = useMemo(() => [...list].sort((a, b) => sort === 'Price: low to high' ? a.price - b.price : sort === 'Price: high to low' ? b.price - a.price : 0), [list, sort]);
  return <div className="catalog-page">
    <div className="breadcrumbs"><button onClick={() => navigate('/')}>Home</button><span>/</span><span>{title}</span></div>
    <div className="catalog-heading"><div><span className="eyebrow">COMFORT, CONSIDERED</span><h1>{title}</h1><p>{subtitle}</p></div><div className="catalog-count">{list.length} pieces<br /><span>to make a home</span></div></div>
    <div className="catalog-toolbar"><span>{sorted.length} pieces by Aanur Textile</span><div><label className="sort-control">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></label></div></div>
    <div className="catalog-layout">
      <div className="catalog-results">{sorted.length ? <ProductGrid list={sorted} onAdd={onAdd} wishlist={wishlist} onWish={onWish} onQuick={onQuick} navigate={navigate} /> : <div className="empty-state catalog-empty"><div className="empty-art"><Icon name="search" size={34} /></div><h2>{emptyTitle}</h2><p>We couldn't find a match this time. Try another search or browse our full collection.</p><button className="button button-dark" onClick={() => navigate('/shop')}>Explore everything <Icon name="arrow" size={16} /></button></div>}</div>
    </div>
  </div>;
}

function ProductDetail({ product, onAdd, onWish, wished, navigate, allProducts = initialProducts }) {
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.variants ? product.variants.map((v) => v.image) : [product.image]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(0);

  useEffect(() => {
    setActiveSlide(0);
    setColor(0);
  }, [product.id]);

  const goToSlide = (index) => {
    const valid = (index + images.length) % images.length;
    setActiveSlide(valid);
    if (product.colors && product.colors[valid] !== undefined) {
      setColor(valid);
    }
  };

  const handleColorSelect = (index) => {
    setColor(index);
    if (images[index]) {
      setActiveSlide(index);
    }
  };

  const nextSlide = () => goToSlide(activeSlide + 1);
  const prevSlide = () => goToSlide(activeSlide - 1);

  const currentImage = images[activeSlide] || product.image;

  return <div className="pdp-page">
    <div className="breadcrumbs"><button onClick={() => navigate('/')}>Home</button><span>/</span><button onClick={() => navigate('/shop')}>Shop</button><span>/</span><span>{product.name}</span></div>
    <div className="pdp-layout">
      <div className="gallery-layout">
        <div className="gallery-thumbs" role="tablist" aria-label="Product thumbnails">
          {images.map((imgSrc, idx) => (
            <button
              key={idx}
              type="button"
              className={activeSlide === idx ? 'selected' : ''}
              aria-label={`View photo ${idx + 1}: ${product.colorNames?.[idx] || ''}`}
              onClick={() => goToSlide(idx)}
            >
              <img src={imgSrc} alt={`${product.name} ${product.colorNames?.[idx] || ''}`} />
            </button>
          ))}
        </div>
        <div className="gallery-main">
          <div className="gallery-slide-wrap">
            <img src={currentImage} alt={`${product.name} - ${product.colorNames?.[color] || ''}`} className="gallery-slide-img" key={currentImage} />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {product.colorNames?.[activeSlide] && (
              <div className="slider-variant-pill" title={`Fabric Color: ${product.colorNames[activeSlide]}`}>
                <span className="slider-variant-dot" style={{ backgroundColor: product.colors?.[activeSlide] || '#666' }} />
                <span>{product.colorNames[activeSlide]}</span>
              </div>
            )}
            {images.length > 1 && (
              <>
                <button type="button" className="slider-arrow slider-prev" onClick={prevSlide} aria-label="Previous photo">
                  <Icon name="arrow" size={17} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button type="button" className="slider-arrow slider-next" onClick={nextSlide} aria-label="Next photo">
                  <Icon name="arrow" size={17} />
                </button>
                <div className="slider-dots">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`slider-dot ${activeSlide === idx ? 'active' : ''}`}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="slider-counter">
                  {activeSlide + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="pdp-copy">
        <span className="eyebrow">MADE BY AANUR TEXTILE</span>
        <h1>{product.name}</h1>
        <div className="pdp-price">
          <strong>{money(product.price)}</strong>
          {product.originalPrice > product.price && <><del>{money(product.originalPrice)}</del><span>{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span></>}
        </div>
        <p className="pdp-description">{product.description}</p>
        <div className="variant-details-block">
          <div className="variant-header">
            <span className="option-label" style={{ margin: 0 }}>
              Color: <strong>{product.colorNames?.[color] || `Variant ${color + 1}`}</strong>
            </span>
          </div>

          <div className="color-options" style={{ marginTop: '8px' }}>
            {product.colors.map((shade, index) => (
              <button
                key={shade}
                type="button"
                style={{ '--swatch-color': shade }}
                className={`color-swatch-btn ${color === index ? 'selected' : ''}`}
                onClick={() => handleColorSelect(index)}
                title={product.colorNames?.[index] || `Color ${index + 1}`}
                aria-label={`Choose ${product.colorNames?.[index] || `color ${index + 1}`}`}
                aria-pressed={color === index}
              />
            ))}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="variant-cards-list" role="radiogroup" aria-label="Available color variants">
              {product.colors.map((shade, index) => {
                const vName = product.colorNames?.[index] || `Variant ${index + 1}`;
                const vImg = images[index] || product.image;
                const isSelected = color === index;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`variant-card-tile ${isSelected ? 'active' : ''}`}
                    onClick={() => handleColorSelect(index)}
                    role="radio"
                    aria-checked={isSelected}
                    title={`Click to view ${vName} photo`}
                  >
                    <img src={vImg} alt={vName} className="variant-tile-thumb" />
                    <div className="variant-tile-info">
                      <div className="variant-tile-name-row">
                        <span className="variant-tile-dot" style={{ backgroundColor: shade }} />
                        <strong>{vName}</strong>
                      </div>
                    </div>
                    {isSelected ? (
                      <span className="variant-selected-badge"><Icon name="check" size={12} /> Active</span>
                    ) : (
                      <span className="variant-view-action">View photo</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="option-block">
          <span className="option-label">Size</span>
          <div className="size-options">
            {product.sizes.map((item) => <button key={item} type="button" className={size === item ? 'selected' : ''} onClick={() => setSize(item)} aria-pressed={size === item}>{item}</button>)}
          </div>
        </div>
        <div className="purchase-row">
          <div className="quantity-selector">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Icon name="minus" size={15} /></button>
            <span>{quantity}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Icon name="plus" size={15} /></button>
          </div>
          <button type="button" className="button button-dark add-to-bag" onClick={() => onAdd(product, quantity, { size, colorIndex: color, variantImage: currentImage })}>
            Add to bag <Icon name="bag" size={18} />
          </button>
          <button type="button" className={`pdp-wish ${wished ? 'is-wished' : ''}`} aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'} aria-pressed={wished} onClick={() => onWish(product.id)}>
            <Icon name="heart" />
          </button>
        </div>
        <button type="button" className="button button-terracotta full-width buy-now" onClick={() => { onAdd(product, quantity, { size, colorIndex: color, variantImage: currentImage }); navigate('/checkout'); }}>
          Buy it now <Icon name="arrow" size={17} />
        </button>
        <div className="delivery-note"><Icon name="truck" size={19} /><span><strong>Doorstep delivery in 7 to 14 days.</strong><small>Factory-direct from Aanur Textile, Kangayam · Tiruppur</small></span></div>
        <div className="pdp-promises"><span><Icon name="truck" size={16} /> Delivery: 7–14 days</span><span><Icon name="shield" size={16} /> In-house quality inspected</span></div>
        <details className="pdp-detail"><summary>Details & materials <Icon name="chevron" size={16} /></summary><p>{product.description} Made in {product.material.toLowerCase()}. Bedsheet designs are listed in Queen and King sizes.</p></details>
        <details className="pdp-detail"><summary>About the maker <Icon name="chevron" size={16} /></summary><p>Aanur Textile was founded by {store.founder} in Nathakadaiyur in 2013. The local workshop brings together more than 20 skilled artisans.</p></details>
      </div>
    </div>
    <section className="pdp-reviews"><span className="eyebrow">MADE BY AANUR TEXTILE · NATHAKADAIYUR</span><h2>Thoughtful textiles, made by skilled local hands.</h2><p>{store.yearsExperience}+ years of textile craftsmanship · {store.artisans} local artisans · Inspected in-house</p><button className="text-link" onClick={() => navigate('/about')}>Meet the maker <Icon name="arrow" size={15} /></button></section>
    <div className="section-wrap related-products"><SectionTitle eyebrow="More from the collection" title="More bedsheet designs." link={{ label: 'Shop the collection', to: '/shop' }} navigate={navigate} /><ProductGrid list={allProducts.filter((item) => item.id !== product.id).slice(0, 4)} onAdd={onAdd} wishlist={[]} onWish={() => {}} onQuick={(item) => navigate(`/product/${item.id}`)} /></div>
  </div>;
}

function CartPage({ cart, setCart, onAdd, navigate, products = initialProducts, coupon, setCoupon, setToast }) {
  const [couponInput, setCouponInput] = useState('');
  const items = Object.entries(cart).map(([cartKey, entry]) => ({ ...entry, cartKey, product: products.find((item) => item.id === entry.productId) })).filter((entry) => entry.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = Math.min(subtotal, coupon.discountAmount);
    }
  }
  const finalTotal = Math.max(0, subtotal - discount);

  const setQuantity = (id, quantity) => setCart((current) => {
    const next = { ...current };
    if (quantity < 1) delete next[id];
    else next[id] = { ...next[id], quantity };
    return next;
  });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const validated = validateCoupon(couponInput);
    if (validated) {
      if (setCoupon) setCoupon(validated);
      if (setToast) setToast(`Secret coupon "${validated.code}" applied! ${validated.label}`);
      setCouponInput('');
    } else {
      if (setToast) setToast('Invalid coupon code. Try secret code: BESTOFFER (15% off)');
    }
  };

  const handleRemoveCoupon = () => {
    if (setCoupon) setCoupon(null);
    if (setToast) setToast('Coupon removed.');
  };

  return <div className="cart-page">
    <div className="breadcrumbs"><button onClick={() => navigate('/')}>Home</button><span>/</span><span>Your bag</span></div>
    <div className="page-heading"><div><span className="eyebrow">JUST A FEW SOFT THINGS</span><h1>Your comfort collection.</h1></div><button className="text-link" onClick={() => navigate('/shop')}>Keep browsing <Icon name="arrow" size={16} /></button></div>
    {items.length ? <div className="cart-layout"><div className="cart-items">
      <div className="shipping-progress"><div className="progress-icon"><Icon name="truck" /></div><div><strong>Doorstep delivery in 7 to 14 days across India.</strong><small>Factory-direct shipment from Aanur Textile, Nathakadaiyur.</small></div></div>
      {items.map(({ cartKey, product: item, quantity, size, colorIndex, variantImage }) => <article className="cart-item" key={cartKey}><button className="cart-image" onClick={() => navigate(`/product/${item.id}`)}><img src={variantImage || item.images?.[colorIndex] || item.image} alt={item.name} /></button><div className="cart-item-info"><button className="cart-item-title" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</button><small>{size || item.sizes[0]}{item.colorNames?.[colorIndex] ? ` · ${item.colorNames[colorIndex]}` : ''}</small><button className="remove-item" onClick={() => setQuantity(cartKey, 0)}>Remove</button></div><div className="cart-quantity"><div className="quantity-selector"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => setQuantity(cartKey, quantity - 1)}><Icon name="minus" size={14} /></button><span>{quantity}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => setQuantity(cartKey, quantity + 1)}><Icon name="plus" size={14} /></button></div><strong>{money(item.price * quantity)}</strong></div></article>)}
      <div className="cart-recommend"><span className="eyebrow">A little something extra</span><h3>Make space for one more comfort.</h3><div>{products.filter((item) => !Object.values(cart).some((entry) => entry.productId === item.id)).slice(0, 2).map((item) => <button className="recommend-item" key={item.id} onClick={() => onAdd(item)}><img src={item.image} alt="" /><span>{item.name}<small>{money(item.price)}</small></span><Icon name="plus" size={17} /></button>)}</div></div>
    </div><aside className="order-summary">
      <h2>A little overview</h2>
      <p className="summary-line"><span>Subtotal · {items.reduce((sum, item) => sum + item.quantity, 0)} pieces</span><span>{money(subtotal)}</span></p>

      {/* Secret Coupon Box */}
      <div className="cart-coupon-section">
        {coupon ? (
          <div className="applied-coupon-pill">
            <div className="applied-coupon-info">
              <Icon name="star" size={13} />
              <div>
                <strong>{coupon.code}</strong>
                <small>{coupon.label}</small>
              </div>
            </div>
            <button type="button" className="remove-coupon-btn" onClick={handleRemoveCoupon} aria-label="Remove coupon" title="Remove coupon">✕</button>
          </div>
        ) : (
          <form className="cart-coupon-form" onSubmit={handleApplyCoupon}>
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Secret coupon code"
              aria-label="Secret coupon code"
            />
            <button type="submit">Apply</button>
          </form>
        )}
        {!coupon && (
          <button
            type="button"
            className="coupon-secret-hint"
            onClick={() => {
              if (setCoupon) {
                setCoupon({ code: 'BESTOFFER', discountPercent: 15, label: '15% Secret Offer Discount' });
                if (setToast) setToast('Secret coupon "BESTOFFER" applied! (15% OFF)');
              }
            }}
          >
            Have a secret code? Click to apply <strong>BESTOFFER</strong> (15% off)
          </button>
        )}
      </div>

      {discount > 0 && (
        <p className="summary-line discount-line">
          <span>Secret Coupon ({coupon?.code})</span>
          <span className="discount-amount">−{money(discount)}</span>
        </p>
      )}

      <p className="summary-line"><span>Delivery</span><span>7 to 14 days (Free)</span></p>
      <div className="summary-total"><span>Product total</span><strong>{money(finalTotal)}</strong></div>
      <small className="tax-note">All orders are shipped factory-direct. Delivery takes 7 to 14 days.</small>
      <button className="button button-dark full-width checkout-button" onClick={() => navigate('/checkout')}>Proceed to Checkout <Icon name="arrow" size={16} /></button>
      <div className="secure-note"><Icon name="truck" size={16} /> Estimated delivery: 7 to 14 days</div>
    </aside></div> : <div className="empty-state cart-empty"><div className="empty-art"><Icon name="bag" size={35} /></div><h2>Your comfort collection is waiting.</h2><p>Add something soft to your cart and make your next rest even better.</p><button className="button button-dark" onClick={() => navigate('/shop')}>Start shopping <Icon name="arrow" size={16} /></button></div>}
  </div>;
}

function Checkout({ cart, setCart, navigate, products = initialProducts, coupon, setCoupon }) {
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({});
  const [orderRef, setOrderRef] = useState('');
  const [placedItems, setPlacedItems] = useState([]);
  const [placedTotal, setPlacedTotal] = useState(0);

  const items = Object.values(cart).map((entry) => ({ ...entry, product: products.find((item) => item.id === entry.productId) })).filter((entry) => entry.product);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountAmount) {
      discount = Math.min(subtotal, coupon.discountAmount);
    }
  }
  const total = Math.max(0, subtotal - discount);

  const advance = (event) => {
    event.preventDefault();
    if (step === 1) {
      setCustomer(Object.fromEntries(new FormData(event.currentTarget)));
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      const generatedRef = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderRef(generatedRef);
      setPlacedItems(items);
      setPlacedTotal(total);
      if (setCart) setCart({});
      if (setCoupon) setCoupon(null);
      try {
        const newOrder = {
          orderRef: generatedRef,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'processing',
          statusLabel: 'Processing · On the Loom',
          deliveryEstimate: '7 to 14 days',
          total,
          paymentMethod: 'Cash on Delivery',
          courier: 'Aanur Factory Direct Express',
          trackingNumber: `AANUR-${generatedRef}`,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            size: i.size || i.product.sizes?.[0] || 'Standard',
            color: i.color || 'Artisan Weave',
            image: i.variantImage || i.product.image,
            price: i.product.price,
            quantity: i.quantity,
          })),
        };
        const prev = JSON.parse(localStorage.getItem('aanur_profile_orders') || '[]');
        const cleanPrev = Array.isArray(prev) ? prev.filter((o) => o && !['AT-892415', 'AT-742918', 'AT-619024', 'AT-501239'].includes(o.orderRef)) : [];
        localStorage.setItem('aanur_profile_orders', JSON.stringify([newOrder, ...cleanPrev]));
      } catch (e) {}
      setStep(4);
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: generatedRef,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          street: customer.street,
          city: customer.city,
          postalCode: customer.postalCode,
          subtotal,
          discount,
          couponCode: coupon?.code || '',
          total,
          items: items.map((i) => ({
            id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            size: i.size || i.product.sizes[0],
          })),
          paymentMethod: 'Cash on Delivery',
        }),
      }).catch(() => {});
    }
  };

  const displayItems = step === 4 ? placedItems : items;
  const displayTotal = step === 4 ? placedTotal : total;

  if (displayItems.length === 0 && step !== 4) return <div className="empty-state checkout-empty"><h2>Nothing to check out just yet.</h2><p>Your next soft landing is waiting in the shop.</p><button className="button button-dark" onClick={() => navigate('/shop')}>Explore the collection <Icon name="arrow" /></button></div>;

  return <div className="checkout-page">
    {step === 4 ? <div className="order-success">
      <div className="success-icon"><Icon name="check" size={30} /></div>
      <span className="eyebrow">ORDER CONFIRMED</span>
      <h1>Thank you for your order!</h1>
      <p>We’ve received your order and are preparing your bedsheets for dispatch from our factory in Nathakadaiyur.</p>
      <div className="order-number">ORDER REFERENCE · {orderRef}</div>
      <div style={{ margin: '0.5rem 0 1rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--ink)' }}>
        Total Paid / Due: {money(displayTotal)}
      </div>
      <div className="shipping-progress" style={{ maxWidth: '480px', margin: '1.25rem auto', textAlign: 'left' }}>
        <div className="progress-icon"><Icon name="truck" /></div>
        <div>
          <strong>Estimated Delivery: 7 to 14 days</strong>
          <small>Doorstep delivery across India directly from Aanur Textile.</small>
        </div>
      </div>
      <div style={{ margin: '1.2rem 0', color: 'var(--text-muted, #666)', fontSize: '0.92rem' }}>
        For queries, updates, or custom sizes, call us at <a href={store.phone} style={{ fontWeight: 600 }}>{store.phoneDisplay}</a> or email <a href={`mailto:${store.email}`} style={{ fontWeight: 600 }}>{store.email}</a>.
      </div>
      <button className="button button-dark" onClick={() => navigate('/shop')}>Continue shopping <Icon name="arrow" /></button>
      <div className="checkout-trust-bottom" style={{ marginTop: '1.5rem' }}>
        <Icon name="shield" size={16} /> Doorstep delivery in 7 to 14 days · Direct factory support
      </div>
    </div> : <><div className="checkout-steps">{['Address', 'Delivery', 'Payment'].map((name, index) => <div key={name} className={step === index + 1 ? 'active' : step > index + 1 ? 'complete' : ''}><span>{step > index + 1 ? <Icon name="check" size={14} /> : `0${index + 1}`}</span>{name}</div>)}</div><div className="checkout-layout"><form className="checkout-form" onSubmit={advance}><span className="eyebrow">STEP 0{step} · {['YOUR DETAILS', 'DELIVERY TIMEFRAME', 'PAYMENT & CONFIRMATION'][step - 1]}</span><h1>{['Where should we send your order?', 'Factory-direct delivery.', 'Payment method.'][step - 1]}</h1>
      {step === 1 && <><div className="form-grid"><label>First name<input name="firstName" required autoComplete="given-name" placeholder="Your first name" defaultValue={customer.firstName || ''} /></label><label>Last name<input name="lastName" required autoComplete="family-name" placeholder="Your last name" defaultValue={customer.lastName || ''} /></label><label className="span-two">Email address<input name="email" required type="email" autoComplete="email" placeholder="you@example.com" defaultValue={customer.email || ''} /></label><label className="span-two">Phone number<input name="phone" required type="tel" autoComplete="tel" placeholder="+91 98765 43210" defaultValue={customer.phone || ''} /></label><label className="span-two">Street address<input name="street" required autoComplete="street-address" placeholder="House number and street" defaultValue={customer.street || ''} /></label><label>City<input name="city" required autoComplete="address-level2" placeholder="City" defaultValue={customer.city || ''} /></label><label>PIN code<input name="postalCode" required inputMode="numeric" autoComplete="postal-code" placeholder="000 000" defaultValue={customer.postalCode || ''} /></label></div><small className="tax-note">Orders are dispatched directly from our Nathakadaiyur workshop. Standard doorstep delivery takes 7 to 14 days.</small></>}
      {step === 2 && <div className="delivery-choice"><div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}><Icon name="truck" size={24} /><div><strong>Standard Factory Delivery — 7 to 14 days</strong><p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted, #666)', fontSize: '0.9rem' }}>Free doorstep delivery across India. Carefully inspected and packaged at Aanur Textile.</p></div></div><p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #666)' }}>Need expedited delivery or bulk distribution? Call <a href={store.phone}>{store.phoneDisplay}</a>.</p></div>}
      {step === 3 && <div className="payment-choice"><div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}><label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', padding: '0.75rem 1rem', border: '1px solid var(--border, #ddd)', borderRadius: '6px' }}><input type="radio" name="paymentMethod" defaultChecked /><span><strong>Cash on Delivery (COD) / UPI on Delivery</strong><br /><small style={{ color: 'var(--text-muted, #666)' }}>Pay when your bedsheets arrive at your doorstep in 7 to 14 days.</small></span></label></div><p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #666)' }}>Have questions regarding your order? Call our factory directly at <a href={store.phone}>{store.phoneDisplay}</a>.</p></div>}
      <div className="checkout-form-actions">{step > 1 && <button type="button" className="text-link" onClick={() => setStep(step - 1)}>Back</button>}<button className="button button-dark">{step === 3 ? `Place Order · ${money(total)}` : 'Continue'} <Icon name="arrow" size={16} /></button></div></form><aside className="checkout-summary"><h2>Your order</h2>{displayItems.map(({ product: item, quantity, cartKey }) => <div className="checkout-item" key={cartKey || item.id}><img src={item.image} alt="" /><span>{item.name}<small>Qty {quantity}</small></span><strong>{money(item.price * quantity)}</strong></div>)}<div className="checkout-summary-total"><span>Product subtotal</span><strong>{money(step === 4 ? displayTotal : subtotal)}</strong></div>{step !== 4 && discount > 0 && <div className="checkout-summary-total discount-line"><span>Secret Coupon ({coupon?.code})</span><strong className="discount-amount">−{money(discount)}</strong></div>}<div className="checkout-summary-total"><span>Delivery</span><strong>7 to 14 days (Free)</strong></div><div className="checkout-summary-total grand-total" style={{ borderTop: '1px solid var(--border, #d1ccc1)', paddingTop: '0.75rem', marginTop: '0.5rem' }}><span>Total</span><strong style={{ fontSize: '1.25rem' }}>{money(displayTotal)}</strong></div><small className="tax-note">All items ship factory-direct from Aanur Textile. Doorstep delivery in 7 to 14 days.</small></aside></div><div className="checkout-trust-bottom"><Icon name="truck" size={16} /> Doorstep delivery in 7 to 14 days across India</div></>}
  </div>;
}

function WishlistPage({ wishlist, onWish, onAdd, navigate, products = initialProducts }) {
  const items = products.filter((item) => wishlist.includes(item.id));
  return <div className="page-pad"><div className="page-heading"><div><span className="eyebrow">SAVED FOR A SOFTER DAY</span><h1>Your little list.</h1><p>All the things you’ve had your eye on, in one lovely place.</p></div><span className="saved-count">{items.length} pieces saved</span></div>{items.length ? <ProductGrid list={items} onAdd={onAdd} wishlist={wishlist} onWish={onWish} onQuick={(item) => navigate(`/product/${item.id}`)} /> : <div className="empty-state"><div className="empty-art"><Icon name="heart" size={35} /></div><h2>Keep the good ones close.</h2><p>Save the pieces you love and find them here whenever you’re ready.</p><button className="button button-dark" onClick={() => navigate('/shop')}>Find your favorites <Icon name="arrow" /></button></div>}</div>;
}

function VerifyOrderPage({ navigate, setToast }) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  const params = new URLSearchParams(window.location.search);
  const orderRef = params.get('orderRef') || '';
  const token = params.get('token') || '';

  useEffect(() => {
    if (!orderRef) {
      setError('No order reference specified.');
      setLoading(false);
      return;
    }

    fetch(`/api/orders/verify?orderRef=${encodeURIComponent(orderRef)}&token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setStatus(data);
          if (setToast) setToast(`Order #${orderRef} successfully confirmed!`);
        } else {
          return fetch(`/api/orders/status/${encodeURIComponent(orderRef)}`)
            .then((res) => res.json())
            .then((stat) => {
              if (stat.success) {
                setStatus(stat);
              } else {
                setError(data.error || 'Failed to verify order.');
              }
            });
        }
      })
      .catch(() => {
        setLoading(false);
        setError('Network error verifying order.');
      });
  }, [orderRef, token]);

  return (
    <div className="page-pad verify-order-page" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
      {loading ? (
        <div className="empty-state">
          <div className="empty-art"><Icon name="refresh" size={35} /></div>
          <h2>Verifying Your Order...</h2>
          <p>Connecting with our Nathakadaiyur loom management system...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-art"><Icon name="close" size={35} /></div>
          <h2>Verification Notice</h2>
          <p>{error}</p>
          <button className="button button-dark" onClick={() => navigate('/orders')}>View Your Orders</button>
        </div>
      ) : (
        <div className="order-verified-card" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e6ded3', padding: '36px 28px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eaf5eb', color: '#2e7d32', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
            <Icon name="check" size={36} />
          </div>
          <span className="eyebrow" style={{ color: '#2e7d32', fontWeight: 700 }}>ORDER VERIFIED & CONFIRMED</span>
          <h1 style={{ fontSize: '28px', margin: '8px 0 12px' }}>Order #{orderRef} Confirmed!</h1>
          <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.5, marginBottom: '24px' }}>
            Thank you for confirming your order! Your pure cotton bedsheets are scheduled for priority loom weaving and factory-direct dispatch from our workshop in Nathakadaiyur, Tamil Nadu.
          </p>

          <div style={{ background: '#fbf9f5', border: '1px solid #eee5da', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left', fontSize: '13.5px', lineHeight: 1.6 }}>
            <div><strong>Status:</strong> <span style={{ color: '#2e7d32', fontWeight: 600 }}>✓ Verified & Scheduled for Dispatch</span></div>
            <div><strong>Doorstep Delivery:</strong> 7 to 14 days across India</div>
            <div><strong>Workshop:</strong> Aanur Textile · Nathakadaiyur, Tamil Nadu</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="button button-dark" onClick={() => navigate('/orders')}>
              View in My Orders <Icon name="arrow" size={15} />
            </button>
            <button className="button button-outline" onClick={() => navigate('/shop')}>
              Browse Collections
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthPage({
  signup,
  setToast,
  navigate,
  redirect = '/profile',
  currentUser,
  setCurrentUser,
  notice = '',
}) {
  const [isSignUp, setIsSignUp] = useState(signup);
  const [otpStep, setOtpStep] = useState(1); // 1: Enter email, 2: Enter 6-digit code
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsSignUp(signup);
    setErrorMsg('');
    setOtpStep(1);
    setOtpCode('');
  }, [signup]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer = null;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [otpCountdown]);

  // Handle Send 6-Digit OTP to Gmail
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (isSignUp && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: fullName.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setOtpStep(2);
        setOtpCountdown(60);
        if (setToast) setToast(`Verification code sent to ${email.trim()}`);
      } else {
        setErrorMsg(data.error || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error sending verification code. Please check your connection.');
    }
  };

  // Handle Verify 6-Digit OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otpCode.trim(),
          name: fullName.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        const user = data.user;
        localStorage.setItem('aanur_profile_info', JSON.stringify(user));
        localStorage.setItem('aanur_is_logged_in', 'true');

        try {
          const raw = localStorage.getItem('aanur_registered_users');
          const users = raw ? JSON.parse(raw) : [];
          if (!users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
            localStorage.setItem('aanur_registered_users', JSON.stringify([...users, user]));
          }
        } catch {}

        if (setCurrentUser) setCurrentUser(user);
        setIsSuccess(true);
        if (setToast) setToast(`Welcome, ${user.name}!`);

        setTimeout(() => {
          navigate(redirect || '/profile');
        }, 800);
      } else {
        setErrorMsg(data.error || 'Invalid verification code. Please check your email and try again.');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg('Network error verifying code. Please try again.');
    }
  };

  return (
    <div className="auth-page page-pad">
      <div className="auth-image">
        <img src="/products/olive-check-bed-set.jpg" alt="Olive and rust patterned bedding" />
        <div>
          <span>AANUR TEXTILE</span>
          <h2>A softer home<br />starts here.</h2>
        </div>
      </div>

      <div className="auth-form-card">
        {isSuccess ? (
          <div className="auth-form auth-done-view">
            <div className="auth-done-icon">
              <Icon name="check" size={32} />
            </div>
            <span className="eyebrow">SUCCESS</span>
            <h1>{isSignUp ? 'Account Created!' : 'Signed In Successfully!'}</h1>
            <p>Taking you directly to your personal account profile...</p>
          </div>
        ) : (
          <div className="auth-form">
            <span className="eyebrow">{isSignUp ? 'NEW ARTISAN MEMBER' : 'AANUR TEXTILE SIGN IN'}</span>
            <h1>{isSignUp ? 'Create your account.' : 'Welcome back.'}</h1>
            <p>
              {isSignUp
                ? 'Sign up with your email to receive a secure one-time verification code.'
                : 'Enter your email to receive a secure 6-digit one-time verification code.'}
            </p>

            {notice && !currentUser && (
              <div className="auth-gate-notice">
                <Icon name="lock" size={15} />
                <span>{notice}</span>
              </div>
            )}

            {currentUser && (
              <div className="auth-already-logged" style={{
                background: 'rgba(183, 107, 82, 0.08)',
                border: '1px solid rgba(183, 107, 82, 0.25)',
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                marginBottom: '1.25rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}>
                <span>Signed in as <strong>{currentUser.name}</strong></span>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontWeight: 600,
                    color: 'var(--clay, #b76b52)',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => navigate('/profile')}
                >
                  Go to Profile &rarr;
                </button>
              </div>
            )}

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            {otpStep === 1 ? (
              <form onSubmit={handleSendOtp}>
                {isSignUp && (
                  <>
                    <label>
                      Full name
                      <input
                        required
                        autoComplete="name"
                        placeholder="e.g. Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </label>

                    <label>
                      Mobile number <span style={{ fontSize: '11px', color: '#888', fontWeight: 400 }}>(Optional)</span>
                      <div className="auth-phone-wrap">
                        <span className="auth-country-prefix">+91</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                        />
                      </div>
                    </label>
                  </>
                )}

                <label>
                  Gmail / Email Address
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>

                <button type="submit" className="button button-dark full-width" disabled={loading}>
                  <span>{loading ? 'Sending Verification Code...' : 'Send 6-Digit OTP to Gmail'}</span>
                  <Icon name="arrow" size={16} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div className="auth-otp-badge">
                  <span>Code sent to <strong>{email}</strong></span>
                  <button
                    type="button"
                    className="auth-change-email-btn"
                    onClick={() => { setOtpStep(1); setErrorMsg(''); setOtpCode(''); }}
                  >
                    Change
                  </button>
                </div>

                <label>
                  Enter 6-Digit Verification Code
                  <input
                    type="text"
                    required
                    autoFocus
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    className="auth-otp-input"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                  />
                </label>

                <button type="submit" className="button button-dark full-width" disabled={loading || otpCode.length !== 6}>
                  <span>{loading ? 'Verifying...' : 'Verify & Enter Account'}</span>
                  <Icon name="arrow" size={16} />
                </button>

                <div className="auth-resend-row">
                  {otpCountdown > 0 ? (
                    <span className="auth-countdown">Resend code in {otpCountdown}s</span>
                  ) : (
                    <button type="button" className="auth-resend-btn" onClick={handleSendOtp} disabled={loading}>
                      Resend OTP Code
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="auth-change">
              {isSignUp ? 'Already have an account?' : 'New to Aanur Textile?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setOtpStep(1);
                  setOtpCode('');
                  setIsSignUp(!isSignUp);
                  navigate(!isSignUp ? '/signup' : '/login');
                }}
              >
                {isSignUp ? 'Sign in with Gmail' : 'Create an account'}
              </button>
            </div>

            <small>
              By continuing, you agree to our <a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>Terms & Privacy.</a>
            </small>
          </div>
        )}
      </div>
    </div>
  );
}

function AccountPage({ navigate }) {
  return <div className="page-pad account-page"><span className="eyebrow">STOREFRONT PREVIEW</span><h1>Your little corner.</h1><p>Saved pieces and bag contents are stored in this browser. Orders and customer accounts aren’t connected.</p><div className="account-grid">{[['Your orders', 'Orders are not submitted or tracked on this site.', 'Order information', '/orders'], ['Your details', 'Account sign-in and profile details are not connected.', 'Sign-in preview', '/login'], ['Saved for later', 'Find the pieces you saved on this device.', 'View saved pieces', '/wishlist'], ['A little help', 'Contact the manufacturer directly.', 'Get in touch', '/contact']].map(([title, copy, action, path]) => <button key={title} className="account-tile" onClick={() => navigate(path)}><span className="account-tile-icon"><Icon name={title === 'Your orders' ? 'bag' : title === 'Saved for later' ? 'heart' : title === 'A little help' ? 'mail' : 'user'} /></span><h2>{title}</h2><p>{copy}</p><span>{action} <Icon name="arrow" size={15} /></span></button>)}</div></div>;
}

function OrdersPage({ navigate }) {
  return <div className="page-pad orders-page"><div className="breadcrumbs"><button onClick={() => navigate('/account')}>Your account</button><span>/</span><span>Orders</span></div><span className="eyebrow">YOUR AANUR TEXTILE ORDERS</span><h1>Your orders.</h1><div className="empty-state"><div className="empty-art"><Icon name="bag" size={35} /></div><h2>Track or inquire about an order.</h2><p>All bedsheets are shipped factory-direct with delivery in 7 to 14 days across India. Contact our workshop directly for order inquiries or custom sizes.</p><a className="button button-dark" href={store.phone}>Call {store.phoneDisplay} <Icon name="arrow" size={16} /></a></div><button className="text-link" onClick={() => navigate('/shop')}>Browse the collection <Icon name="arrow" size={16} /></button></div>;
}

function OrderDetail({ navigate }) {
  return <div className="page-pad order-detail-page"><div className="breadcrumbs"><button onClick={() => navigate('/orders')}>Your orders</button><span>/</span><span>Order tracking</span></div><span className="eyebrow">FACTORY DISPATCH</span><h1>Contact the maker<br />for an update.</h1><p>Orders are dispatched directly from our Nathakadaiyur workshop. Standard doorstep delivery takes 7 to 14 days across India.</p><a className="button button-dark" href={store.phone}>Call {store.phoneDisplay} <Icon name="arrow" size={16} /></a></div>;
}

function AboutPage({ navigate }) {
  return <div className="about-page"><section className="about-hero"><span className="eyebrow">AANUR TEXTILE · NATHAKADAIYUR</span><h1>Made with care.<br /><em>Made close to home.</em></h1><p>A village workshop, a skilled local team, and everyday bedsheets made in Nathakadaiyur.</p></section><div className="about-photo"><img src="/products/red-check-bedding.jpg" alt="Red and cream check bedsheet made by Aanur Textile" /></div><section className="about-statement"><span className="eyebrow">A TEXTILE STORY, SINCE 2013</span><h2>From village tailoring to <em>home textiles.</em></h2><p>Founded by {store.founder} in Nathakadaiyur, Aanur Textile began as one of the village’s early garment-making workshops, stitching durable shorts, trousers, and pants.</p><p>Over the years, the team invested in machinery and artisan training, growing into a maker of cotton and polyester-blend bedsheets. Today, more than 20 local workers bring their skill to the work, with pieces inspected in-house before dispatch.</p><button className="button button-dark" onClick={() => navigate('/shop')}>Browse the collection <Icon name="arrow" /></button></section><div className="about-values">{[['A local team', 'More than 20 skilled local artisans make up the Aanur Textile team.'], ['Textiles made in-house', 'Bedsheets made in Nathakadaiyur, Tiruppur.'], ['Factory-direct contact', 'Ask the maker directly about household, wholesale, or hotel and hospital orders.']].map(([title, copy]) => <article key={title}><Icon name="leaf" /><h3>{title}</h3><p>{copy}</p></article>)}</div></div>;
}

function ContactPage({ setToast }) {
  return <div className="contact-page"><div className="contact-intro"><span className="eyebrow">TALK DIRECTLY WITH THE MAKER</span><h1>Say hello to<br /><em>Aanur Textile.</em></h1><p>For household orders, wholesale supply, or hotel and hospital requirements, get in touch with the factory team.</p><div className="contact-method"><Icon name="user" /><span><strong>Founder & Managing Director</strong><small>{store.founder}</small></span></div><div className="contact-method"><Icon name="phone" /><span><strong>Call the factory</strong><small><a href={store.phone}>{store.phoneDisplay}</a></small></span></div><div className="contact-method"><Icon name="mail" /><span><strong>Official email</strong><small><a href={`mailto:${store.email}`}>{store.email}</a></small></span></div><div className="contact-method"><Icon name="truck" /><span><strong>Delivery timeframe</strong><small>Doorstep delivery in 7 to 14 days across India</small></span></div><div className="contact-method"><Icon name="pin" /><span><strong>Manufacturing address</strong><small>{store.address}</small></span></div><div className="contact-method"><Icon name="star" /><span><strong>Working hours</strong><small>{store.hours}</small></span></div><div className="contact-actions"><a className="button button-dark" href={store.phone}>Call the factory <Icon name="arrow" size={16} /></a><a className="button button-outline" href={store.map} target="_blank" rel="noreferrer">Open in Maps <Icon name="arrow" size={16} /></a></div></div><form className="contact-form" onSubmit={(event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));
  fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => {});
  form.reset();
  setToast('Thank you! Your message has been received. We will get in touch with you promptly.');
}}><label>Your name<input name="name" required placeholder="Name" /></label><label>Email address<input name="email" required type="email" placeholder="you@example.com" /></label><label>What can we help with?<select name="topic" defaultValue=""><option value="" disabled>Choose a topic</option><option>Household order</option><option>Wholesale supply</option><option>Hotel or hospital order</option><option>Bedsheet enquiry</option><option>Something else</option></select></label><label>Your note<textarea name="message" required rows="5" placeholder="Tell us what you need..." /></label><button className="button button-dark">Send enquiry <Icon name="arrow" size={16} /></button><p className="contact-form-note">You can also call us directly at {store.phoneDisplay} or email {store.email}.</p></form></div>;
}

function FaqPage() {
  const questions = [
    ['Where are your textiles made?', 'Bedsheets are made at Aanur Textile’s workshop in Nathakadaiyur, Kangayam, in the Tiruppur district of Tamil Nadu.'],
    ['How long does delivery take?', 'Doorstep delivery takes 7 to 14 days across India. All bedsheets are packed and shipped factory-direct from our workshop in Nathakadaiyur.'],
    ['What bedsheet designs and sizes are available?', 'The collection includes five designs in cotton and polyester blends. The manufacturer lists Queen and King sizes; contact the factory to confirm which colors are currently available.'],
    ['Can I enquire about wholesale or bulk orders?', `Yes. Aanur Textile welcomes wholesale and retail distribution enquiries, as well as hotel and hospital orders. Call the factory directly at ${store.phoneDisplay} or email ${store.email}.`],
    ['What payment methods do you accept?', 'We accept Cash on Delivery (COD) as well as direct UPI/bank transfer. Delivery is completed within 7 to 14 days.'],
    ['How do I find the factory?', `The manufacturing address is ${store.address}. Use the Maps link on the contact page for directions.`],
    ['When can I contact the team?', `The listed working hours are ${store.hours}.`]
  ];
  return <div className="faq-page page-pad"><div className="faq-intro"><span className="eyebrow">THE LITTLE DETAILS</span><h1>Good questions.<br /><em>Kind answers.</em></h1><p>Everything to know about the Aanur Textile collection and delivery.</p></div><div className="faq-list">{questions.map(([question, answer]) => <details key={question}><summary>{question}<Icon name="plus" size={18} /></summary><p>{answer}</p></details>)}</div><div className="faq-help"><Icon name="mail" /><span><strong>Want to ask the maker directly?</strong><small>Call or email the Aanur Textile team.</small></span><a href={store.phone}>Call {store.phoneDisplay} <Icon name="arrow" size={15} /></a></div></div>;
}

function NotFound({ navigate }) {
  return <div className="not-found"><span className="eyebrow">A LITTLE DETOUR</span><h1>This page took<br /><em>a slow day.</em></h1><p>We couldn't find what you were looking for, but there’s plenty of comfort elsewhere.</p><button className="button button-dark" onClick={() => navigate('/')}>Back to the good stuff <Icon name="arrow" /></button></div>;
}

function QuickView({ product, initialVariant = 0, onClose, onAdd, onDetails }) {
  const dialogRef = useRef(null);
  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const [activeSlide, setActiveSlide] = useState(initialVariant || 0);
  const [color, setColor] = useState(initialVariant || 0);

  const handleColorSelect = (index) => {
    setColor(index);
    if (images[index]) setActiveSlide(index);
  };

  const nextSlide = () => {
    const next = (activeSlide + 1) % images.length;
    setActiveSlide(next);
    if (product.colors && product.colors[next] !== undefined) setColor(next);
  };

  const prevSlide = () => {
    const prev = (activeSlide - 1 + images.length) % images.length;
    setActiveSlide(prev);
    if (product.colors && product.colors[prev] !== undefined) setColor(prev);
  };

  const currentImage = images[activeSlide] || product.image;

  useEffect(() => {
    const previous = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') nextSlide();
      if (event.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); previous?.focus?.(); };
  }, [onClose, activeSlide]);

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-title" tabIndex="-1" ref={dialogRef}>
      <button className="modal-close" aria-label="Close quick view" onClick={onClose}><Icon name="close" /></button>
      <div className="quick-modal-media">
        <img src={currentImage} alt={`${product.name} ${product.colorNames?.[color] || ''}`} />
        {product.colorNames?.[activeSlide] && (
          <div className="slider-variant-pill" style={{ top: '10px', right: '10px' }}>
            <span className="slider-variant-dot" style={{ backgroundColor: product.colors?.[activeSlide] || '#666' }} />
            <span>{product.colorNames[activeSlide]}</span>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button type="button" className="slider-arrow slider-prev" onClick={prevSlide} aria-label="Previous image">
              <Icon name="arrow" size={16} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button type="button" className="slider-arrow slider-next" onClick={nextSlide} aria-label="Next image">
              <Icon name="arrow" size={16} />
            </button>
            <div className="slider-dots">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`slider-dot ${activeSlide === idx ? 'active' : ''}`}
                  onClick={() => { setActiveSlide(idx); setColor(idx); }}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="quick-modal-copy">
        <span className="eyebrow">MADE BY AANUR TEXTILE</span>
        <h2 id="quick-title">{product.name}</h2>
        <div className="product-prices">
          <strong>{money(product.price)}</strong>
          {product.originalPrice > product.price && <del>{money(product.originalPrice)}</del>}
        </div>
        <p>{product.description}</p>
        <div className="option-block">
          <span className="option-label">Color: <strong>{product.colorNames?.[color] || `Variant ${color + 1}`}</strong></span>
          <div className="color-options">
            {product.colors.map((shade, index) => (
              <button
                key={shade}
                type="button"
                style={{ '--swatch-color': shade }}
                className={`color-swatch-btn ${color === index ? 'selected' : ''}`}
                onClick={() => handleColorSelect(index)}
                title={product.colorNames?.[index] || `Color ${index + 1}`}
                aria-label={`Choose ${product.colorNames?.[index] || `color ${index + 1}`}`}
                aria-pressed={color === index}
              />
            ))}
          </div>
        </div>
        <button className="button button-dark full-width" onClick={() => { onAdd(product, 1, { colorIndex: color, variantImage: currentImage }); onClose(); }}>
          Add to bag <Icon name="bag" size={17} />
        </button>
        <button className="text-link" onClick={() => onDetails(product.id)}>Take a closer look <Icon name="arrow" size={15} /></button>
      </div>
    </section>
  </div>;
}

function Footer({ navigate }) {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a className="wordmark" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }}><span>Aanur <i>Textile</i></span><small>COMFORT, CONSIDERED.</small></a><p>Home textiles made by Aanur Textile<br />in Nathakadaiyur, Tamil Nadu.<br /><small style={{ opacity: 0.85, display: 'block', marginTop: '0.4rem' }}>Doorstep delivery in 7 to 14 days</small></p><a className="social-link" href={store.phone} aria-label="Call Aanur Textile"><Icon name="phone" /></a></div><div className="footer-links"><div><h3>Find your comfort</h3><button onClick={() => navigate('/shop')}>Collections</button><button onClick={() => navigate('/category/Bedsheets')}>Bedsheets</button><button onClick={() => navigate('/sale')}>Best offers</button></div><div><h3>The useful bits</h3><button onClick={() => navigate('/login')}>Sign In / Register</button><button onClick={() => navigate('/account')}>Your account</button><button onClick={() => navigate('/orders')}>Track orders</button><button onClick={() => navigate('/contact')}>Contact the maker</button><button onClick={() => navigate('/faq')}>FAQs & Delivery</button></div><div><h3>A little more</h3><button onClick={() => navigate('/about')}>Our story</button><button onClick={() => navigate('/wishlist')}>Saved pieces</button><button onClick={() => navigate('/contact')}>Wholesale enquiries</button></div></div><div className="footer-news"><span className="eyebrow">AANUR TEXTILE · EST. 2013</span><h3>Made by skilled<br />local hands.</h3><p>{store.artisans} artisans in Nathakadaiyur. Factory-direct household, wholesale, hotel, and hospital orders welcome. Delivery in 7 to 14 days.</p><a className="text-link" href={store.phone}>Call {store.phoneDisplay} <Icon name="arrow" size={15} /></a></div></div><div className="footer-bottom"><span>© 2026 Aanur Textile, Nathakadaiyur.</span><span>{store.address} · Delivery: 7 to 14 days</span><div><a href={store.map} target="_blank" rel="noreferrer">Find us</a><a href={`mailto:${store.email}`}>Email</a><a href={store.phone}>Call</a></div></div></footer>;
}

export default App;
