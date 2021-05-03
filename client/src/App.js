import { Switch, Route } from "react-router-dom";
import { RestaurantContextProvider } from "./context/RestaurantsContext";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./routes/Home";
import RestaurantDetailPage from "./routes/RestaurantDetailPage";
import UpdatePage from "./routes/UpdatePage";

function App() {
  return (
    <RestaurantContextProvider>
      <Router>
        <div className="App container">
          <Switch>
            <Route path="/restaurants/:id/update" component={UpdatePage} />
            <Route path="/restaurants/:id" component={RestaurantDetailPage} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </RestaurantContextProvider>
  );
}

export default App;
