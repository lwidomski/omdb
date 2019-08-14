import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<Home />, document.getElementById('root'));


// ReactDOM.render(
//     <Provider store={store}>
//         <Router history={hashHistory}>
//             <Route path="/" component={AppComponent}>
//                 <IndexRoute component={Home}/>
//                 {/*<Route path="/movies" component={MovieListComponent}/>*/}
//                 {/*<Route path="/detail/:imdbID" component={MovieDetailComponent}/>*/}
//             </Route>
//         </Router>
//     </Provider>,
//     document.getElementById('app')
// );


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
