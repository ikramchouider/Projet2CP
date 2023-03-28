import './App.css';
import Nav from './components/Nav';
import Accueil from './components/Accueil';
import Aide from './components/Aide';
import Apropos from './components/Apropos';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom' ;

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <Nav />
                    <Switch>
                      <Route path="/" exact component ={index.js} />
                      <Route path="/" exact component={Accueil} />
                      <Route path="/Aide" exact components={Aide} />
                    </Switch>
                </header>
            </div>
        </Router>
    ) ;
}

export default App ;


