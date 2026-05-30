import Places from "./Places.jsx";
import { useState, useEffect } from "react";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState();
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude,
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setErrorMsg({ message: error.message || "Please try to reload" });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);

  // useEffect(()=>{
  //   fetch("http://localhost:3000/places").then((response) => {
  //   return response.json();
  // }).then((resData)=>setAvailablePlaces(resData.places));

  if (errorMsg) {
    return <Error title={"An Error has occured!"} message={errorMsg.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching Data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
