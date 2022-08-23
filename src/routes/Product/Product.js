import React, { Component } from "react";
import { graphql } from "@apollo/client/react/hoc";
import { gql } from "@apollo/client";

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
  graphql(
    gql`
      query GET_PRODUCT($productId: String!) {
        product(id: $productId) {
          id
          name
          inStock
          gallery
          description
          category
          attributes {
            id
            name
            type
            items {
              displayValue
              value
              id
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
          brand
        }
      }
    `,
    {
      options: (props) => ({
        variables: {
          productId: props.params.productId,
        },
        fetchPolicy: "network-only",
      }),
    }
  )(Product)
);
