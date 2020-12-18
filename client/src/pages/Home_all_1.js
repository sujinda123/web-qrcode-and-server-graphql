import React from "react";
// import "./OrderUser.css";
import { Table, Spinner  } from "react-bootstrap";
import moment from 'moment';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const subscription = gql`
subscription{
  newProductUser{
    id
    name
    description
    price
    createdAt
	}
}
`;
const query = gql`
  query{
    user(id:"5ea71f8b796e2560d80facf6"){
      products{
        id
        name
        description
        price
        createdAt
      }
    }
  }
`;




const MessageItem = ({data}) => (<>
        {/* {console.log(data)} */}
        {/* <tr className={parseFloat(data.result) > 0 ? "table-success text-dark text-center" : '' || parseFloat(data.result) === 0 ? "table-primary text-dark text-center" : '' || parseFloat(data.result) < 0 ? "table-danger text-dark text-center" : '' || parseFloat(data.result) === 'NaN' ? "table-light text-dark text-center" : "table-light text-dark text-center"}>
          <td>{moment(data.createdAt).format('DD-MM-YYYY hh:mm:ss')}</td>
          <td>{data.asset} / ${data.money}</td>
          <td>{data.signal.toUpperCase()}</td>
          <td>{data.time} นาที</td>
          <td>{parseFloat(data.result) > 0 ? '+'+parseFloat(data.result): '' || parseFloat(data.result) === 0 ? parseFloat(data.result):'' || parseFloat(data.result) < 0 ? parseFloat(data.result):'' || data.result === 'NaN'  ? 'รอผลการซื้อขาย':'เกิดข้อผิดพลาด'}</td>
          <td>{data.name}</td>
        </tr> */}
        <tr className="table-success text-dark text-center">
          <td>{moment(data.createdAt).format('DD-MM-YYYY hh:mm:ss')}</td>
          <td></td>
          <td>{data.name.toUpperCase()}</td>
          <td>{data.description}</td>
          <td></td>
          <td>{data.price}</td>
        </tr>
        </>
)

const MessageListView = class extends React.Component {
  componentDidMount() {
    this.props.subscribeToMore();
  }
  render() {
    const { data } = this.props;
    // console.log(data)
    return (
    <div className="card-body">
      <div className="table-responsive" style={{maxHeight: "500px"}}>
      <Table className="table table-sm table-bordered table-hover" id="myTable">
          
          <tbody>
            {data.user.products.map((data,i) => <MessageItem key={i}  data={data}/>)}
          </tbody>
          <thead className="thead-dark text-center">
            <tr>
              <th>เวลา</th>
              <th>คู่เงิน / เงิน</th>
              <th>คาดการณ์</th>
              <th>เวลา</th>
              <th>ผลลัพธ์</th>
              <th>Signal</th>
            </tr>
          </thead>

        </Table>
      </div>
    </div>
    );
  }
}


const OrderUser = () => (
  <Query query={query}>
    {({ loading, error, data, subscribeToMore }:any) => {
      // console.log(data)
      if (loading) return <div className="loader"><Spinner animation="grow" variant="warning" /></div>;
      if (error) return <div className="loader error">Error!</div>;
      if (data.user === null) return <div className="loader error">Error!</div>;
      const more = () => subscribeToMore({
        document: subscription,
        updateQuery: (prev: { user: { products: any; }; }, { subscriptionData }: any) => {
          if (!subscriptionData.data) return prev;
          // console.log(subscriptionData.data)
          return {user:{
            products: [subscriptionData.data.newProductUser, ...prev.user.products], __typename: "User"
          }};
        },
      });
      // console.log(more)
      return <MessageListView data={data} subscribeToMore={more}/>;
    }}
  </Query>
);

export default OrderUser;
