import React, { Component } from "react";
import { graphql } from "@apollo/client/react/hoc";
import { getProduct } from "../../query/queries.js";
import withRouter from "../../util/withRouter.js";
import ProductPage from "../../components/ProductPage/ProductPage.js";
import styles from "./Product.module.css";

class Product extends Component {
  componentDidMount() {
    document.title = "Product";
  }
  render() {
    const { data } = this.props;
    return (
      <main className={styles.main}>
        {data.product && (
          <ProductPage
            product={data.product}
            handleAddToCart={this.props.handleAddToCart}
            selectedCurrency={this.props.selectedCurrency}
          />
        )}
      </main>
    );
  }
}

export default withRouter(
  graphql(getProduct, {
    options: (props) => ({
      variables: {
        productId: props.params.productId,
      },
      fetchPolicy: "network-only",
    }),
  })(Product)
);
