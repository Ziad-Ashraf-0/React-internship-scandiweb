import React, { Component } from "react";
import parse from "html-react-parser";

import styles from "./ProductPage.module.css";

export default class ProductPage extends Component {
  state = {
    cover: "",
    attributes: [],
  };

  componentDidMount() {
    this.setState({ cover: this.props.product.gallery[0] });
  }

  handleCover = (event) => {
    this.setState({ cover: event.target.src });
  };

  handleAttributes = (id, item) => {
    if (this.state.attributes.some((e) => e.id === id)) {
      const temp = this.state.attributes.map((attribute) => {
        if (attribute.id === id) {
          return {
            ...attribute,
            displayValue: item.displayValue,
            value: item.value,
          };
        }
        return attribute;
      });
      this.setState(
        {
          attributes: temp,
        },
        () => console.log(this.state.attributes)
      );
    } else {
      this.setState({
        attributes: [
          ...this.state.attributes,
          { id, displayValue: item.displayValue, value: item.value },
        ],
      });
    }
  };

  renderGallery() {
    return (
      <div className={styles.gallery}>
        {this.renderThumbs()}
        {this.renderCover()}
      </div>
    );
  }

  renderThumbs() {
    const product = this.props.product;
    return (
      <div className={styles.gallery__thumbs}>
        {product.gallery.map((image) => {
          return (
            <img
              src={image}
              key={image}
              className={styles.gallery__thumb}
              alt={product.name}
              title={product.name}
              width="80"
              height="80"
              onClick={this.handleCover}
            />
          );
        })}
      </div>
    );
  }

  renderCover() {
    const product = this.props.product;
    return (
      <div className={styles.cover}>
        <img
          src={this.state.cover}
          className={styles.cover__image}
          alt={product.name}
          title={product.name}
        />
      </div>
    );
  }

  renderAddToCart() {
    const product = this.props.product;
    return (
      <button
        type="button"
        className={styles.add}
        onClick={() => {
          if (this.state.attributes.length === product.attributes.length) {
            this.props.handleAddToCart({
              ...product,
              selectedAttributes: this.state.attributes,
            });
          } else {
            alert("Select attributes pls");
          }
        }}
        disabled={!product.inStock}
      >
        {product.inStock ? "add to cart" : "Out of stock"}
      </button>
    );
  }

  renderPrice() {
    const product = this.props.product;
    const price = product.prices.filter(
      (price) => price.currency.symbol === this.props.selectedCurrency
    );

    return (
      <>
        <p className={styles.subtitle}>
          {product.inStock ? "price" : "last price"}:
        </p>
        <p className={styles.price}>{`${
          price[0].currency.symbol
        } ${price[0].amount.toFixed(2)}`}</p>
      </>
    );
  }

  renderDescription() {
    const product = this.props.product;
    return (
      <div className={styles.description}>{parse(product.description)}</div>
    );
  }

  renderAttributes() {
    const product = this.props.product;
    return product.attributes.length
      ? product.attributes.map((attributes) => {
          return (
            <div key={attributes.id}>
              <p className={styles.subtitle} key={attributes.id}>
                {attributes.name}:
              </p>

              <div className={styles.attributes}>
                {attributes.items.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={
                        this.state.attributes.some(
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
                          this.state.attributes.some(
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
                        onClick={() =>
                          this.handleAttributes(attributes.id, item)
                        }
                        style={{ backgroundColor: `${item.value}` }}
                        title={item.displayValue}
                      >
                        {attributes.id === "Color" ? "" : item.value}
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

  render() {
    const product = this.props.product;
    return (
      <article className={styles.product}>
        {this.renderGallery()}
        <aside className={styles.sidebar}>
          <h1 className={styles.title}>{product.brand}</h1>
          <h2 className={styles.brand}>{product.name}</h2>
          {this.renderAttributes()}
          {this.renderPrice()}
          {this.renderAddToCart()}
          {this.renderDescription()}
        </aside>
      </article>
    );
  }
}
