import React from "react";
import {
	ToggleButtonGroup,
	ToggleButton,
	Button,
	Form,
	FormGroup,
	ControlLabel,
	FormControl,
} from "react-bootstrap";
import get from "lodash.get";
import {
	fixSidebar,
	getTopicAndSubTopic,
	getNextTopic,
	getPreviousTopic,
} from "../actions/LoadTopics";
import { SidebarNav } from "../components/SidebarNav";
import marked from "marked";
import { Search } from "../actions/Search";
import Notifications, { notify } from "react-notify-toast";
import {
	getAPINav,
	getDocNav,
	getLibNav,
	getGuideNav,
	endpointMap,
	languageMap,
} from "../navs/nav";

import { parseJSON } from "../flureeFetch";
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/theme/xcode";
import { currentVersion } from "../index";

class Docs extends React.Component {
	state = {
		headers: [],
		headerLinks: [],
		languages: ["flureeql", "graphql", "curl"],
		language: "flureeql",
		fixedSidebar: false,
		displaySearch: false,
		searchValue: "",
		hashAnchor: this.props.location.hash || "",
		scrollElementId: "",
	};

	componentDidMount() {
		if (
			this.props.match.path === "/docs/search" ||
			this.props.match.path === "/guides/search"
		) {
			this.setState({ displaySearch: true });
			let query = this.props.location.search;
			let queryPattern = /\?search=/;
			if (queryPattern.test(query)) {
				let searchValue = new URLSearchParams(query).get("search");
				this.setState({ searchValue: searchValue });
			}
		} else {
			this.setState({ displaySearch: false });
		}

		const languages = languageMap[this.props.version];
		let nav;

		window.addEventListener("scroll", fixSidebar.bind(this));

		if (this.props.type === "docs") {
			nav = getDocNav(this.props.version);
		} else if (this.props.type === "api") {
			nav = getAPINav(this.props.version);
		} else if (this.props.type === "tools") {
			nav = getLibNav(this.props.version);
		} else if (this.props.type === "guides") {
			nav = getGuideNav(this.props.version);
		}
		let currentLanguage = localStorage.getItem("currentLanguage")
			? localStorage.getItem("currentLanguage")
			: "flureeql";

		this.setState(
			{ languages: languages, nav: nav, language: currentLanguage },
			() => this.getTopicAndLoad()
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.scrollElementId) {
			let element = document.body.querySelector(this.state.scrollElementId);
			window.scrollTo({
				top: window.scrollY + element.getBoundingClientRect().top,
				behavior: "smooth",
			});

			this.setState({ scrollElementId: null });
		}
		if (
			this.state.hashAnchor &&
			document.querySelector(this.state.hashAnchor)
		) {
			document.querySelector(this.state.hashAnchor).scrollIntoView();
			let currentLanguage = localStorage.getItem("currentLanguage");
			this.setState({ hashAnchor: "" });
		}
		if (
			(prevProps.match.path !== "/docs/search") &
				(this.props.match.path === "/docs/search") ||
			(prevProps.match.path !== "/guidess/search") &
				(this.props.match.path === "/guidess/search")
		) {
			this.setState({ displaySearch: true });
		}

		if (
			prevProps.match.params.topic !== this.props.match.params.topic ||
			prevProps.match.params.subtopic !== this.props.match.params.subtopic
		) {
			this.setState({ displaySearch: false });
			this.getTopicAndLoad(this.props);
		}
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.fixSideBar);
	}

	getTopicAndLoad = () => {
		const { nav } = this.state;
		if (
			this.props.match.path === "/docs/search" ||
			this.props.match.path === "/guides/search"
		) {
			this.setState({ displaySearch: true });
		} else {
			let promise = new Promise((resolve, reject) => {
				resolve(getTopicAndSubTopic(this.props, nav));
			});

			promise
				.then((resp) => {
					let [topic, subtopic] = resp;
					this.loadSection(topic, subtopic, nav);
				})
				.catch((resp) => {
					if (this.props.type === "docs") {
						this.loadSection("getting-started", "intro", nav);
					} else if (this.props.type === "api") {
						this.loadSection("intro", "intro", nav);
					} else if (this.props.type === "library") {
						this.loadSection("intro", "intro", nav);
					} else if (this.props.type === "guides") {
						this.loadSection("intro", "intro", nav);
					}
				});
		}
	};

	loadSection = (topic, subtopic, nav) => {
		let section;
		let found = true;
		let nextTopic;
		let previousTopic;
		let subTopics = get(nav, [topic, "subTopics"]);
		subtopic = subtopic ? subtopic : Object.keys(subTopics)[0];
		let fileName = get(subTopics, [subtopic, "file"]);

		try {
			section = require(`../content/${fileName}.md`);
		} catch {
			section = require(`../content/404.md`);
			found = false;
		}

		fetch(section)
			.then((response) => {
				return response.text();
			})
			.then((text) => {
				const { type } = this.props;
				let markdown = marked(text);
				let markedHTML = document.createElement("div");
				markedHTML.innerHTML = markdown;

				let h3s = markedHTML.getElementsByTagName("h3");
				let keys = Object.keys(h3s);

				let language = this.state.language;
				let html = this.loadLanguage(markedHTML, language);
				if (found) {
					nextTopic = getNextTopic(
						topic,
						subtopic,
						nav,
						type,
						this.props.version
					);
					previousTopic = getPreviousTopic(
						topic,
						subtopic,
						nav,
						type,
						this.props.version
					);
				}

				const headers = [];
				const headerLinks = [];
				keys.map((key) => {
					headers.push(h3s[key].innerText);
					headerLinks.push(h3s[key].id);
					return null;
				});
				this.setState(
					{
						text: text,
						markdown: html,
						nextTopic: nextTopic,
						previousTopic: previousTopic,
						topic: topic,
						subtopic: subtopic,
						headers: headers,
						headerLinks: headerLinks,
					},
					this.scrollToTop
				);
			});
	};

	setScrollElementId = () => {
		let elementId;
		document.querySelectorAll("h3").forEach((el) => {
			if (
				el.getBoundingClientRect().x &&
				el.getBoundingClientRect().bottom >= 0 &&
				!elementId
			) {
				elementId = `#${el.id}`;
			}
		});
		return elementId;
	};

	scrollToTop = () => {
		if (!this.state.hashAnchor) {
			window.scrollTo(0, 0);
		}
	};

	getHTML = () => {
		const markdown = this.state.markdown;
		let markedHTML = document.createElement("div");
		markedHTML.innerHTML = markdown;
		return markedHTML;
	};

	loadLanguage = (html, language) => {
		html = html ? html : this.getHTML();
		let codeSegments = html.getElementsByTagName("pre");
		for (let segment of codeSegments) {
			let code = segment.getElementsByTagName("code")[0];
			if (code.classList.contains(`language-${language}`)) {
				segment.style.display = "block";
			} else if (code.classList.contains(`language-all`)) {
				segment.style.display = "block";
			} else {
				segment.style.display = "none";
			}
		}
		return html.outerHTML;
	};

	changeLanguage = (html, language) => {
		localStorage.setItem("currentLanguage", language);
		html = this.loadLanguage(html, language);
		var languageText = {
			flureeql: "FlureeQL",
			graphql: "GraphQL",
			curl: "Curl",
			sparql: "SPARQL",
		};
		notify.show(
			`Coding Examples Now In ${languageText[language]}`,
			"success",
			1500
		);
		this.setState({
			language: language,
			markdown: html,
			scrollElementId: this.setScrollElementId(),
		});
	};

	render() {
		const {
			markdown,
			headers,
			headerLinks,
			topic,
			subtopic,
			language,
			languages,
			previousTopic,
			nextTopic,
			fixedSidebar,
			displaySearch,
			nav,
		} = this.state;
		const { version } = this.props;
		const guidesNav = getGuideNav(this.props.version);

		return (
			<div
				className="row"
				style={{
					marginBottom: "40px",
				}}
			>
				{this.props.type === "docs" && <Notifications />}
				<div
					className={
						this.props.type === "docs" ? "col-md-4 mt20 mb20" : "col-sm-3"
					}
				>
					<div className={fixedSidebar ? "fixedSidebar" : "sidebar"}>
						{this.props.type === "docs" && (
							<div>
								<p>Display Examples in:</p>
								<ToggleButtonGroup
									name="language"
									type="radio"
									value={language}
									onChange={(e) => this.changeLanguage(null, e)}
								>
									{languages.map((lang) => (
										<ToggleButton
											key={lang}
											style={{ fontVariant: "small-caps" }}
											value={lang}
										>
											{lang}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							</div>
						)}
						{nav && (
							<SidebarNav
								page={this.props.type}
								nav={nav}
								robust={false}
								chosenSubTopic={subtopic}
								chosenTopic={topic}
								headers={headers}
								headerLinks={headerLinks}
								version={version}
							/>
						)}
					</div>
				</div>
				<div
					className={
						this.props.type === "docs" || this.props.type === "library" || this.props.type === "guides"
							? "col-md-8 mb20"
							: "col-sm-6"
					}
					id="body-container"
				>
					{(this.props.type === "docs" || this.props.type === "guides") && (
						<div className="row">
							<div className="col-xs-6" />
							<div className="col-xs-6">
								<div
									className="mt10 pull-right"
									style={{ marginRight: "20px" }}
								>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											this.props.history.push(
												`/docs/search?search=${this.input.value}`
											);
										}}
									>
										<input
											type="text"
											ref={(searchTerm) => (this.input = searchTerm)}
											placeholder="Search Docs.."
											name="search"
										/>
										<button>
											<i className="fa fa-search" />
										</button>
									</form>
								</div>
							</div>
						</div>
					)}
					{this.props.type === "false" && (
						<div className="row">
							<div className="col-xs-6" />
							<div className="col-xs-6">
								<div
									className="mt10 pull-right"
									style={{ marginRight: "20px" }}
								>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											this.props.history.push(
												`/guides/search?search=${this.input.value}`
											);
										}}
									>
										<input
											type="text"
											ref={(searchTerm) => (this.input = searchTerm)}
											placeholder="Search Guides.."
											name="search"
										/>
										<button>
											<i className="fa fa-search" />
										</button>
									</form>
								</div>
							</div>
						</div>
					)}
					{this.state.nav && displaySearch ? (
						<Search
							{...this.props}
							query={this.state.searchValue}
							docsNav={nav}
							guidesNav={guidesNav}
						/>
					) : (
						<div>
							<article
								className="mb20 docs-section"
								style={{ minHeight: "400px", width: "95%" }}
								dangerouslySetInnerHTML={{ __html: markdown }}
							/>
							<div style={{ width: "85%" }}>
								{previousTopic ? (
									<Button
										onClick={() => this.props.history.push(previousTopic)}
										className="pull-left fluree-button"
									>
										Previous
									</Button>
								) : null}
								{nextTopic ? (
									<Button
										onClick={() => this.props.history.push(nextTopic)}
										className="pull-right fluree-button"
									>
										Next
									</Button>
								) : null}
							</div>
						</div>
					)}
				</div>
				{this.props.type === "api" && (
					<div className="col-sm-3">
						<div
						// style={fixedSidebar ? {position: "fixed", top: "20px", right: "20px", bottom: "20px", overflowY: "scroll"} : {paddingLeft: "20px"} }
						>
							{this.props.version !== "0.9.1" && (
								<APITest version={this.props.version} />
							)}
						</div>
					</div>
				)}
			</div>
		);
	}
}

