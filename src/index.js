import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Lesson from './screens/Lesson';
import Docs from './screens/Docs';
import API from './screens/API';
import Help from './screens/Help';
import Landing from './components/Landing';
import Video from './screens/Video';

import "./theme/bootstrap.css";
import "./theme/custom.css";
import "../node_modules/video-react/dist/video-react.css"; 

export const currentVersion = "0.9.5"

class Wrapper extends React.Component {

    state = {
        version: currentVersion
    }

    componentDidMount(){
        let version = localStorage.getItem("fluree.doc.version");
        version = version ? version : currentVersion;
        this.setState({version: version})
    }

    changeVersion= (version) => {
        localStorage.setItem("fluree.doc.version", version)
        this.setState({version: version})
    }

    render() {

        return (
            <>
            <div className="container-fluid" style={{ height: "100%" }}>
                <div className="row">
                    <div className="col-xs-12" style={{ padding: "0px"}}>
                        <Header {...this.props} version={this.state.version} changeVersion={this.changeVersion}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12" style={{ padding: "0px"}}>
                        <Switch>
                            <Route path="/video/:topic/:subtopic" component={(props) => <Video {...props} version={this.state.version} />}  />
                            <Route path="/video/:topic" component={(props) => <Video {...props}version={this.state.version} />}  />
                            <Route path="/video" component={(props) => <Video {...props} version={this.state.version} />} />
                            <Route path="/lesson/:topic/:subtopic" component={Lesson} />
                            <Route path="/lesson/:topic" component={Lesson} />
                            <Route path="/lesson" component={Lesson} />
                            <Route path="/docs/search"  component={Docs} />
                            <Route path="/docs/:topic/:subtopic" component={(props) => <Docs {...props} version={this.state.version} />} />
                            <Route path="/docs/:topic"  component={(props) => <Docs {...props} version={this.state.version} />} />
                            <Route path="/docs"  component={(props) => <Docs {...props} version={this.state.version} />} />
                            <Route path="/api/:topic/:subtopic" component={API}/>
                            <Route path="/api/:topic" component={API}/>
                            <Route path="/api" component={API}/>
                            <Route path="/help" component={Help} />
                            <Route path="/" component={(props) => <Landing {...props} version={this.state.version} />}  />
                        </Switch>
                    </div>
                </div>
            </div>
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
