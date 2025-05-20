import React from 'react'
import { RiDeleteBin3Line } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

function CartContents({ cart, userId, guestId }) {
  const dispatch = useDispatch();

  // Handle adding or subtracting quantity
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          size,
          color,
          userId,
          guestId
        })
      );
    } else {
      //If quantity is less than 1, remove the item from the cart
      dispatch(
        removeFromCart({
          productId,
          size,
          color,
          userId,
          guestId
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color, userId, guestId }));
  };

  // If cart is undefined or doesn't have products, show a message
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div>
      {cart.products.map((product, index) => (
        <div className='flex items-start justify-between py-4' key={index}>
          <div className='flex items-start'>
            <img
              src={product.image}
              alt={product.name}
              className='w-20 h-24 object-cover mr-4 rounded'
            />
            <div>
              <h3>{product.name}</h3>
              <p className='text-sm text-gray-500'>
                Size: {product.size} | Color: {product.color}
              </p>
              <div className='flex items-center mt-2'>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className='border rounded px-2 py-1 text-xl font-medium'
                >
                  -
                </button>
                <span className='mx-4'>{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className='border rounded px-2 py-1 text-xl font-medium'
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>$ {product.price.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
            >
              <RiDeleteBin3Line className='h-6 w-6 mt-2 text-red-600' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartContents;