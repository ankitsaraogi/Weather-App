import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './main';
import WeatherList from './WeatherList/WeatherList';
import WeatherTimeline from './WeatherTimeline/WeatherTimeline';

function routes() {
    return (
      <div>
        <BrowserRouter>
          <Main>
            <Switch>
              <Route 
                component={WeatherTimeline}
                exact
                path="/city/:name" 
              />
              <Route 
                component={WeatherList} 
                exact 
                path="/" 
              />
            </Switch>
          </Main>
        </BrowserRouter>
      </div>
    );
}

export default routes;

