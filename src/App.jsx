import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import { updatePlaces, fetchUserPlaces } from "./http.js";
import Error from "./components/Error.jsx";

function App() {
  const selectedPlace = useRef();

  const [userPlaces, setUserPlaces] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [errorUpdatingPlace, setErrorUpdatingPlace] = useState();

  const [errorUserPlaces, setErrorUserPlaces] = useState();

  const [isFetching, setIsFetching] = useState();    
  
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

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updatePlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlace({
        message: error.message || "Error while Updating Places",
      });
    }
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id,
        ),
      );
      try {
        await updatePlaces(
          userPlaces.filter((place) => place.id !== selectedPlace.current.id),
        );
      } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdatingPlace({
          message: error.message || "Error while Deleting",
        });
      }

      setModalIsOpen(false);
    },
    [userPlaces],
  );

  function onUpdatingError() {
    setErrorUpdatingPlace(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlace} onClose={onUpdatingError}>
        {errorUpdatingPlace && (
          <Error
            title={"An Error has occured"}
            message={errorUpdatingPlace.message}
            onConfirm={onUpdatingError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {errorUserPlaces && <Error  title={"An Error has occured!"} message={errorUserPlaces.message}/>}
        {!errorUserPlaces && <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
          isLoading={isFetching}
          loadingText="fetching your saved places"
        />}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
