import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : {products: []};
} ;

//helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async({ userId, guestId}, { rejectWithValue}) => {
    try{
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          params: {userId, guestId},
        }
      );
      return response.data;
    } catch(error){
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
)

//Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk("cart/addToCart", async ({productId, quantity, size, color, guestId, userId}, {rejectWithValue}) => {
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
       {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId
       }

      )
      return response.data;

  } catch (error){
    return rejectWithValue(error.response.data);

  }
})

//update an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async({productId, quantity, size, color, guestId, userId}, {rejectWithValue}) => {
    try{
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId
        }
      );
      return response.data;
    } catch(error){
      return rejectWithValue(error.response.data);
    }
  }
)
//Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async({productId, size, color, guestId, userId}, {rejectWithValue}) => {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
        data: {
          productId,
          size,
          color,
          guestId,
          userId
        }
      });
    //   const response = await axios.delete({
    //     method: "DELETE",
    //    url:`${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        
    //       data: {
    //         productId,
    //         size,
    //         color,
    //         guestId,
    //         userId
    //       }
        
    // });
      return response.data;
    } catch(error){
      return rejectWithValue(error.response.data);
    }
  }
)

//Merge guest cart with user cart
export const mergeCarts = createAsyncThunk(
  "cart/mergeCarts",
  async({userId, guestId}, {rejectWithValue}) => {
    try{
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        {userId, guestId},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
          }
        }
      );
      return response.data;
    } catch(error){
      return rejectWithValue(error.response.data);
    }
  }
)

const cartSlice = createSlice({
  name:"cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cart";
    })
    .addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to add to cart";
    })
    .addCase(updateCartItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(updateCartItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to upadte item quantity ";
    })
    .addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to remove item";
    })
    .addCase(mergeCarts.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(mergeCarts.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
      saveCartToStorage(action.payload);
    })
    .addCase(mergeCarts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to mrege cart";
    })
  }
})
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;