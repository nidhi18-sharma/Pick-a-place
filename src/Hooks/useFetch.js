import { useEffect } from "react";

function useFetch(){
    useEffect(() => {
        async function fetchUserSavedPlaces() {
          setIsFetching(true);
          try {
            const places = await fetchUserPlaces();
            setUserPlaces(places);
          } catch (error) {
            setErrorUserPlaces({
              message: error.message || "Unable to fetch Saved Places",
            });
          }
          setIsFetching(false);
        }
        fetchUserSavedPlaces();
      }, []);
}