import { Link } from "react-router-dom";
import { memo } from "react";
function ProductCard({ id, name, price, image }) {
  return (
    <Link to={`/product/${id}`}>
      <div className="bg-amber-300  mb-4 p-4">
        <h2>{name}</h2>
        <h2>{price || 0}</h2>
        <h2>{image}</h2>
        <button>Add To Cart</button>
      </div>
      {console.log("render")}
    </Link>
  );
}

export default memo(ProductCard);
