import React from "react";
import "./product.css";
import { Table, Col } from "react-bootstrap";

import gql from "graphql-tag";
import { useQuery,useSubscription } from "@apollo/react-hooks";

const GET_PRODUCTS = gql`
  {
    products {
      name
      description
      price
      createdAt
    }
  }
`;
const Subscrip_PRODUCTS = gql`
  subscription{
    newProductUser{
      id
      name
      description
      price
  }}
`;

const MessageListView = class extends React.Component {
  componentDidMount() {
      this.props.subscribeToMore();
  }
  render() {
      const { loading } = this.props; 
      const { data } = this.props;
      // console.log(data)
      return (
        <>
          {loading ? 'Loading...' : data.datausers.balance !== 'NaN' ? data.datausers.balance : 'ไม่พบข้อมูล'}
        </>
      );
  }
}
function Product({ onProductSelected }) {
  // const { loading, error, data } = useQuery(GET_PRODUCTS);
  // console.log(data);
  // if (loading) return "Loading...";
  // if (error) return `Error!`;
  const onlineUsersList = [];
  const { loading, error, data } = useSubscription(Subscrip_PRODUCTS);
  console.log(data);
  if (loading) return "Loading...";
  if (error) return `Error!`;
  if (data) {
    onlineUsersList = data.online_users.map(u => (
      <MessageListView key={u.id} user={u.user} />
    ));
  }

  return (
    <div className="container">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Name</th>
            <th>Discription</th>
            <th>Price</th>
            <th>CreateDate</th>
          </tr>
        </thead>
        <tbody>
          {/* {data.products.map(product => (
            <tr>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.createdAt}</td>
            </tr>
          ))} */}
        </tbody>
      </Table>
    </div>
  );
}

export default Product;
