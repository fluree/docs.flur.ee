import React from "react";
import { Route } from "react-router";

export default (
	<Route>
		<Route path="/video/:version/:topic/:subtopic" />
		<Route path="/video/:version/:topic" />
		<Route path="/video" />
		<Route path="/lesson/:topic/:subtopic" />
		<Route path="/lesson/:topic" />
		<Route path="/lesson" />
		<Route path="/docs/search" />
		<Route path="/docs/:version/:topic/:subtopic" />
		<Route path="/docs/:version/:topic" />
		<Route path="/docs" />
		<Route path="/api/:version/:topic/:subtopic" />
		<Route path="/api/:version/:topic" />
		<Route path="/api" />
		<Route path="/tools/:version/:topic/:subtopic" />
		<Route path="/tools/:version/:topic" />
		<Route path="/tools" />
		<Route path="/guides/search" />
		<Route path="/guides/:version/:topic/:subtopic" />
		<Route path="/guides/:version/:topic" />
		<Route path="/guides" />
		<Route path="/help" />
		<Route path="/" />
	</Route>
);
