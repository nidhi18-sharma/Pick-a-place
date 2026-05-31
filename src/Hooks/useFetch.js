import { useEffect,useState } from "react";
export default function useFetch() {
  const [isFetching, setIsFetching] = useState();
  const [error, setError] = useState();
  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const places = await fetchFn();
        setFetchedData(places);
      } catch (error) {
        setError({
          message: error.message || "Unable to fetch Data",
        });
      }
      setIsFetching(false);
    }
    fetchData();
  }, [fetchFn]);
  return{
    isFetching,
    error,
    fetchedData

  }
}
