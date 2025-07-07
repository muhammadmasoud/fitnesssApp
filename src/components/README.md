# Components Documentation

## DynamicBackground

The `DynamicBackground` component is a reusable component that applies a background image to its children. It ensures that when you change the imported image, the background changes too.

### Usage

```jsx
import DynamicBackground from '../components/DynamicBackground';
import myBackgroundImage from '../assets/optimized/my-background.jpg';

const MyPage = () => {
  return (
    <DynamicBackground imageUrl={myBackgroundImage} className="my-page">
      {/* Your page content here */}
    </DynamicBackground>
  );
};
```

### Props

- `imageUrl` (required): The imported image URL
- `children` (required): Child components
- `className` (optional): Additional CSS classes
- `overlayStyle` (optional): Custom styles for the overlay
- `style` (optional): Additional styles for the container

### How It Works

1. The component preloads the background image to ensure it's available when needed
2. It applies the background image using inline styles, which ensures that when the imported image changes, the background changes too
3. It includes a semi-transparent overlay by default, which can be customized
4. It handles the loading state and animation automatically

### Example

```jsx
import DynamicBackground from '../components/DynamicBackground';
import heroImage from '../assets/optimized/hero.jpg';

const HomePage = () => {
  return (
    <DynamicBackground
      imageUrl={heroImage}
      className="home-page"
      overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
      style={{ padding: '50px 0' }}
    >
      <div className="hero-content">
        <h1>Welcome to Our Website</h1>
        <p>Discover amazing content and services</p>
        <button className="cta-button">Get Started</button>
      </div>
    </DynamicBackground>
  );
};
```

### Benefits

- **Consistent Pattern**: Provides a consistent way to handle background images across the application
- **Dynamic Updates**: When you change the imported image, the background changes automatically
- **Caching Control**: Handles browser caching issues by using the imported image directly
- **Responsive**: Works well on all screen sizes
- **Customizable**: Allows customization of the overlay and container styles

### Best Practices

1. Always import the image at the top of your file:
   ```jsx
   import myBackgroundImage from '../assets/optimized/my-background.jpg';
   ```

2. Pass the imported image directly to the `imageUrl` prop:
   ```jsx
   <DynamicBackground imageUrl={myBackgroundImage}>
   ```

3. Add a descriptive className to help with styling:
   ```jsx
   <DynamicBackground imageUrl={myBackgroundImage} className="about-page">
   ```

4. If you need to customize the overlay, use the `overlayStyle` prop:
   ```jsx
   <DynamicBackground
     imageUrl={myBackgroundImage}
     overlayStyle={{ background: 'rgba(0, 0, 0, 0.3)' }}
   >
   ```

5. For additional container styles, use the `style` prop:
   ```jsx
   <DynamicBackground
     imageUrl={myBackgroundImage}
     style={{ minHeight: '80vh' }}
   >
   ```
