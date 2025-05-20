// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import PayPalButton from './PayPalButton';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { createCheckout } from '../../redux/slices/checkoutSlice';

// function CheckOut() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { cart, loading, error } = useSelector((state) => state.cart);
//   const { user } = useSelector((state) => state.auth);

//   const [checkoutId, setCheckoutId] = useState(null);
//   const [shippingAddress, setShippingAddress] = useState({
//     firstName: "",
//     lastName: "",
//     address: "",
//     city: "",
//     postalCode: "",
//     country: "",
//     phone: ""
//   });

//   useEffect(() => {
//     if (!cart || !cart.products || cart.products.length === 0) {
//       navigate("/");
//     }
//   }, [cart, navigate]);

//   const handleCreateCheckout = async (e) => {
//     e.preventDefault();
//     if (cart && cart.products.length > 0) {
//       const res = await dispatch(
//         createCheckout({
//           checkoutItems: cart.products,
//           shippingAddress,
//           paymentMethod: "PayPal",
//           totalPrice: cart.totalPrice,
//         })
//       );

//       console.log("Checkout creation response:", res);

//       if (res.payload && res.payload._id) {
//         setCheckoutId(res.payload._id);
//       } else {
//         console.error("Failed to create checkout or missing _id in payload");
//       }
//     }
//   };

//   const handlePaymentSuccess = async (details) => {
//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
//         {
//           paymentStatus: "Paid",
//           paymentDetails: details,
//           checkoutId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         await handleFinalizeCheckout(checkoutId);
//       } else {
//         console.error("Payment update failed");
//       }
//     } catch (error) {
//       console.error("Payment error:", error);
//     }
//   };

//   const handleFinalizeCheckout = async (checkoutId) => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         navigate("/order-confirmation");
//       } else {
//         console.error("Finalizing checkout failed");
//       }
//     } catch (error) {
//       console.error("Finalize error:", error);
//     }
//   };

//   if (loading) return <div>Loading Cart...</div>;
//   if (error) return <div>{error}</div>;
//   if (!cart || !cart.products || cart.products.length === 0) {
//     return <div>No products in cart</div>;
//   }

//   return (
//     <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
//       <div className='bg-white rounded-lg p-6'>
//         <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
//         <form onSubmit={handleCreateCheckout}>
//           <h3 className='text-lg mb-4'>Contact Details</h3>
//           <div className='mb-4'>
//             <label className='block text-gray-700'>Email</label>
//             <input
//               type="email"
//               value={user ? user.email : ""}
//               className='w-full p-2 border rounded'
//               disabled
//             />
//           </div>
//           <h3 className='text-lg mb-4'>Delivery</h3>
//           <div className='mb-4 grid grid-cols-2 gap-4'>
//             <input type="text" placeholder="First Name" required value={shippingAddress.firstName} onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })} className='w-full p-2 border rounded'/>
//             <input type="text" placeholder="Last Name" required value={shippingAddress.lastName} onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })} className='w-full p-2 border rounded'/>
//           </div>
//           <input type="text" placeholder="Address" required value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className='w-full mb-4 p-2 border rounded'/>
//           <div className='mb-4 grid grid-cols-2 gap-4'>
//             <input type="text" placeholder="City" required value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className='w-full p-2 border rounded'/>
//             <input type="text" placeholder="Postal Code" required value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} className='w-full p-2 border rounded'/>
//           </div>
//           <input type="text" placeholder="Country" required value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} className='w-full mb-4 p-2 border rounded'/>
//           <input type="tel" placeholder="Phone" required value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} className='w-full mb-6 p-2 border rounded'/>

//           <div className='mt-6'>
//             {!checkoutId ? (
//               <button type='submit' className='w-full bg-black text-white py-3 rounded'>Continue to Payment</button>
//             ) : (
//               <div>
//                 <h3 className='text-lg mb-4'>Pay with Paypal</h3>
//                 <PayPalButton
//                   amount={cart.totalPrice}
//                   onSuccess={handlePaymentSuccess}
//                   onError={() => alert("Payment failed. Try Again!")}
//                 />
//               </div>
//             )}
//           </div>
//         </form>
//       </div>

