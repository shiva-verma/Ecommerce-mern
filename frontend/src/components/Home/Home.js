import React, {Fragment} from 'react'
import { CgMouse } from "react-icons/cg";
import ProductCard from "./ProductCard.js";
import "./Home.css";
import MetaData from "../../components/layout/MetaData.js"

const product ={
    name:"blue-MdTurnSharpRight",
    images:[{url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9W5wKFJz73EYsMh58kD2Z2UGukbtvx5B-mg&usqp=CAU"}],
    price:"30000",
    _id:"rudra",
    ratings:3.5
}

const Home = () => {
  return (
    <Fragment>
          <MetaData title="ECOMMERCE" />

          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
              <ProductCard product = {product} />
              <ProductCard product = {product} />
              <ProductCard product = {product} />
              <ProductCard product = {product} />
              <ProductCard product = {product} />
              <ProductCard product = {product} />
              <ProductCard product = {product} />
              <ProductCard product = {product} />
              <ProductCard product = {product} />
          </div>
        </Fragment>
  )
}

export default Home