import { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, removeFromWishlist, clearWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { ToastContainer } from 'react-toastify';
import CustomToast from '../components/CustomToast';
import 'react-toastify/dist/ReactToastify.css';

import './Wishlist.css';
import '../styles/toast-custom.css';
import wishlistBg from '../assets/optimized/wishlist-bg.jpg';

const Wishlist = () => {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Set loaded state after a short delay for animations
    setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Preload the background image
    const img = new Image();
    img.src = wishlistBg;
  }, []);

  // Format price to always show 2 decimal places
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  // Handle remove item from wishlist
  const handleRemoveItem = (productId, productName) => {
    dispatch(removeFromWishlist(productId));
    CustomToast.info(`${productName} removed from wishlist`);
  };

  // Handle clear wishlist
  const handleClearWishlist = () => {
    if (wishlistItems.length > 0) {
      dispatch(clearWishlist());
      CustomToast.info('Wishlist cleared');
    }
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    CustomToast.success(`${product.name} added to cart!`);
  };

  return (
    <div className={`wishlist-page ${loaded ? 'loaded' : ''}`}>
      <ToastContainer />
      <div className="page-overlay"></div>

      <Container className="wishlist-container">
        <div className="wishlist-content">
          <h1 className="wishlist-title ">YOUR WISHLIST</h1>
          <div className="wishlist-items-section">

            {wishlistItems.length === 0 ? (
              <div className="wishlist-empty">
                <div className="wishlist-empty-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3 className="wishlist-empty-title">Your wishlist is currently empty</h3>
                <p className="wishlist-empty-text">Save items you love for later.</p>
                <Link to="/products" className="continue-shopping-btn">
                  <i className="fas fa-arrow-left"></i> Browse Products
                </Link>
              </div>
            ) : (
              <>
                <div className="wishlist-items">
                  <div className="wishlist-header">
                    <div className="wishlist-header-product">Product</div>
                    <div className="wishlist-header-price">Price</div>
                    <div className="wishlist-header-actions">Actions</div>
                  </div>

                  <div className="wishlist-items-container">
                    {wishlistItems.map(item => (
                      <div key={item.id} className="wishlist-item ">
                        <div className="wishlist-item-product">
                          <img src={item.image} alt={item.name} className="wishlist-item-image" />
                          <div className="wishlist-item-details">
                            <h4 className="wishlist-item-name">{item.name}</h4>
                            {item.bestSeller && <span className="wishlist-item-badge">Best Seller</span>}
                          </div>
                        </div>
                        <div className="wishlist-item-price">${formatPrice(item.price)}</div>
                        <div className="wishlist-item-actions">
                          <button
                            className="add-to-cart-btn"
                            onClick={() => handleAddToCart(item)}
                          >
                            <i className="fas fa-shopping-cart"></i> Add to Cart
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="wishlist-actions">
                  <Button
                    variant="outline-secondary"
                    className="clear-wishlist-btn"
                    onClick={handleClearWishlist}
                  >
                    Clear Wishlist
                  </Button>
                </div>

                <div className="continue-shopping">
                  <Link to="/products" className="continue-shopping-link">
                    <i className="fas fa-arrow-left"></i> Continue Shopping
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Wishlist;
