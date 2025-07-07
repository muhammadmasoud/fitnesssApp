import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { ToastContainer } from 'react-toastify';
import CustomToast from '../components/CustomToast';
import 'react-toastify/dist/ReactToastify.css';

import './Products.css';
import '../styles/toast-custom.css';

// Product images
import weightGain from '../assets/optimized/weight-gain.png';
import bcaa from '../assets/optimized/bcaa.png';
import slimShake from '../assets/optimized/slim-shake.png';
import WeightPlates from '../assets/optimized/Weight-Plates.png';
import benchpress from '../assets/optimized/bench-press.png';
import ChestPressMachine from '../assets/optimized/chest-press.png';
import seateddip from '../assets/optimized/seated-dip.png';
import bicepbench from '../assets/optimized/bicep-bench.png';
import armext from '../assets/optimized/arm-ext.png';
import tricepspress from '../assets/optimized/TRICEPS-PRESS.png';
import shoulderpress from '../assets/optimized/shoulder-press.png';
import lateralraises from '../assets/optimized/lateral-shoulder.png';
import cablerow from '../assets/optimized/cable-row.png';
import barbell from '../assets/optimized/barbell.png';
import bands from '../assets/optimized/bands.png';
import latpulldown from '../assets/optimized/lat-pull-down.png';
import abdominalbench from '../assets/optimized/abdominal-bench.png';
import armcurl from '../assets/optimized/arm-curl.png';
import mirror from '../assets/optimized/mirror.png';
import ladmineattachments from '../assets/optimized/ladmine-attachments.png';
import proteinOats from '../assets/optimized/protein-oats.png';
import optimumNutrition from '../assets/optimized/optimum-nutrition.png';
import componentProtein from '../assets/optimized/component-protein.png';
import proteinDrink from '../assets/optimized/protein-drink.png';
import slimShakePro from '../assets/optimized/slim-shake-pro.png';
import kettlebell from '../assets/optimized/kettlebell.png';
import trapbar from '../assets/optimized/trap-bar.png';
import dumbbell from '../assets/optimized/dumbbell.png';

