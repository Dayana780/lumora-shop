function AddProductButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
      bg-pink-500
      text-white
      px-4
      py-2
      rounded
      "
    >
      + Add Product
    </button>
  );
}

export default AddProductButton;
