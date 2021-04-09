import React from "react";
import elasticlunr from "elasticlunr";
import get from "lodash.get";
import marked from "marked";

export const CreateIndex = (combinedNav) => {
	var index = elasticlunr(function() {
		this.addField("type");
		this.addField("headerName");
		this.addField("body");
		this.setRef("topic");
	});

	let docs = [];
	let promises = [];

	Object.keys(combinedNav).forEach((key) => {
		let navsObject = get(combinedNav, [key]);
		Object.keys(navsObject).forEach((navsKey) => {
			let subtopics = get(combinedNav, [key, navsKey, "subTopics"]);
			Object.keys(subtopics).forEach((subtopic) => {
				let filePath = get(combinedNav, [
					key,
					navsKey,
					"subTopics",
					subtopic,
					"file",
				]);
				let headerName = get(combinedNav, [
					key,
					navsKey,
					"subTopics",
					subtopic,
					"headerName",
				]);
				try {
					let section = require(`../content/${filePath}.md`);
					docs.push({
						topic: `${
							key === "docsNav" ? "/docs" : "/guides"
						}/${navsKey}/${subtopic}`,
						headerName: headerName,
						file: section,
						type: key,
					});					
				} catch (error) {
					; //should message support missing content
				}
				
			});
		});
	});

	docs.forEach(function(doc) {
		promises.push(
			fetch(doc.file)
				.then((response) => response.text())
				.then((text) => {
					doc["body"] = text;
					index.addDoc(doc);
				})
		);
	});

	return Promise.all(promises).then(() => {
		return index;
	});
};

export class Search extends React.Component {
	state = {};

	componentDidMount() {
		const params = new URLSearchParams(this.props.location.search);
		const docsNav = this.props.docsNav;
		const guidesNav = this.props.guidesNav;
		const combinedNav = { docsNav: docsNav, guidesNav: guidesNav };
		let searchValue = params.get("search");
		if (!searchValue) {
			searchValue = this.props.query;
		}
		let index = CreateIndex(combinedNav);

		index.then((idx) => {
			return this.displayResults(idx, searchValue);
		});
	}

	componentDidUpdate(prevProps, prevState) {
		let prevSearchValue = prevState.searchValue;
		const params = new URLSearchParams(this.props.location.search);
		let searchValue = params.get("search");
		if (!searchValue) {
			searchValue = this.props.query;
		}
		let index = this.state.index;
		

		if (prevSearchValue !== searchValue) {
			this.displayResults(index, searchValue);
		}
		
	}

	componentWillUnmount() {
		this.setState({ searchValue: null });
	}

	displayResults = (index, searchValue) => {
		const docsNav = this.props.docsNav;
		const guidesNav = this.props.guidesNav;
		const combinedNav = { docsNav: docsNav, guidesNav: guidesNav };
		if (searchValue && !index) {
			let index = new Promise((resolve) => resolve(CreateIndex(combinedNav)));
			index.then((idx) => this.getResults(idx, searchValue));
		} else if (searchValue && index) {
			this.getResults(index, searchValue);
		}
		return null;
	};

	getResults = (index, searchValue) => {
		let results = new Promise((resolve) =>
			resolve(index.search(searchValue, {}))
		);
		let displayResults = [];
		results.then((res) => {
			let len = res.length;
			for (let i = 0; i < len; i++) {
				let ref = get(res[i], "ref");
				let resultDetails = get(index, ["documentStore", "docs", ref]);
				let headerName = get(resultDetails, "headerName");
				let body = get(resultDetails, "body");
				body = marked(body.substr(0, 200));
				let html = document.createElement("div");
				html.innerHTML = body;
				displayResults.push({
					title: headerName,
					body: html.outerHTML,
					link: ref,
				});
			}
			this.setState({
				index: index,
				searchValue: searchValue,
				results: displayResults,
			});
		});
	};

	render() {
		const { results, searchValue } = this.state;

		return (
			<div>
				{results ? (
					<div>
						<div>Results for: {searchValue}</div>
						{results.map((res) => {
							return (
								<div
									className="search-results"
									key={res.title}
									onClick={() =>
										this.props.history.push({ pathname: `${res.link}` })
									}
								>
									<article dangerouslySetInnerHTML={{ __html: res.body }} />
								</div>
							);
						})}
					</div>
				) : (
					<div>Search for something, or click on a link!</div>
				)}
			</div>
		);
	}
}
