import React, { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) =>
          item._id === newItem._id &&
          (item.variant === null || item.variant._id === newItem.variant._id) &&
          (item.customizable === false ||
            !item.side === null ||
            (item.customization === newItem.customization &&
              item.fil === newItem.fil &&
              item.tissu === newItem.tissu &&
              item.patch === newItem.patch &&
              item.side === newItem.side))
      );

      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id &&
            (item.variant === null ||
              item.variant._id === newItem.variant._id) &&
            (item.customizable === false ||
              !item.side === null ||
              (item.customization === newItem.customization &&
                item.fil === newItem.fil &&
                item.tissu === newItem.tissu &&
                item.patch === newItem.patch &&
                item.side === newItem.side))
              ? newItem
              : item
          )
        : [...state.cart.cartItems, newItem];

      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) =>
          !(
            item._id === action.payload._id &&
            (item.variant === null ||
              item.variant._id === action.payload.variant._id) &&
            (item.customizable === false ||
              !item.side === null ||
              (item.customization === action.payload.customization &&
                item.fil === action.payload.fil &&
                item.tissu === action.payload.tissu &&
                item.patch === action.payload.patch &&
                item.side === action.payload.side))
          )
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
        },
      };
    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case 'PAYMENT_METHOD_CLEAR':
      return { ...state, cart: { ...state.cart, paymentMethod: '' } };
    case 'SAVE_DELIVERY_METHOD':
      return {
        ...state,
        cart: { ...state.cart, deliveryMethod: action.payload },
      };
    case 'DELIVERY_METHOD_CLEAR':
      return { ...state, cart: { ...state.cart, deliveryMethod: '' } };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
