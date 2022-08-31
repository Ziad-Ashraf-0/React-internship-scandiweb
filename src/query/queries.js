import { gql } from "@apollo/client";

const getProduct = gql`
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
`;

const getAllProducts = gql`
  query MyQuery1 {
    categories {
      name
      products {
        id
        name
        inStock
        gallery
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
  }
`;

const getCurrencies = gql`
  query MyQuery2 {
    currencies {
      label
      symbol
    }
  }
`;

const getCategory = gql`
  query getCategory($name: String!) {
    category(input: { title: $name }) {
      name
      products {
        id
        name
        inStock
        gallery
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
  }
`;

export { getProduct, getAllProducts, getCurrencies };