const Products = () => {
  const [loaded] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // 4x2 grid
  const [wishlistItems, setWishlistItems] = useState([]);
  // No longer need showCategoryDropdown state since we're using CSS hover
  const productsRef = useRef(null);
  const titleRef = useRef(null);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const wishlistState = useSelector(state => state.wishlist.items);
  const navigate = useNavigate();



  // Product data
  const products = useMemo(() => [
    {
      id: 1,
      name: 'Naturade Weight Gain 578g',
      price: 35.50,
      image: weightGain,
      bestSeller: false,
      category: 'protein-powder'
    },
    {
      id: 2,
      name: 'Intra workout BCAA 500ml',
      price: 35.90,
      image: bcaa,
      bestSeller: true,
      category: 'protein-powder'
    },
    {
      id: 3,
      name: 'My Pro Slim Shake',
      price: 30.99,
      image: slimShake,
      bestSeller: false,
      category: 'protein-shake'
    },
    {
      id: 4,
      name: 'Protein & Oats Drink 46g',
      price: 30.67,
      image: proteinOats,
      bestSeller: false,
      category: 'protein-shake'
    },
    {
      id: 5,
      name: 'Optimum Nutrition 2.7kg',
      price: 45.99,
      image: optimumNutrition,
      bestSeller: false,
      category: 'protein-powder'
    },
    {
      id: 6,
      name: '4-Component Protein',
      price: 24.99,
      image: componentProtein,
      bestSeller: false,
      category: 'protein-powder'
    },
    {
      id: 7,
      name: 'Protein drink 47g',
      price: 20.79,
      image: proteinDrink,
      bestSeller: false,
      category: 'protein-shake'
    },
    {
      id: 8,
      name: 'V1 PRO 1008g',
      price: 29.99,
      image: slimShakePro,
      bestSeller: true,
      category: 'protein-powder'
    },
    {
      id: 9,
      name: 'Chest Press Machine',
      price: 1299.99,
      image: ChestPressMachine,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 10,
      name: 'Seated Dip Machine',
      price: 1099.50,
      image: seateddip,
      bestSeller: true,
      category: 'machines'
    },
    {
      id: 11,
      name: 'Bench Press',
      price: 199.75,
      image: benchpress,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 12,
      name: 'Bicep Curl Bench',
      price: 649.99,
      image: bicepbench,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 13,
      name: 'Arm Curl Machine',
      price: 899.99,
      image: armcurl,
      bestSeller: true,
      category: 'machines'
    },
    {
      id: 14,
      name: 'Arm Extension Machine',
      price: 879.50,
      image: armext,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 15,
      name: 'Triceps Press Machine',
      price: 749.99,
      image: tricepspress,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 16,
      name: 'Shoulder Press Machine',
      price: 999.99,
      image: shoulderpress,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 17,
      name: 'Lateral Raises Machine',
      price: 849.99,
      image: lateralraises,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 18,
      name: 'Cable Row Machine',
      price: 1199.50,
      image: cablerow,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 19,
      name: 'Lat Pull Down Machine',
      price: 1249.25,
      image: latpulldown,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 20,
      name: 'Abdominal Bench',
      price: 399.49,
      image: abdominalbench,
      bestSeller: false,
      category: 'machines'
    },
    {
      id: 21,
      name: 'Barbell',
      price: 199.99,
      image: barbell,
      bestSeller: false,
      category: 'equipment'
    },
    {
      id: 22,
      name: 'Weight Plates',
      price: 249.99,
      image: WeightPlates,
      bestSeller: true,
      category: 'equipment'
    },
    {
      id: 23,
      name: 'Kettlebells',
      price: 89.75,
      image: kettlebell,
      bestSeller: false,
      category: 'equipment'
    },
    {
      id: 24,
      name: 'Resistance Bands',
      price: 29.49,
      image: bands,
      bestSeller: false,
      category: 'equipment'
    },
    {
      id: 25,
      name: 'Workout Mirror',
      price: 1499.99,
      image: mirror,
      bestSeller: false,
      category: 'equipment'
    },
    {
      id: 26,
      name: 'Landmine Attachment',
      price: 149.99,
      image: ladmineattachments,
      bestSeller: false,
      category: 'equipment'
    },
    {
      id: 27,
      name: 'Trap Bar',
      price: 179.99,
      image: trapbar,
      bestSeller: false,
      category: 'equipment'
    },
    {
      id: 28,
      name: 'Dumbbell Set',
      price: 349.99,
      image: dumbbell,
      bestSeller: true,
      category: 'equipment'
    }
  ], []);

  // 3D tilt effect for product cards
  const handleMouseMove = (e, cardElement) => {
    const card = cardElement;
    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;

    // Calculate mouse position relative to card
    const mouseX = e.clientX - cardRect.left;
    const mouseY = e.clientY - cardRect.top;

    // Calculate rotation based on mouse position
    const rotateY = ((mouseX / cardWidth) - 0.5) * 10; // -5 to 5 degrees
    const rotateX = ((mouseY / cardHeight) - 0.5) * -10; // -5 to 5 degrees

    // Apply the transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = (cardElement) => {
    // Reset transform on mouse leave
    cardElement.style.transform = '';
  };

  useEffect(() => {
    // Animate title on load
    if (titleRef.current) {
      titleRef.current.classList.add('animate-title');
    }

    // Start revealing products one by one
    products.forEach((product, index) => {
      setTimeout(() => {
        setVisibleProducts(prev => [...prev, product.id]);
      }, index * 150); // Stagger the animations
    });

    // Animate products on scroll
    const handleScroll = () => {
      if (productsRef.current) {
        const productsPosition = productsRef.current.getBoundingClientRect();
        if (productsPosition.top < window.innerHeight && productsPosition.bottom >= 0) {
          // Start revealing products one by one if they're not already visible
          if (visibleProducts.length === 0) {
            products.forEach((product, index) => {
              setTimeout(() => {
                setVisibleProducts(prev => [...prev, product.id]);
              }, index * 150); // Stagger the animations
            });
          }
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    // Add 3D tilt effect to product cards
    const addTiltEffect = () => {
      const productCards = document.querySelectorAll('.product-card');
      productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
        card.addEventListener('mouseleave', () => handleMouseLeave(card));
      });
    };

    window.addEventListener('scroll', handleScroll);

    // Add tilt effect after a delay to ensure cards are rendered
    const tiltTimer = setTimeout(addTiltEffect, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(tiltTimer);

      // Clean up event listeners
      const productCards = document.querySelectorAll('.product-card');
      productCards.forEach(card => {
        card.removeEventListener('mousemove', (e) => handleMouseMove(e, card));
        card.removeEventListener('mouseleave', () => handleMouseLeave(card));
      });
    };
  }, [products, visibleProducts.length]);

  // Update wishlistItems when wishlistState changes
  useEffect(() => {
    setWishlistItems(wishlistState);
  }, [wishlistState]);

  // Format price to always show 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  // Handle adding product to cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevent event bubbling

    // If user is not logged in, redirect to signup page
    if (!currentUser) {
      navigate('/signup');
      return;
    }

    dispatch(addToCart(product));

    // Show success toast
    CustomToast.success(`${product.name} added to cart!`);
  };

  // Navigate to cart page function (kept for future use)
  // const goToCart = () => {
  //   navigate('/cart');
  // };

  // State to control dropdown visibility
  const [, setShowCategoryDropdown] = useState(false);

  // Filter products by category
  const filterByCategory = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
    setShowCategoryDropdown(false); // Hide dropdown after selection
  };

  // Reset filters to show all products
  const showAllProducts = () => {
    setActiveCategory(null);
    setCurrentPage(1); // Reset to first page when showing all
  };

  // Toggle category dropdown function (kept for future use)
  // const toggleCategoryDropdown = () => {
  //   setShowCategoryDropdown(!showCategoryDropdown);
  // };

  // Pagination functions
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to products section when changing page
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const nextPage = (totalPages) => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      if (productsRef.current) {
        productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (productsRef.current) {
        productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (product, e) => {
    e.stopPropagation(); // Prevent event bubbling

    // If user is not logged in, redirect to signup page
    if (!currentUser) {
      navigate('/signup');
      return;
    }

    // Check if product is in wishlist using the state variable
    const isProductInWishlist = wishlistItems.some(item => item.id === product.id);

    if (isProductInWishlist) {
      dispatch(removeFromWishlist(product.id));
      CustomToast.info(`${product.name} removed from wishlist!`);
    } else {
      dispatch(addToWishlist(product));
      CustomToast.success(`${product.name} added to wishlist!`);
    }
  };

  // Removed animation for price counting

  // Removed price animation initialization

  return (
    <div className={`products-page ${loaded ? 'loaded' : ''}`}>
      <ToastContainer />
      <div className="products-hero">
        <div className="particles-container">
          {[...Array(30)].map((_, index) => (
            <div
              key={index}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
                width: `${5 + Math.random() * 10}px`,
                height: `${5 + Math.random() * 10}px`,
                opacity: 0.1 + Math.random() * 0.3
              }}
            ></div>
          ))}
        </div>
        <div className="hero-glow"></div>
        <div className="products-hero-content">
          <h1 ref={titleRef} className="products-title ">OUR PRODUCTS</h1>
          <p className="products-subtitle  animate__delay-1s">Premium supplements to fuel your fitness journey</p>
          <div className="hero-cta  animate__delay-2s">
            <button className="browse-btn" onClick={showAllProducts}>
              <span className="btn-text">Browse All</span>
              <span className="btn-shine"></span>
            </button>
            <div className="categories-dropdown-container" ref={dropdownRef}>
              <button className="categories-btn">
                <span className="btn-text">Categories</span>
                <span className="btn-shine"></span>
              </button>
              <div className="categories-dropdown">
                <div className="dropdown-item" onClick={() => filterByCategory('protein-powder')}>
                  <i className="fas fa-prescription-bottle category-icon"></i>
                  <span>Protein Powder</span>
                </div>
                <div className="dropdown-item" onClick={() => filterByCategory('protein-shake')}>
                  <i className="fas fa-blender category-icon"></i>
                  <span>Protein Shake</span>
                </div>
                <div className="dropdown-item" onClick={() => filterByCategory('machines')}>
                  <i className="fas fa-dumbbell category-icon"></i>
                  <span>Machines</span>
                </div>
                <div className="dropdown-item" onClick={() => filterByCategory('equipment')}>
                  <i className="fas fa-running category-icon"></i>
                  <span>Equipments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="products-section" ref={productsRef}>
        <div className="section-header ">
          <h2 className="section-title">Featured Products</h2>
          <div className="section-divider"></div>
        </div>
        <div className="products-grid">
          {products
            .filter(product => !activeCategory || product.category === activeCategory)
            .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
            .map((product) => (
            <div
              key={product.id}
              data-id={product.id}
              className={`product-card ${visibleProducts.includes(product.id) ? 'visible ' : ''}`}
            >
              <div className="card-glow"></div>
              {product.bestSeller && (
                <div className="best-seller-badge  animate__infinite animate__slower">
                  Best seller
                </div>
              )}
              {currentUser && (
                <div
                  className={`wishlist-star ${wishlistItems.some(item => item.id === product.id) ? 'active' : ''}`}
                  onClick={(e) => handleWishlistToggle(product, e)}
                >
                  <i className={`fas ${wishlistItems.some(item => item.id === product.id) ? 'fa-star' : 'fa-star'}`}></i>
                </div>
              )}
              <div className={`product-image-container ${
                product.name === 'Shoulder Press Machine' ||
                product.name === 'Bicep Curl Bench' ||
                product.name === 'Abdominal Bench' ||
                product.name === 'Workout Mirror' ||
                product.name === 'Trap Bar' ||
                product.name === 'Protein & Oats Drink 46g'
                  ? 'special-container'
                  : ''
              }`}>
                <div className="image-glow"></div>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`product-image ${
                    product.name === 'Shoulder Press Machine' ||
                    product.name === 'Bicep Curl Bench' ||
                    product.name === 'Abdominal Bench' ||
                    product.name === 'Workout Mirror' ||
                    product.name === 'Trap Bar' ||
                    product.name === 'Protein & Oats Drink 46g'
                      ? 'product-image-large'
                      : ''
                  }`}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${formatPrice(product.price)}</p>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={(e) => handleAddToCart(product, e)}
                aria-label="Add to cart"
              >
                <i className="fas fa-shopping-cart"></i>
                <span className="btn-ripple"></span>
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {(() => {
          const filteredProducts = products.filter(product => !activeCategory || product.category === activeCategory);
          const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

          if (totalPages <= 1) return null;

          return (
            <div className="pagination-container">
              <button
                className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => prevPage()}
                disabled={currentPage === 1}
              >
                <i className="fas fa-chevron-left"></i> Prev
              </button>

              <div className="pagination-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => nextPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Next <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          );
        })()}
      </section>
    </div>
  );
};

export default Products;
