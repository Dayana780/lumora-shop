import { useEffect, useState } from "react";
function useFetch(url) {

const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    useEffect(() => {
    async function fetchData() {
      try {
           setLoading(true);
    setError(null);
        const res = await fetch(url);

       
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();

        setData(data);
        
      } catch (error) {
        setError(error.message);
        
      }
      finally{
setLoading(false);
      }
    }

    fetchData();
  }, [url]);

    return {
  data,
  loading,
  error,
};
}

export default useFetch
