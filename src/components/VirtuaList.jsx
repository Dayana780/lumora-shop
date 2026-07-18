import { useState } from "react";
import products from "../data/products";

function VirtuaList() {
  const itemHeight = 100;
  const containerHeight = 500;
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = startIndex + visibleCount;
  const visibleItem = products.slice(startIndex, endIndex);
  function handleScroll(e) {
    setScrollTop(e.target.scrollTop);
  }
  return (
    <div
      style={{ height: products.length * itemHeight, overflow: "auto" }}
      onScroll={handleScroll}
    ></div>
  );
}

export default VirtuaList;
