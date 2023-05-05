import React from "react";
import { Redirect, Switch, Route, Router } from "react-router-dom";
import RouteGuard from "./components/RouteGuard"

//history
import { history } from './helpers/history';
 
//pages
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
 
function Routes() {
   return (
       <Router history={history}>
           <Switch>
               <RouteGuard
                   exact
                   path="/"
                   component={LoginPage}
               />
               <Route
                   path="/register"
                   component={RegisterPage}
               />
               <Redirect to="/" />
           </Switch>
       </Router>
   );
}
 
export default Routes