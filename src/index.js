import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "typeface-cooper-hewitt";
import "../node_modules/video-react/dist/video-react.css";
import Header from "./components/Header";
import Landing from "./components/Landing";
import Docs from "./screens/Docs";
import Help from "./screens/Help";
import Lesson from "./screens/Lesson";
import Video from "./screens/Video";
import * as serviceWorker from "./serviceWorker";
import "./theme/bootstrap.css";
import "./theme/custom.css";


export const versions = [
	"1.0.0",
	"0.17.0",
	"0.16.0",
	"0.15.0",
	"0.14.0",
	"0.13.0",
	"0.12.0",
	"0.11.0",
	"0.10.0",
	"0.9.1",
];

export const currentVersion = "1.0.0";

class Wrapper extends React.Component {
	//let query = (boolean (get (query (str {"select": ["*"], "from":" (?sid) "}")) "person/fullName"))

	state = {
		version: currentVersion,
	};

	//     var mySubString = str.substring(
	//     str.lastIndexOf(":") + 1,
	//     str.lastIndexOf(";")
	// );

	componentDidMount() {
		let version = localStorage.getItem("fluree.doc.version");
		// let fullPathname = this.props.location.pathname;
		// let versionFromURL = fullPathname.substring(
		// 	fullPathname.indexOf("0"),
		// 	fullPathname.indexOf("0") + 6
		// );
		let newVersion =
			version && versions.includes(version) ? version : currentVersion;
		if (version !== newVersion) {
			localStorage.setItem("fluree.doc.version", newVersion);
		}
		this.setState({ version: newVersion });
	}

	changeVersion = (version) => {
		localStorage.setItem("fluree.doc.version", version);
		let fullPathname = this.props.location.pathname;
		let firstPosition = fullPathname.indexOf("/") + 1;
		let secondPosition = fullPathname.indexOf("/", firstPosition + 1);
		let section = fullPathname.substring(firstPosition, secondPosition);
		let newPathname = `/${section}/${version}`;
		this.setState({ version: version });
		this.props.history.push(newPathname);
	};

	render() {
		return (
			<>
				<div className="container-fluid" style={{ height: "100%" }}>
					<div className="row">
						<div className="col-xs-12" style={{ padding: "0px" }}>
							<Header
								{...this.props}
								version={this.state.version}
								changeVersion={this.changeVersion}
							/>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12" style={{ padding: "0px" }}>
							<Switch>
								<Route
									path="/video/:version/:topic/:subtopic"
									component={(props) => (
										<Video {...props} version={this.state.version} />
									)}
								/>
								<Route
									path="/video/:version/:topic"
									component={(props) => (
										<Video {...props} version={this.state.version} />
									)}
								/>
								<Route
									path="/video"
									component={(props) => (
										<Video {...props} version={this.state.version} />
									)}
								/>
								<Route
									path="/lesson/:topic/:subtopic"
									component={(props) => (
										<Lesson {...props} version={this.state.version} />
									)}
								/>
								<Route
									path="/lesson/:topic"
									component={(props) => (
										<Lesson {...props} version={this.state.version} />
									)}
								/>
								<Route
									path="/lesson"
									component={(props) => (
										<Lesson {...props} version={this.state.version} />
									)}
								/>
								<Route
									path="/docs/search"
									component={(props) => (
										<Docs {...props} version={this.state.version} type="docs" />
									)}
								/>
								<Route
									path="/docs/:version/:topic/:subtopic"
									component={(props) => (
										<Docs {...props} version={this.state.version} type="docs" />
									)}
								/>

								<Route
									path="/docs/:version/:topic"
									component={(props) => (
										<Docs {...props} version={this.state.version} type="docs" />
									)}
								/>
								{/* nb <Route path="/docs/:topic/:subtopic" component={(props) => <Docs {...props} version={this.state.version} type="docs"/>} /> */}
								{/* <Route path="/docs/:topic" component={(props) => <Docs {...props} version={this.state.version} type="docs"/>} /> */}

								<Route
									path="/docs"
									component={(props) => (
										<Docs {...props} version={this.state.version} type="docs" />
									)}
								/>
								<Route
									path="/api/:version/:topic/:subtopic"
									component={(props) => (
										<Docs {...props} version={this.state.version} type="api" />
									)}
								/>
								<Route
									path="/api/:version/:topic"
									component={(props) => (
										<Docs {...props} version={this.state.version} type="api" />
									)}
								/>
								<Route
									path="/api"
									component={(props) => (
										<Docs {...props} version={this.state.version} type="api" />
									)}
								/>
								<Route
									path="/tools/:version/:topic/:subtopic"
									component={(props) => (
										<Docs
											{...props}
											version={this.state.version}
											type="tools"
										/>
									)}
								/>
								<Route
									path="/tools/:version/:topic"
									component={(props) => (
										<Docs
											{...props}
											version={this.state.version}
											type="tools"
										/>
									)}
								/>
								<Route
									path="/tools"
									component={(props) => (
										<Docs
											{...props}
											version={this.state.version}
											type="tools"
										/>
									)}
								/>
								<Route
									path="/guides/search"
									component={(props) => (
										<Docs
											{...props}
											version={this.state.version}
											type="guides"
										/>
									)}
								/>

								<Route
									path="/guides/:version/:topic/:subtopic"
									component={(props) => (
										<Docs
											{...props}
											version={this.state.version}
											type="guides"
										/>
									)}
								/>
								<Route
									path="/guides/:version/:topic"
									component={(props) => (
										<Docs
											{...props}
											version={this.state.version}
											type="guides"
										/>
									)}
								/>
								<Route
									path="/guides"
									component={(props) => (
										<Docs
											{...props}
											version={this.state.version}
											type="guides"
										/>
									)}
								/>
								<Route path="/help" component={Help} />
								<Route
									path="/"
									component={(props) => (
										<Landing {...props} version={this.state.version} />
									)}
								/>
							</Switch>
						</div>
					</div>
				</div>
			</>
		);
	}
}

class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/" component={Wrapper} />
				</Switch>
			</Router>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
