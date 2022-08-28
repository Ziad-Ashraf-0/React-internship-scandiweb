import React, { Component, createRef } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination.js";

import styles from "./CartPreview.module.css";

export default class CartPreview extends Component {
  container = createRef();

  constructor(props) {
    super(props);
    this.state = {
      condition: true,
      currentPage: 1,
      itemsPerPage: 2,
    };
  }

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
      !e.path[1].classList.contains("cart-container") &&
      this.state.condition
    ) {
      this.props.handleGreyOut();
    } else {
      this.setState({ condition: true });
    }
  };

  increment = (product) => {
    this.props.handleIncrement(product);
  };

  decrement = (product) => {
    this.setState({ condition: false });
    this.props.handleDecrement(product);
  };

  handleCartClick = () => {
    this.props.handleGreyOut();
  };

  handlePagination = (value) => {
    this.setState({ currentPage: value });
  };

  render() {
    const products = this.props.cartItems;
    const indexOfLastItem = this.state.currentPage * this.state.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - this.state.itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <>
        {this.props.greyout && (
          <div
            className={styles.backdrop}
            ref={this.container}
            onClick={this.handleClickBackdrop}
          >
            <div className={styles.modal}>
              <p className={styles.title}>
                <span className={styles.title__name}>My Bag</span>,{" "}
                {this.props.itemsCount} items
              </p>

              {currentItems.map((product, index) => {
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
                                      <div
                                        key={item.id}
                                        className={
                                          product.selectedAttributes.some(
                                            (e) =>
                                              e.value === item.value &&
                                              e.id === attributes.id
                                          ) && attributes.id === "Color"
                                            ? styles.buttonContainerImg
                                            : styles.buttonContainer
                                        }
                                      >
                                        <button
                                          type="button"
                                          className={
                                            product.selectedAttributes.some(
                                              (e) =>
                                                e.value === item.value &&
                                                e.id === attributes.id
                                            )
                                              ? attributes.id === "Color"
                                                ? styles.radioSelectedImg
                                                : styles.radioSelected
                                              : attributes.id === "Color"
                                              ? styles.radioImg
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
                                      </div>
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

              {products.length > 2 && (
                <Pagination
                  ItemsPerPage={this.state.itemsPerPage}
                  totalItems={products.length}
                  handlePagination={this.handlePagination}
                />
              )}

              <div className={styles.total}>
                <span className={styles.total__text}>Total</span>
                <span className={styles.total__price}>{`${
                  this.props.selectedCurrency
                } ${this.props.total.toFixed(2)}`}</span>
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
