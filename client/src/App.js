import React, { useState, useEffect, useContext } from "react";

import { Switch, Route, Redirect } from "react-router";

import AuthContext from "./context/AuthContext/AuthContext";

import AppWrapper from "./components/AppWrapper";
import Grid from "./components/Grid";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Categories from "./pages/Categories/Categories";
import Category from "./pages/Category/Category";
import EventDetails from "./pages/EventDetails/EventDetails";
import Events from "./pages/Events/Events";
import Create from "./pages/Create/Create";
import Profile from "./pages/Profile/Profile";


function App() {

  const [renderApp, setRenderApp] = useState(false);

  const { user } = useContext(AuthContext);

  const authorized = user.id && user.token;

  useEffect(() => {

    window.addEventListener("load",function() {
        setTimeout(function(){
            // Hide the address bar:
            window.scrollTo(0, 1);
        }, 0);
    });

    const checkAuth = (() => {
      if(!authorized) {
        setRenderApp(true)
      };
    });

    checkAuth();

  }, [authorized]);

  return (
    <AppWrapper>
    {renderApp && <Grid>
      <Switch>
        <Route path="/login" exact>
          {!authorized ? <Login /> : <Redirect to="/"/>}
        </Route>
        <Route path="/register" exact>
          {!authorized ? <Register /> : <Redirect to="/"/>}
        </Route>
        <Route path="/" exact>
          <Redirect to="/sports"/>
        </Route>
        <Route path="/sports" exact>
          {authorized ? <Categories /> : <Redirect to="/login"/>}
        </Route>
        <Route path="/sports/:category" exact>
          {authorized ? <Category /> : <Redirect to="/login"/>}
        </Route>
        <Route path="/sports/:category/:eventId" exact>
          {authorized ? <EventDetails /> : <Redirect to="/login"/>}
        </Route>
        <Route path="/events">
          {authorized ? <Events /> : <Redirect to="/login"/>}
        </Route>
        <Route path="/create">
          {authorized ? <Create /> : <Redirect to="/login"/>}
        </Route>
        <Route path="/profile">
          {authorized ? <Profile /> : <Redirect to="/login"/>}
        </Route>
        <Route path="/">
          <Redirect to="/sports"/>
        </Route>
      </Switch>
    </Grid>}
    </AppWrapper>
  );
}

export default App;
