// frontend/src/App.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import * as spotActions from "./store/spot"
import Navigation from "./components/Navigation";
import SingleSpot from "./components/SingleSpot";
import SpotsContainer from "./components/SpotsContainer"

import {Modal} from "./context/Modal";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
    dispatch(spotActions.populateSpots());
  }, [dispatch]);




  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/" exact>
            <SpotsContainer />
          </Route>
          {/* <Route path="/signup">
            <Modal>
              <SignupFormPage />
            </Modal>
          </Route> */}
          <Route path="/spots/:spotId">
            <SingleSpot />
          </Route>
          <Route>
            <h1>RESOURCE NOT FOUND</h1>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
