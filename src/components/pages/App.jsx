import React, { lazy, Suspense } from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
// import importedComponent from 'react-imported-component';
import Movies from './Movies';
import Loading from '../Shared/Loading'

const Chat = lazy(() => import(/* webpackChunkName:'DynamicPage' */ './Chat'));
const AsyncNoMatch = lazy(() => import(/* webpackChunkName:'NoMatch' */ './NoMatch'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Movies} />
          <Route exact path="/chat" component={Chat} />
          <Route component={AsyncNoMatch} />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