class APITest extends React.Component {
	state = {
		host: "downloaded",
		ip: "http://localhost:8080",
		network: "test",
		endpoints: [],
		dbid: "one",
		endpoint: "query",
		results: "",
		account: "",
		token: "",
	};

	componentDidMount() {
		let endpoints = endpointMap[this.props.version] || [];
		this.setState({ endpoints: endpoints });
	}

	submitTransaction = () => {
		let header, url;
		let {
			host,
			token,
			account,
			endpoint,
			request,
			dbid,
			ip,
			network,
		} = this.state;
		if (host === "hosted") {
			let prefix = endpoint === "signin" ? "" : `db/${account}/${dbid}`;
			header = { "Content-Type": "application/json" };
			if (token) {
				header["Authorization"] = `Bearer ${token}`;
			}

			url = `https:db.flur.ee/api/${prefix}/${endpoint}`;
		} else {
			url = `${ip}/fdb/${network}/${dbid}/${endpoint}`;
			header = {};
		}

		fetch(url, {
			method: "POST",
			body: request,
			headers: header,
		})
			.then((res) => {
				return parseJSON(res);
			})
			.then((res) => {
				this.setState({ results: JSON.stringify(res.json, null, 2) });
			})
			.catch((err) => {
				this.setState({ results: JSON.stringify(err, null, 2) });
			});
	};