//       <div className='bg-gray-50 p-6 rounded-lg'>
//         <h3 className='text-lg mb-4'>Order Summary</h3>
//         <div className='border-t py-4 mb-4'>
//           {cart.products.map((product, index) => (
//             <div key={index} className='flex items-center justify-between py-2 border-b'>
//               <div className='flex items-start'>
//                 <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
//                 <div>
//                   <h3 className='text-md'>{product.name}</h3>
//                   <p className='text-gray-500'>Size: {product.size}</p>
//                   <p className='text-gray-500'>Color: {product.color}</p>
//                 </div>
//               </div>
//               <p className='text-xl'>${(product.price * product.quantity).toLocaleString()}</p>
//             </div>
//           ))}
//         </div>
//         <div className='flex justify-between text-lg mb-2'>
//           <p>Subtotal</p>
//           <p>${cart.totalPrice.toLocaleString()}</p>
//         </div>
//         <div className='flex justify-between text-lg mb-2'>
//           <p>Shipping</p>
//           <p>Free</p>
//         </div>
//         <div className='flex justify-between text-lg font-bold border-t pt-4'>
//           <p>Total</p>
//           <p>${cart.totalPrice.toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CheckOut;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { createCheckout } from '../../redux/slices/checkoutSlice';

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: ""
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      try {
        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod: "PayPal",
            totalPrice: cart.totalPrice,
          })
        );

        console.log("Checkout creation response:", res);

        if (res.payload && res.payload._id) {
          setCheckoutId(res.payload._id);
          setPaymentError(null);
        } else {
          console.error("Failed to create checkout or missing _id in payload");
          setPaymentError("Failed to create checkout. Please try again.");
        }
      } catch (err) {
        console.error("Checkout creation error:", err);
        setPaymentError("Error creating checkout. Please try again.");
      }
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      // Check if we have a valid checkoutId
      if (!checkoutId) {
        console.error("No checkout ID available");
        setPaymentError("Payment failed: No checkout ID available");
        return;
      }
      
      // Make sure we have the necessary payment details
      if (!details || !details.id) {
        console.error("Invalid payment details", details);
        setPaymentError("Payment failed: Invalid payment details");
        return;
      }

      // Format the payment details in a way your API expects
      const paymentData = {
        paymentStatus: "paid",
        paymentDetails: {
          id: details.id,
          status: details.status,
          payer: details.payer,
          create_time: details.create_time,
          update_time: details.update_time
        }
      };

      console.log("Sending payment data to API:", paymentData);
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        paymentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      console.log("Payment update response:", response);

      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      } else {
        console.error("Payment update failed");
        setPaymentError("Payment update failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      
      // Set a user-friendly error message based on the error response
      if (error.response) {
        setPaymentError(`Payment failed: ${error.response.data.message || 'Server returned an error'}`);
      } else if (error.request) {
        setPaymentError("Payment failed: No response from server");
      } else {
        setPaymentError("Payment failed: Please try again");
      }
    }
  };
  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
  
      // Change from checking 200 to checking for success (200-299 range)
      if (response.status >= 200 && response.status < 300) {
        navigate("/order-confirmation");
      } else {
        console.error("Finalizing checkout failed with status:", response.status);
        setPaymentError("Failed to finalize your order. Please contact support.");
      }
    } catch (error) {
      console.error("Finalize error:", error);
      
      // Enhanced error reporting
      let errorMessage = "Error finalizing your order. Please contact support.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        console.error("Server response:", error.response.data);
      }
      setPaymentError(errorMessage);
    }
  };

  // const handleFinalizeCheckout = async (checkoutId) => {
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
  //       {},
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       navigate("/order-confirmation");
  //     } else {
  //       console.error("Finalizing checkout failed");
  //       setPaymentError("Failed to finalize your order. Please contact support.");
  //     }
  //   } catch (error) {
  //     console.error("Finalize error:", error);
  //     setPaymentError("Error finalizing your order. Please contact support.");
  //   }
  // };

  if (loading) return <div>Loading Cart...</div>;
  if (error) return <div>{error}</div>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <div>No products in cart</div>;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter'>
      <div className='bg-white rounded-lg p-6'>
        <h2 className='text-2xl uppercase mb-6'>Checkout</h2>
        
        {paymentError && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {paymentError}
          </div>
        )}
        
        <form onSubmit={handleCreateCheckout}>
          <h3 className='text-lg mb-4'>Contact Details</h3>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className='w-full p-2 border rounded'
              disabled
            />
          </div>
          <h3 className='text-lg mb-4'>Delivery</h3>
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <input type="text" placeholder="First Name" required value={shippingAddress.firstName} onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })} className='w-full p-2 border rounded'/>
            <input type="text" placeholder="Last Name" required value={shippingAddress.lastName} onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })} className='w-full p-2 border rounded'/>
          </div>
          <input type="text" placeholder="Address" required value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className='w-full mb-4 p-2 border rounded'/>
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <input type="text" placeholder="City" required value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className='w-full p-2 border rounded'/>
            <input type="text" placeholder="Postal Code" required value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} className='w-full p-2 border rounded'/>
          </div>
          <input type="text" placeholder="Country" required value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} className='w-full mb-4 p-2 border rounded'/>
          <input type="tel" placeholder="Phone" required value={shippingAddress.phone} onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })} className='w-full mb-6 p-2 border rounded'/>

          <div className='mt-6'>
            {!checkoutId ? (
              <button type='submit' className='w-full bg-black text-white py-3 rounded'>Continue to Payment</button>
            ) : (
              <div>
                <h3 className='text-lg mb-4'>Pay with Paypal</h3>
                <PayPalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    setPaymentError("Payment failed. Please try again.");
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      <div className='bg-gray-50 p-6 rounded-lg'>
        <h3 className='text-lg mb-4'>Order Summary</h3>
        <div className='border-t py-4 mb-4'>
          {cart.products.map((product, index) => (
            <div key={index} className='flex items-center justify-between py-2 border-b'>
              <div className='flex items-start'>
                <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4' />
                <div>
                  <h3 className='text-md'>{product.name}</h3>
                  <p className='text-gray-500'>Size: {product.size}</p>
                  <p className='text-gray-500'>Color: {product.color}</p>
                </div>
              </div>
              <p className='text-xl'>${(product.price * product.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className='flex justify-between text-lg mb-2'>
          <p>Subtotal</p>
          <p>${cart.totalPrice.toLocaleString()}</p>
        </div>
        <div className='flex justify-between text-lg mb-2'>
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className='flex justify-between text-lg font-bold border-t pt-4'>
          <p>Total</p>
          <p>${cart.totalPrice.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;