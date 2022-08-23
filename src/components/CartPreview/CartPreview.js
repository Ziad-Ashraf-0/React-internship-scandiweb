import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";

import styles from "./CartPreview.module.css";

export default class CartPreview extends Component {
  container = createRef();

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutside);
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (this.props.greyout) {
      this.props.handleGreyOut();
    }
  };

  handleClickOutside = (e) => {
    if (
      this.container.current &&
      !this.container.current.contains(e.target) &&
      !e.path[1].classList.contains("cart-container")
    ) {
      this.props.handleGreyOut();
    }
  };

  increment = (product) => {
    this.props.handleIncrement(product);
  };

  decrement = (product) => {
    this.props.handleDecrement(product);
  };

  handleCartClick = () => {
    this.props.handleGreyOut();
  };

  render() {
    const products = this.props.cartItems;

    return (
      <>
        {this.props.greyout && (
          <div className={styles.backdrop} onClick={this.handleClickBackdrop}>
            <div className={styles.modal} ref={this.container}>
              <p className={styles.title}>
                <span className={styles.title__name}>My Bag</span>,{" "}
                {this.props.itemsCount} items
              </p>

              {products.map((product, index) => {
                const price = product.prices.filter(
                  (price) =>
                    price.currency.symbol === this.props.selectedCurrency
                );
                return (
                  <div className={styles.product__wrapper} key={index}>
                    <div className={styles.product__content}>
                      <p className={styles.product__name}>{product.name}</p>
                      <p className={styles.product__price}>
                        {`${price[0].currency.symbol} ${price[0].amount}`}
                      </p>

                      {product.attributes.length
                        ? product.attributes.map((attributes) => {
                            return (
                              <div className={styles.align} key={attributes.id}>
                                <p
                                  className={styles.subtitle}
                                  key={attributes.id}
                                >
                                  {attributes.name}:
                                </p>

                                <div className={styles.attributes}>
                                  {attributes.items.map((item) => {
                                    return (
                                      <button
                                        type="button"
                                        key={item.id}
                                        className={
                                          product.selectedAttributes.some(
                                            (e) =>
                                              e.value === item.value &&
                                              e.id === attributes.id
                                          )
                                            ? attributes.id === "Color"
                                              ? styles.radioSelectedImg
                                              : styles.radioSelected
                                            : styles.radio
                                        }
                                        title={item.displayValue}
                                        style={{
                                          backgroundColor: `${item.value}`,
                                        }}
                                      >
                                        <p className={styles.align}>
                                          {attributes.id === "Color"
                                            ? ""
                                            : item.value}
                                        </p>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })
                        : null}
                    </div>

                    <div className={styles.counters}>
                      <button
                        type="button"
                        className={`${styles.square__button} ${styles.counters__up}`}
                        onClick={() => this.increment(product)}
                      >
                        +
                      </button>
                      <span className={styles.counters__count}>
                        {product.amount}
                      </span>
                      <button
                        type="button"
                        className={`${styles.square__button} ${styles.counters__down}`}
                        onClick={() => this.decrement(product)}
                      >
                        -
                      </button>
                    </div>

                    <div className={styles.product__thumb}>
                      <img
                        src={product.gallery[0]}
                        className={styles.product__image}
                        alt=""
                        width="105"
                        height="137"
                      />
                    </div>
                  </div>
                );
              })}

              <div className={styles.total}>
                <span className={styles.total__text}>Total</span>
                <span
                  className={styles.total__price}
                >{`${this.props.selectedCurrency} ${this.props.total}`}</span>
              </div>

              <div className={styles.buttons}>
                <Link
                  to="/cart"
                  className={`${styles.buttons__link} ${styles.buttons__view}`}
                  onClick={this.handleCartClick}
                >
                  View bag
                </Link>

                <Link
                  to="/checkout"
                  className={`${styles.buttons__link} ${styles.buttons__check}`}
                  onClick={this.handleCartClick}
                >
                  Check out
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
