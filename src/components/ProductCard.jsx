function ProductCard({name , price , image}) {
    return (
        <div className="bg-amber-300  mb-4 p-4">
             <h2>{name}</h2>
            <h2>{price || 0}</h2>
            <h2>{image}</h2>
            <button>Add To Cart</button>
        </div>
    )
}

export default ProductCard
