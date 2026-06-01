import Places from "./Places.jsx";

import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import useFetch from "../Hooks/useFetch.js";

  async function fetchSortedPlaces() {
    const placesSorted = await fetchAvailablePlaces();

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
          placesSorted,
          position.coords.latitude,
          position.coords.longitude,
        );
        resolve(sortedPlaces);
      });
    });
  }

export default function AvailablePlaces({ onSelectPlace }) {


  const { isFetching, error, fetchedData, setFetchedData } = useFetch(
    fetchSortedPlaces,
    [],
  );

  // useEffect(()=>{
  //   fetch("http://localhost:3000/places").then((response) => {
  //   return response.json();
  // }).then((resData)=>setAvailablePlaces(resData.places));

  if (error) {
    return <Error title={"An Error has occured!"} message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={fetchedData}
      isLoading={isFetching}
      loadingText="Fetching Data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