	render() {
		const {
			host,
			ip,
			network,
			dbid,
			account,
			token,
			request,
			results,
			endpoint,
			endpoints,
		} = this.state;
		return (
			<div
				className="mt20"
				style={{
					marginRight: "30px",
				}}
			>
				<div className="mb20">
					<h2>Test the Endpoints</h2>
					<Form onSubmit={(e) => e.preventDefault()}>
						<FormGroup controlId="host">
							<ToggleButtonGroup
								name="host"
								type="radio"
								value={this.state.host}
								onChange={(e) => this.setState({ host: e })}
							>
								{this.props.version === currentVersion && (
									<ToggleButton
										key="hosted"
										style={{ fontVariant: "small-caps" }}
										value="hosted"
									>
										Hosted
									</ToggleButton>
								)}
								<ToggleButton
									key="downloaded"
									style={{ fontVariant: "small-caps" }}
									value="downloaded"
									className="fluree-button"
								>
									Downloaded
								</ToggleButton>
							</ToggleButtonGroup>
						</FormGroup>
						<FormGroup controlId="endpoint">
							<ControlLabel>Endpoint</ControlLabel>
							<FormControl
								componentClass="select"
								placeholder=""
								value={endpoint}
								onChange={(e) => this.setState({ endpoint: e.target.value })}
							>
								{endpoints.map((ep) => (
									<option value={ep}>{ep}</option>
								))}
							</FormControl>
						</FormGroup>
						{host === "downloaded" ? (
							<div>
								<FormGroup controlId="ip">
									<ControlLabel>IP Address</ControlLabel>
									<FormControl
										type="text"
										placeholder="http://localhost:8080"
										value={ip}
										onChange={(e) => this.setState({ ip: e.target.value })}
									/>
								</FormGroup>
								<FormGroup controlId="network">
									<ControlLabel>Network</ControlLabel>
									<FormControl
										type="text"
										placeholder="dev"
										value={network}
										onChange={(e) => this.setState({ network: e.target.value })}
									/>
								</FormGroup>
								<FormGroup controlId="dbid">
									<ControlLabel>Ledger</ControlLabel>
									<FormControl
										type="text"
										placeholder="test"
										value={dbid}
										onChange={(e) => this.setState({ dbid: e.target.value })}
									/>
								</FormGroup>
							</div>
						) : (
							<div>
								{endpoint === "signin" ? null : (
									<div>
										<FormGroup controlId="Account">
											<ControlLabel>Account</ControlLabel>
											<FormControl
												type="text"
												placeholder="Account"
												value={account}
												onChange={(e) =>
													this.setState({ account: e.target.value })
												}
											/>
										</FormGroup>
										<FormGroup controlId="Database">
											<ControlLabel>Ledger</ControlLabel>
											<FormControl
												type="text"
												placeholder="Ledger"
												value={dbid}
												onChange={(e) =>
													this.setState({ dbid: e.target.value })
												}
											/>
										</FormGroup>
										<FormGroup controlId="Token">
											<ControlLabel>Token</ControlLabel>
											<FormControl
												type="text"
												placeholder="Token"
												value={token}
												onChange={(e) =>
													this.setState({ token: e.target.value })
												}
											/>
										</FormGroup>{" "}
									</div>
								)}
							</div>
						)}

						<FormGroup controlId="request">
							<ControlLabel>Request</ControlLabel>
							<AceEditor
								mode="json"
								theme="xcode"
								fontSize={14}
								showPrintMargin={true}
								showGutter={true}
								onChange={(e) => this.setState({ request: e })}
								width={"100%"}
								height={"300px"}
								highlightActiveLine={true}
								value={request}
								editorProps={{ $blockScrolling: true }}
								setOptions={{
									showLineNumbers: true,
									tabSize: 2,
								}}
							/>
						</FormGroup>
					</Form>
					<div className="text-right">
						<Button
							bsStyle="success"
							onClick={this.submitTransaction}
							className="fluree-button"
						>
							Submit
						</Button>
					</div>
				</div>
				<div className="mt20">
					<Form>
						<FormGroup controlId="results">
							<ControlLabel>Results</ControlLabel>
							<AceEditor
								mode="json"
								theme="xcode"
								fontSize={14}
								showPrintMargin={true}
								showGutter={true}
								width={"100%"}
								height={"300px"}
								highlightActiveLine={true}
								value={results}
								editorProps={{ $blockScrolling: true }}
								setOptions={{
									showLineNumbers: true,
									tabSize: 2,
								}}
							/>
						</FormGroup>
					</Form>
				</div>
			</div>
		);
	}
}

export default Docs;
