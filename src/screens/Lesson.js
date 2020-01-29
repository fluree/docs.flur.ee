import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import LessonContent from '../components/LessonContent';
import marked from 'marked';
import { getLessonNav } from '../navs/nav'

const LearnHomePage = (props) => {
    let { nav } = props;
    //console.log(nav)
    let headers = Object.keys(nav)
    //console.log(headers)

    let basics = headers.filter(header => nav[header]["class"] === "beginner");
     let intermediate = headers.filter(header => nav[header]["class"] === "intermediate")
      let examples = headers.filter(header => nav[header]["class"] === "example")
    
    return (
        <div className="text-center">
            <div className="row">
                <div className="col-xs-12">
                    <h2>Lessons</h2>
                </div>
            </div>
            <div className="row text-center">
                {
                    basics.map(header => <div className="col-md-3 col-sm-4 col-xs-6" key={header}>
                        <LinkContainer to={`/lesson/${header}/1`}>
                            <div className={`lesson-square ${nav[header]["class"]}`}>
                                <div className="lesson-square-icon">
                                    <i className={nav[header]["icon"]} />
                                </div>
                                <div className="lesson-square-header">
                                    {nav[header]["title"]}</div>
                                <div className="lesson-square-description">
                                    {nav[header]["description"]}</div>
                            </div>
                        </LinkContainer>
                    </div>)
                }
            </div>
            <div className="row text-center">
                {
                    intermediate.map(header => <div className="col-md-3 col-sm-4 col-xs-6" key={header}>
                        <LinkContainer to={`/lesson/${header}/1`}>
                            <div className={`lesson-square ${nav[header]["class"]}`}>
                                <div className="lesson-square-icon">
                                    <i className={nav[header]["icon"]} />
                                </div>
                                <div className="lesson-square-header">
                                    {nav[header]["title"]}</div>
                                <div className="lesson-square-description">
                                    {nav[header]["description"]}</div>
                            </div>
                        </LinkContainer>
                    </div>)
                }
            </div>
            <div className="row text-center examples-supplementary"
                style={{
                    paddingBottom: "150px"
                }}>
                {
                    examples.map(header => <div className="col-md-3 col-sm-4 col-xs-6" key={header}>
                        <LinkContainer to={`/lesson/${header}/1`}>
                            <div className={`lesson-square ${nav[header]["class"]}`}>
                                <div className="lesson-square-icon">
                                    <i className={nav[header]["icon"]} />
                                </div>
                                <div className="lesson-square-header">
                                    {nav[header]["title"]}</div>
                                <div className="lesson-square-description">
                                    {nav[header]["description"]}</div>
                            </div>
                        </LinkContainer>
                    </div>)
                }
            </div>

        </div>
    )
}


class Learn extends React.Component {
    state = {
        displayLesson: false
    }

    componentDidMount() {
        if (this.props.version !== "0.9.1") {
            this.setNavAndLoadLesson()
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.version !== "0.9.1" && this.props.version !== prevProps.version ) {
            this.setNavAndLoadLesson()
        }
    }

    setNavAndLoadLesson = () => {
        let nav = getLessonNav(this.props.version)
        let { topic, subtopic } = this.props.match.params

        if (topic === undefined) {
            this.setState({ nav: nav, displayLesson: false })
        } else {
            this.setState({ nav: nav, displayLesson: true }, () => this.loadLesson(topic, subtopic))
        }
    }

    getNextLesson(topic, nav){
        let topics = Object.keys(nav);
        let currentIdx = topics.indexOf(topic)
        let nextIdx = currentIdx + 1;
        let nextLesson = topics[nextIdx]
        if(nextLesson === undefined){
            return `/lesson`
        }
        return `/lesson/${nextLesson}/1`
    }

    loadLesson = (topic, subtopic) => {
        let { nav } = this.state;
        subtopic = subtopic === undefined || subtopic === "undefined" ? "1" : subtopic;
        let readmePath, solutions, solution, numLessons;
        numLessons = nav[topic]["numLessons"]
        let location = nav[topic]["location"]
        let fileName = location + "/" + subtopic

        try {
            readmePath = import(`../content/${fileName}.md`);
            solutions = import(`../content/${location}/solutions.js`);
        }
        catch (err) {
            this.setState({ displayLesson: false }, this.props.history.push("/lesson/"))
        }

        Promise.all([readmePath, solutions])
            .then(res => {
                let lesson = res[0]["default"];
                solution = res[1]["default"][subtopic]
                return fetch(lesson)
            })
            .then(response => {
                return response.text()
            })
            .then(text => {
                let prevPage = Number(subtopic) === 1 ? "/lesson" : `/lesson/${topic}/${Number(subtopic) - 1}`;
                let nextPage = (Number(subtopic) + 1 > numLessons) ? this.getNextLesson(topic, nav) : `/lesson/${topic}/${Number(subtopic) + 1}`;

                this.setState({
                    displayLesson: true, markdown: marked(text), solution: solution, nextPage: nextPage,
                    prevPage: prevPage, progress: Number(subtopic) / numLessons * 100
                })
            })
            .catch(err => console.log(err))
    }

    render() {
        const { displayLesson, markdown, solution, nav, nextPage, prevPage, progress } = this.state
        return (
            <>
                {
                    this.props.version === "0.9.1"
                        ?
                        <div style={{ margin: "50px" }} className="text-center">
                            <h1 className="color-success" style={{ fontVariant: "small-caps" }}>
                                There are no lessons for version 0.9.1
                    </h1>
                        </div>
                        :
                        <div className="mt20">
                            {
                                nav && !displayLesson &&
                                <LearnHomePage nav={nav} />
                            }
                            {
                                displayLesson &&
                                <LessonContent {...this.props} nextPage={nextPage}
                                    prevPage={prevPage} progress={progress}
                                    markdown={markdown} solution={solution} nav={nav} />

                            }
                        </div>
                }
            </>
        )
    }
}

export default Learn;