import React, { Component } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

import styles from "./CartPage.module.css";

const arrayEquals = (array1, array2) => {
  return JSON.stringify(array1) === JSON.stringify(array2);
};

export default class CartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.cartItems.map((e) => {
        return { ...e, currImg: 0, imgLength: e.gallery.length };
      }),
    };
  }

  increment = (product) => {
    this.props.handleIncrement(product);
  };

  decrement = (product) => {
    this.props.handleDecrement(product);
  };

  swipLeft = (product) => {
    const temp = this.state.products.map((item) => {
      if (
        item.id === product.id &&
        arrayEquals(item.selectedAttributes, product.selectedAttributes)
      ) {
        if (item.currImg === 0) {
          return { ...item, currImg: item.imgLength - 1 };
        }
        return { ...item, currImg: item.currImg - 1 };
      }
      return item;
    });

    this.setState({ products: temp });
  };

  swipRight = (product) => {
    const temp = this.state.products.map((item) => {
      if (
        item.id === product.id &&
        arrayEquals(item.selectedAttributes, product.selectedAttributes)
      ) {
        if (item.currImg === item.imgLength - 1) {
          return { ...item, currImg: 0 };
        }
        return { ...item, currImg: item.currImg + 1 };
      }
      return item;
    });

    this.setState({ products: temp });
  };

  render() {
    const products = this.props.cartItems;
    return (
      <main>
        <section className={styles.section}>
          <h1 className={styles.title}>Cart</h1>
          <ul>
            {products.map((product) => {
              const imgSrc = this.state.products.find(
                (item) =>
                  item.id === product.id &&
                  arrayEquals(
                    item.selectedAttributes,
                    product.selectedAttributes
                  )
              );

              console.log(imgSrc);

              const price = product.prices.filter(
                (price) => price.currency.symbol === this.props.selectedCurrency
              );

              return (
                <li className={styles.item} key={product.id}>
                  <div className={styles.product}>
                    <p className={styles.product__name}>{product.name}</p>
                    <p className={styles.product__brand}>{product.brand}</p>
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
                                      <p>
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

                  <div className={styles.wrapper}>
                    <div className={styles.counters}>
                      <button
                        type="button"
                        className={styles.counters__button}
                        onClick={() => this.increment(product)}
                      >
                        +
                      </button>
                      <span className={styles.counters__value}>
                        {product.amount}
                      </span>
                      <button
                        type="button"
                        className={styles.counters__button}
                        onClick={() => this.decrement(product)}
                      >
                        -
                      </button>
                    </div>

                    <div className={styles.gallery}>
                      <img
                        src={product.gallery[imgSrc.currImg]}
                        className={styles.gallery__image}
                        alt={product.name}
                        title={product.name}
                        width="141"
                        height="185"
                      />
                      <div
                        className={styles.swipper}
                        style={{
                          display: product.gallery[1] ? "block" : "none",
                        }}
                      >
                        <button onClick={() => this.swipLeft(product)}>
                          <RiArrowLeftSLine size={20} />
                        </button>
                        <button onClick={() => this.swipRight(product)}>
                          <RiArrowRightSLine size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className={styles.order}>
            <div className={styles.order_details}>
              <div className={styles.orderType}>
                <p>Tax 21%:</p>
                <p>Quantity:</p>
                <p>Total:</p>
              </div>
              <div className={styles.orderValue}>
                <p>
                  {`${this.props.selectedCurrency}${(
                    0.21 * this.props.total
                  ).toFixed(2)}`}
                </p>
                <p>{this.props.itemsCount}</p>
                <p>{`${this.props.selectedCurrency}${this.props.total.toFixed(
                  2
                )}`}</p>
              </div>
            </div>
            <button className={styles.add}>Order</button>
          </div>
        </section>
      </main>
    );
  }
}
