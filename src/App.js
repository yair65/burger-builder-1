import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Layout from './hoc/Layout/Layout';
import Orders from './containers/Orders/Orders'


function App() {

  return (
    <BrowserRouter>
      <div>
        <Layout>
          <Switch>
            <Route path='/orders' component={Orders} />
            <Route path='/checkout' component={Checkout} />
            <Route exact path='/' component={BurgerBuilder} />
          </Switch>


        </Layout>

      </div>
    </BrowserRouter>
  );
}

export default App;
