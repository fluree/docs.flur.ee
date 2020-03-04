import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Lesson from './screens/Lesson';
import Docs from './screens/Docs';
import Help from './screens/Help';
import Landing from './components/Landing';
import Video from './screens/Video';


import "typeface-cooper-hewitt";
import "./theme/bootstrap.css";
import "./theme/custom.css";
import "../node_modules/video-react/dist/video-react.css"; 

export const versions = [ 
    "0.13.0", 
    "0.12.0",
    "0.11.0", "0.10.0", "0.9.1"]

export const currentVersion = "0.13.0"

class Wrapper extends React.Component {

    state = {
        version: currentVersion
    }

    componentDidMount(){
        let version = localStorage.getItem("fluree.doc.version");
        let newVersion = ( version && versions.includes(version)) ? version : currentVersion;
        if(version !== newVersion){
            localStorage.setItem("fluree.doc.version", newVersion)
        }
        this.setState({version: newVersion})
    }

    changeVersion= (version) => {
        localStorage.setItem("fluree.doc.version", version)
        this.setState({version: version})
    }

    render() {

        return (
            <>
            <div className="container-fluid" style={{ height: "100%"}}>
                <div className="row">
                    <div className="col-xs-12" style={{ padding: "0px"}}>
                        <Header {...this.props} version={this.state.version} changeVersion={this.changeVersion}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12" style={{ padding: "0px"}}>
                        <Switch>
                            <Route path="/video/:topic/:subtopic" component={(props) => <Video {...props} version={this.state.version} />}  />
                            <Route path="/video/:topic" component={(props) => <Video {...props} version={this.state.version} />}  />
                            <Route path="/video" component={(props) => <Video {...props} version={this.state.version} />} />
                            <Route path="/lesson/:topic/:subtopic" component={(props) => <Lesson {...props} version={this.state.version} />} />
                            <Route path="/lesson/:topic" component={(props) => <Lesson {...props} version={this.state.version} />} />
                            <Route path="/lesson" component={(props) => <Lesson {...props} version={this.state.version} />} />
                            <Route path="/docs/search" component={(props) => <Docs {...props} version={this.state.version} type="docs"/>}  />
                            <Route path="/docs/:topic/:subtopic" component={(props) => <Docs {...props} version={this.state.version} type="docs"/>} />
                            <Route path="/docs/:topic"  component={(props) => <Docs {...props} version={this.state.version} type="docs"/>} />
                            <Route path="/docs"  component={(props) => <Docs {...props} version={this.state.version} type="docs"/>} />
                            <Route path="/api/:topic/:subtopic" component={(props) => <Docs {...props} version={this.state.version} type="api"/>} />
                            <Route path="/api/:topic" component={(props) => <Docs {...props} version={this.state.version} type="api"/>} />
                            <Route path="/api" component={(props) => <Docs  {...props} version={this.state.version} type="api"/>} />
                            <Route path="/library/:topic/:subtopic" component={(props) => <Docs {...props} version={this.state.version} type="library"/>} />
                            <Route path="/library/:topic" component={(props) => <Docs {...props} version={this.state.version} type="library"/>} />
                            <Route path="/library" component={(props) => <Docs {...props} version={this.state.version} type="library"/>} />
                            <Route path="/help" component={Help} />
                            <Route path="/" component={(props) => <Landing {...props} version={this.state.version}/>}  />
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
