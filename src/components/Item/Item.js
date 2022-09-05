import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as EmpryCart } from "../../assets/empty-cart.svg";

import styles from "./Item.module.css";

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.handleClick.bind(this);
  }

  handleClick = (value) => {
    // We will start the process of changing
    // state of parent from Here...
    const temp = value.attributes.map((attribute) => {
      return {
        id: attribute.id,
        displayValue: attribute.items[0].displayValue,
        value: attribute.items[0].value,
      };
    });
    console.log({ ...value, selectedAttributes: temp });
    this.props.handleAddToCart({ ...value, selectedAttributes: temp });
  };

  renderAddToCart(product) {
    return (
      <button
        type="button"
        className={styles.item__cart}
        onClick={() => this.handleClick(product)}
        title="Add to cart"
        alt="Add to cart"
      >
        <EmpryCart />
      </button>
    );
  }

  renderItemContent(product) {
    const price = product.prices.filter(
      (price) => price.currency.symbol === this.props.selectedCurrency
    );
    return (
      <div className={styles.item__content}>
        <h2 className={styles.item__title}>{product.name}</h2>
        <h2 className={styles.item__brand}>{product.brand}</h2>
        <p className={styles.item__price}>{`${
          price[0].currency.symbol
        } ${price[0].amount.toFixed(2)}`}</p>
      </div>
    );
  }

  renderThumb(product) {
    return (
      <img
        src={product.gallery[0]}
        className={styles.item__image}
        title={product.name}
        alt={product.name}
      />
    );
  }

  render() {
    const product = this.props.product;
    const categoryName = this.props.category;

    const stockStatus = product.inStock
      ? styles.item
      : `${styles.item} ${styles["item--none"]}`;

    return (
      <li className={stockStatus}>
        <Link
          to={{
            pathname: `/${categoryName}/${product.id}`,
            state: { from: this.props.location },
          }}
          className={styles.item__link}
        >
          <article>
            <div className={styles.item__thumb}>
              {this.renderThumb(product)}
            </div>
            {this.renderItemContent(product)}
            {!product.inStock && (
              <p className={styles.item__out}>Out of stock</p>
            )}
          </article>
        </Link>
        {product.inStock && this.renderAddToCart(product)}
      </li>
    );
  }
}
