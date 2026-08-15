import { useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1>Order Details</h1>

      <p>Order ID: {id}</p>
    </div>
  );
}

export default OrderDetails;
