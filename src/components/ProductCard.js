import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  Grid,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {
  // const data=[
  //   {
  //     "name": "iPhone XR",
  //     "category": "Phones",
  //     "cost": 100,
  //     "rating": 4,
  //     "image": "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/42d4d057-8704-4174-8d74-e5e9052677c6.png",
  //     "_id": "v4sLtEcMpzabRyfx"
  //     },
  //     {
  //     "name": "Basketball",
  //     "category": "Sports",
  //     "cost": 100,
  //     "rating": 5,
  //     "image": "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/64b930f7-3c82-4a29-a433-dbc6f1493578.png",
  //     "_id": "upLK9JbQ4rMhTwt4"
  //     }
  // ];
  return (
    <Card className="card">
      <Card className="card">
          <CardMedia
            component="img"
            height="auto"
            image={product.image}
            alt={product.name}
          />
          <CardContent>
            <Typography className="card-actions" gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography className="card-actions" variant="h6" fontWeight="700">
              ${product.cost}
            </Typography>
            <Rating name="size-large" className="card-actions" defaultValue={product.rating} size="large" readOnly />
          </CardContent>
          <CardActions>
            <Button className="card-button" fullWidth onClick={handleAddToCart} startIcon={<AddShoppingCartOutlined/>} variant="contained" >
              ADD TO CART
            </Button>
          </CardActions>
      </Card>
    </Card>
  );
};

export default ProductCard;
