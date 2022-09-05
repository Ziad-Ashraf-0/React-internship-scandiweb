import React, { Component } from "react";
import { graphql } from "@apollo/client/react/hoc";
import { getCategory } from "../../query/queries.js";
import styles from "./Category.module.css";
import ProductsList from "../../components/ProductList/ProductsList.js";

class Category extends Component {
  componentDidMount() {
    document.title = "Category";
  }

  render() {
    console.log(this.props);
    const { data } = this.props;

    const categoryName = this.props.name;
    return (
      <main>
        <section className={styles.category}>
          {categoryName ? (
            <h1 className={styles.title}>{categoryName}</h1>
          ) : (
            <h1 className={styles.title}>{"all"}</h1>
          )}

          {data.category && (
            <ProductsList
              products={data.category.products}
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

export default graphql(getCategory, {
  options: (props) => ({
    variables: {
      name: props.name,
    },
    fetchPolicy: "network-only",
  }),
})(Category);
