import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";

const Splash = (props) => {
	const { version } = props;
	return (
		<div
			className="row text-center"
			style={{
				backgroundColor: "#fff",
				padding: "50px 0 50px 0",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<div style={{ paddingBottom: "20px", marginRight: "20px" }}>
				{/* , display:"flex", flexDirection: "column", justifyContent: "center" */}
				<h1
					className="color-success font-header"
					style={{
						fontSize: "36px",
						weight: "700",
						textAlign: "left",
						color: "#091133",
						marginBottom: "10px",
					}}
				>
					Fluree Docs
				</h1>
				<p
					className="font-paragraph"
					style={{
						color: "#091133",
						maxWidth: "350px",
						weight: "400",
						textAlign: "left",
						fontSize: "16px",
						marginTop: "15px",
					}}
				>
					Ready to dive deeper into Fluree? Here you'll find videos, docs,
					examples, and more to help you learn how to use Fluree for your
					business or project.
				</p>
				<div className="mt20" style={{ textAlign: "left" }}>
					<LinkContainer
						to={`/docs/${version}/getting-started`}
						style={{ margin: "2px", textAlign: "left" }}
					>
						<Button
							id="landingpage-button"
							style={{
								backgroundColor: "#4B56A5",
								borderRadius: "2px",
								fontFamily: "CooperHewitt",
								fontStyle: "normal",
								fontWeight: "bold",
								fontSize: "16px",
								textAlign: "left",
								color: "#fff",
							}}
						>
							Visit the Docs
						</Button>
					</LinkContainer>
				</div>
			</div>
			<div>
				<img
					style={{ height: "300px", marginLeft: "20px" }}
					alt="Fluree"
					src={require("../theme/assets/homepagegraphic.png")}
				/>
			</div>
		</div>
	);
};

const FPPanel = (props) => {
	const { version } = props;
	
	return (
		<div
			style={{
				marginTop: "30px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				marginBottom: "100px",
			}}
		>
			<h3
				className="color-success"
				style={{
					color: "#091133",
					textAlign: "center",
					weight: "600",
					fontSize: "36px",
					marginBottom: "20px",
				}}
			>
				Explore Fluree
			</h3>

			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					margin: "0 auto 0 auto",
					paddingBottom: "5em",
					width: "55%",
				}}
			>
				<div
					style={{
						backgroundColor: "white",

						padding: "8px",
						width: "150px",
						height: "140px",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
					}}
				>
					<i
						className="fas fa-book mb10"
						style={{ color: "#13C6FF", fontSize: "30px", textAlign: "center" }}
					/>
					<p style={{ color: "#091133", textAlign: "center" }}>Read the Docs</p>
					<LinkContainer
						to={`/docs/${version}/getting-started`}
						style={{
							marginTop: "auto",
							padding: "3px",
						}}
					>
						<Button bsStyle="success" className="learn-button">
							<i className="fas fa-book" style={{ fontSize: "0.9em" }} />
							&nbsp;&nbsp;Documentation
						</Button>
					</LinkContainer>
				</div>
				<div
					style={{
						backgroundColor: "white",
						padding: "7px",
						width: "150px",
						height: "140px",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
					}}
				>
					<i
						className="fas fa-video mb10"
						style={{ color: "#13C6FF", fontSize: "30px", textAlign: "center" }}
					/>
					<p
						style={{
							color: "#091133",
							textAlign: "center",
						}}
					>
						View Videos...
					</p>
					<LinkContainer
						to="/video"
						style={{
							marginTop: "auto",
							padding: "3px",
						}}
					>
						<Button
							bsStyle="success"
							className="learn-button"
							style={{
								backgroundColor: "#13C6FF",
							}}
						>
							<i className="fas fa-video" style={{ fontSize: "0.9em" }} />
							&nbsp;&nbsp;Videos
						</Button>
					</LinkContainer>
				</div>
				<div
					style={{
						backgroundColor: "white",

						padding: "7px",
						width: "150px",
						height: "140px",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						//backgroundColor: "white", width: "200px", height: "160px", paddingTop: "5px",  margin: "20px 30px"
					}}
				>
					<i
						className="fas fa-chalkboard-teacher mb10"
						style={{ color: "#13C6FF", fontSize: "30px", textAlign: "center" }}
					/>
					<p
						style={{
							color: "#091133",
							textAlign: "center",
						}}
					>
						And Guided Lessons
					</p>
					<LinkContainer
						to="/lesson"
						style={{
							marginTop: "auto",
							padding: "3px",
						}}
					>
						<Button bsStyle="success" className="learn-button">
							<i
								className="fas fa-chalkboard-teacher"
								style={{ fontSize: "0.9em" }}
							/>
							&nbsp;&nbsp;Lessons
						</Button>
					</LinkContainer>
				</div>
			</div>
		</div>
	);
};

const Landing = (props) => {
	const { version } = props;
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<Splash version={version} />
			{version !== "0.9.1" && <FPPanel version={version} />}
		</div>
	);
};

export default Landing;
