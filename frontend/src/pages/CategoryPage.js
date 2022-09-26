import React from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }

  function CategoryPage() {
    const [
      { loading, error, category, loadingCreateReview },
      dispatch,
    ] = useReducer(reducer, {
      category: [],
      loading: true,
      error: '',
    });
    useEffect(() => {
      const fetchData = async () => {
        dispatch({ type: 'FETCH_REQUEST' });
        try {
          const result = await axios.get(`/api/category/${category}`);
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        } catch (err) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
        }
      };
      fetchData();
    }, [category]);
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const addToCartHandler = async () => {
      const existItem = cart.cartItems.find((x) => x._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;
      const { data } = await axios.get(`/api/products/${product._id}`);
      if (data.countInStock < quantity) {
        window.alert('Désolé, le produit est épuisé');
        return;
      }
      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity },
      });
      navigate('/cart');
    };

    return loading ? (
      <LoadingBox />
    ) : error ? (
      <MessageBox variant="danger">{error}</MessageBox>
    ) : (
      <div>
        <h1>{category}</h1>
      </div>
    );
  }
};
export default CategoryPage;
