import React, { Component } from "react";
import Item from "../Item/Item.js";

import styles from "./ProductsList.module.css";

export default class ProductsList extends Component {
  render() {
    return (
      <ul className={styles.list}>
        {this.props.products.map((product) => (
          <Item
            key={product.id}
            product={product}
            category={this.props.category || product.category}
            handleAddToCart={this.props.handleAddToCart}
            selectedCurrency={this.props.selectedCurrency}
          />
        ))}
      </ul>
    );
  }
}
