import React, { Component } from "react";
import styles from "./Category.module.css";
import ProductsList from "../../components/ProductList/ProductsList.js";

export default class Category extends Component {
  componentDidMount() {
    document.title = "Category";
  }

  render() {
    const products = this.props.products;
    const categoryName = this.props.name;
    return (
      <main>
        <section className={styles.category}>
          {categoryName ? (
            <h1 className={styles.title}>{categoryName}</h1>
          ) : (
            <h1 className={styles.title}>{"all"}</h1>
          )}

          {products && (
            <ProductsList
              products={products}
              category={categoryName}
              handleAddToCart={this.props.handleAddToCart}
              selectedCurrency={this.props.selectedCurrency}
            />
          )}
        </section>
      </main>
    );
  }
}
