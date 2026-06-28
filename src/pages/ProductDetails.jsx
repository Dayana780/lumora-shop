import { useParams } from "react-router-dom"
import products from "../data/products";
function ProductDetails() {
    const { id } = useParams();
   const product = products.find((product) => product.id === id);
      if (!product) {
    return <h1>Product Not Found</h1>;
}
    return (
        <div>
      
            <img src={product.image} />
            <h1>{product.name}</h1>
            <h1>{product.price}</h1>
            <h1>{product.description}</h1>
        </div>
    )
}

export default ProductDetails
