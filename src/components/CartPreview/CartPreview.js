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
    console.log(this.props.cartItems.length);
    if (
      this.props.cartItems.length - 1 === (this.state.currentPage - 1) * 2 &&
      this.state.currentPage !== 1
    ) {
      this.setState({
        currentPage: this.state.currentPage - 1,
      });
    }
  };

  handleCartClick = () => {
    this.props.handleGreyOut();
  };

  handlePagination = (value) => {
    this.setState({ currentPage: value });
  };

  renderTotal() {
    return (
      <div className={styles.total}>
        <span className={styles.total__text}>Total</span>
        <span className={styles.total__price}>{`${
          this.props.selectedCurrency
        } ${this.props.total.toFixed(2)}`}</span>
      </div>
    );
  }

  renderButtons() {
    return (
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
    );
  }

  renderCounters(product) {
    return (
      <div className={styles.counters}>
        <button
          type="button"
          className={`${styles.square__button} ${styles.counters__up}`}
          onClick={() => this.increment(product)}
        >
          +
        </button>
        <span className={styles.counters__count}>{product.amount}</span>
        <button
          type="button"
          className={`${styles.square__button} ${styles.counters__down}`}
          onClick={() => this.decrement(product)}
        >
          -
        </button>
      </div>
    );
  }

  renderThumb(img) {
    return (
      <div className={styles.product__thumb}>
        <img
          src={img}
          className={styles.product__image}
          alt=""
          width="105"
          height="137"
        />
      </div>
    );
  }

  renderAttributes(product) {
    return product.attributes.length
      ? product.attributes.map((attributes) => {
          return (
            <div className={styles.align} key={attributes.id}>
              <p className={styles.subtitle} key={attributes.id}>
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
                            e.value === item.value && e.id === attributes.id
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
                              e.value === item.value && e.id === attributes.id
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
                          {attributes.id === "Color" ? "" : item.value}
                        </p>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      : null;
  }

  renderPrice(product) {
    const price = product.prices.filter(
      (price) => price.currency.symbol === this.props.selectedCurrency
    );
    return (
      <p className={styles.product__price}>
        {`${price[0].currency.symbol} ${price[0].amount.toFixed(2)}`}
      </p>
    );
  }

  renderPagination() {
    const products = this.props.cartItems;
    return (
      products.length > 2 && (
        <Pagination
          currentPage={this.state.currentPage}
          ItemsPerPage={this.state.itemsPerPage}
          totalItems={products.length}
          handlePagination={this.handlePagination}
        />
      )
    );
  }

  renderTitle() {
    return (
      <p className={styles.title}>
        <span className={styles.title__name}>My Bag</span>,{" "}
        {this.props.itemsCount} {this.props.itemsCount === 1 ? "item" : "items"}
      </p>
    );
  }

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
              {this.renderTitle()}
              {currentItems.map((product, index) => {
                return (
                  <div className={styles.product__wrapper} key={index}>
                    <div className={styles.product__content}>
                      <p className={styles.product__name}>{product.name}</p>
                      {this.renderPrice(product)}
                      {this.renderAttributes(product)}
                    </div>
                    {this.renderCounters(product)}
                    {this.renderThumb(product.gallery[0])}
                  </div>
                );
              })}

              {this.renderPagination()}
              {this.renderTotal()}
              {this.renderButtons()}
            </div>
          </div>
        )}
      </>
    );
  }
}
