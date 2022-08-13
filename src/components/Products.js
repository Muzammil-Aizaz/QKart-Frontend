import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard"
import Cart,{generateCartItemsFrom} from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
  const token=localStorage.getItem("token");
  const [productData,setProductData]=useState([]);
  const [filteredProducts,setFilteredProducts]=useState([]);
  const [loading,setLoading]=useState(false);
  const [debounceTimeout,setDebounceTimeout]=useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [purchaseItems,setPurchaseItems]=useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    const url=config.endpoint+"/products";
    try{
      const response=await axios.get(url);
      setLoading(false);
      setProductData(response.data);
      setFilteredProducts(response.data);
      return response;
    }catch(e){
      if(e.response && e.response.status===500){
        enqueueSnackbar(e.response.data.message,{variant:"error"})
        return null;
      }else{
        return enqueueSnackbar("Something went wrong. Check the backend console for more details",{variant:"error"})
      }
    }
  };

  // const mappingTool=(array)=>{
  //   const nextArr=array.map((item)=>{
  //     return item;
  //   })
  //   return nextArr;
  // }
  useEffect(()=>{
    performAPICall();
    //console.log(productData);
  },[])
  useEffect(()=>{
    //console.log(purchaseItems);
    fetchCart(token).then((cartData)=>generateCartItemsFrom(cartData,productData)).then((cartItems)=>setPurchaseItems(cartItems));
  },[productData]);


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const url=config.endpoint+"/products/search?value="+text;
    try{
      const response=await axios.get(url);
      setFilteredProducts(response.data);
    }catch(e){
      if(e.response){
        if(e.response.status===404){
          setFilteredProducts([]);
        }
        if(e.response.status===500){
          enqueueSnackbar(e.response.data.message,{variant:"error"})
          setFilteredProducts(productData);
        }
      }else{
        enqueueSnackbar("Could not fetch the products. Check that the backend server is working",{variant:"error"})
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const value=event.target.value;

    if(debounceTimeout){
      clearTimeout(debounceTimeout);
    }

    const timeout=setTimeout(async()=>{
      await performSearch(value);
    },500)
    setDebounceTimeout(timeout);
  };
  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */


  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const url=config.endpoint+"/cart";
      const response =await axios.get(url,{
        headers:{
          'Content-Type': 'application/json',
          "Authorization":`Bearer ${token}`
        }
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.findIndex((item)=>(item.productId===productId)) !==-1;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Please log in to add item to the card", {
        variant: "warning"
      });
      return;
    }
    if(options.preventDuplicate && isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart",{
        variant:"warning"
      });
      return;
    }
    try{
      const url=config.endpoint+"/cart";
      const response=await axios.post(url,
        {productId,qty},
        {
          headers:{
            "Authorization":`Bearer ${token}`
          }
        });
        const cartItems= generateCartItemsFrom(response.data,products);
        setPurchaseItems(cartItems);
       

    }catch(e){
      if(e.response){
        enqueueSnackbar(e.response.data.message,{variant:"error"})
      }else{
        enqueueSnackbar("Could not fetch products. Check that the backend is running, reachable and returns valid JSON.")
      }
    }
    console.log("Added to cart", `${productId}`);
  };


  const testCase=[
      {
        "name": "UNIFACTOR Mens Running Shoes",
        "category": "Fashion",
        "cost": 50,
        "rating": 5,
        "image": "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/42d4d057-8704-4174-8d74-e5e9052677c6.png",
        "_id": "BW0jAAeDJmlZCF8i",
        "productId":"BW0jAAeDJmlZCF8i",
        "qty":"1"
      },
      {
        "name": "YONEX Smash Badminton Racquet",
        "category": "Sports",
        "cost": 100,
        "rating": 5,
        "image": "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/64b930f7-3c82-4a29-a433-dbc6f1493578.png",
        "_id": "KCRwjF7lN97HnEaY",
        "productId":"KCRwjF7lN97HnEaY",
        "qty":"1"
      },
      {
        "name": "Tan Leatherette Weekender Duffle",
        "category": "Fashion",
        "cost": 150,
        "rating": 4,
        "image": "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
        "_id": "PmInA797xJhMIPti",
        "productId":"PmInA797xJhMIPti",
        "qty":"1"
      }
  ]





  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
        className="search-desktop"
        size="small"
        onChange={(e)=>debounceSearch(e,debounceTimeout)}
        InputProps={{
          className:"search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={(e)=>debounceSearch(e,debounceTimeout)}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item md={token?9:12} className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
            {loading?
            (<Box className="loading" display="flex" p={5} justifyContent="center" alignItems="center">
              <CircularProgress size={25} mt={5} color="primary"/>
              <p>Loading Products..</p>
            </Box>):
            (
              <Grid container p={2} spacing={2}>
                {filteredProducts.length?(
                  filteredProducts.map((product)=>(
                    <Grid item md={3} xs={6} key={product._id}>
                      <ProductCard
                        product={product}
                        handleAddToCart={async ()=>{
                          await addToCart(token,purchaseItems,productData,product._id,1,{preventDuplicate:true});
                        }}
                      />
                    </Grid>
                  ))
                ):(
                  <Box className="loading" >
                  < SentimentDissatisfied color="action"/>
                    <h4 style={{color:"#636363"}}>No products found</h4>
                  </Box>
                )}
              </Grid>
            )}
        </Grid>
        {token?(
          <Grid item md={3} xs={12} bgcolor="#E9F5E1">
            <Cart products={productData} items={purchaseItems} handleQuantity={addToCart}/>
          </Grid>
        ):null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
