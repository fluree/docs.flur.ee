import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Lesson from './screens/Lesson';
import Docs from './screens/Docs';
import API from './screens/API';
import Help from './screens/Help';
import Landing from './screens/Landing';
import Video from './components/Video';
import PreviousVersion from './components/PreviousVersion';

import "./theme/bootstrap.css";
import "./theme/custom.css";
import "../node_modules/video-react/dist/video-react.css"; 

export const currentVersion = "0.9.5"

class Wrapper extends React.Component {

    componentDidMount(){
        let location = this.props.location.pathname
        this.props.history.push(location)
    }

    render() {
        return (
            <>
            <div className="container-fluid" style={{ height: "100%" }}>
                <div className="row">
                    <div className="col-xs-12" style={{ padding: "0px"}}>
                        <Header {...this.props} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12" style={{ padding: "0px"}}>
                        <Switch>
                            <Route path="/version/:version" component={PreviousVersion} />
                            <Route path="/video/:topic/:subtopic" component={Video} />
                            <Route path="/video/:topic" component={Video} />
                            <Route path="/video" component={Video} />
                            <Route path="/lesson/:topic/:subtopic" component={Lesson} />
                            <Route path="/lesson/:topic" component={Lesson} />
                            <Route path="/lesson" component={Lesson} />
                            <Route path="/docs/search"  component={Docs} />
                            <Route path="/docs/:topic/:subtopic" component={Docs} />
                            <Route path="/docs/:topic"  component={Docs} />
                            <Route path="/docs"  component={Docs} />
                            <Route path="/api/:topic/:subtopic" component={API}/>
                            <Route path="/api/:topic" component={API}/>
                            <Route path="/api" component={API}/>
                            <Route path="/help" component={Help} />
                            <Route path="/" component={Landing} />
                        </Switch>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
            </>
        )
    }
}


class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" component={Wrapper}/>
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
