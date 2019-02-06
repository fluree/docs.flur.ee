import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import LessonContent from '../components/LessonContent';
import marked from 'marked';
import get from 'lodash.get';
import { LessonAmount } from '../components/LessonContent';

class LearnHomePage extends React.Component {
    render() {
        return (
        <div className="text-center">
            <div className="row">
                <div className="col-xs-12">
                    <h2>Lessons</h2>
                </div>
            </div>
            <div className="row text-center">
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/bg-query/1">
                        <div className="lesson-square beginner">
                            <div className="lesson-square-icon">
                                <i className="fas fa-question-circle"/>
                            </div>
                            <div className="lesson-square-header">
                            Basics: Querying #1</div>
                            <div className="lesson-square-description">
                            Learn the basics of querying in FlureeQL.</div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                 <LinkContainer to="/lesson/bg-query2/1">
                        <div className="lesson-square beginner">
                            <div className="lesson-square-icon">
                                <i className="fas fa-question-circle"/>
                            </div>
                            <div className="lesson-square-header">
                            Basics: Querying #2</div>
                            <div className="lesson-square-description">
                            Learn about limits, where filters, blocks, and other basic query options.</div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/bg-schema/1">
                        <div className="lesson-square beginner">
                            <div className="lesson-square-icon">
                                <i className="far fa-building"/>
                            </div>
                            <div className="lesson-square-header">
                            Basics: Schema</div>
                            <div className="lesson-square-description">
                            Create your own collections and predicates with FlureeQL.</div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/bg-transact/1">
                        <div className="lesson-square beginner">
                            <div className="lesson-square-icon">
                                <i className="fas fa-wrench"/>
                            </div>
                            <div className="lesson-square-header">
                            Basics: Transacting</div>
                            <div className="lesson-square-description">
                            Add, update, and delete data with FlureeQL.</div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/bg-api/1">
                        <div className="lesson-square beginner">
                            <div className="lesson-square-icon">
                                <i className="fas fa-cogs"/>
                            </div>
                            <div className="lesson-square-header">
                            Basics: API</div>
                            <div className="lesson-square-description">
                            Make requests to API endpoints in Fluree.</div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/bg-infra/1">
                        <div className="lesson-square beginner">
                            <div className="lesson-square-icon">
                                <i className="fas fa-industry"/>
                            </div>
                            <div className="lesson-square-header">
                            Basics: Infrastructure</div>
                            <div className="lesson-square-description">
                           Understand flakes, triples, and general Fluree infrastructure.</div>
                        </div>
                    </LinkContainer>
                </div>
            </div>
            <div className="row text-center">
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/im-query/1">
                        <div className="lesson-square intermediate">
                            <div className="lesson-square-icon">
                                <i className="fas fa-question-circle"/>
                            </div>
                            <div className="lesson-square-header">
                            Intermediate: Query</div>
                            <div className="lesson-square-description">
                            Block, history, and analytical queries using FlureeQL. 
                            </div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">  
                    <LinkContainer to="/lesson/im-smart-functions/1">
                        <div className="lesson-square intermediate">
                            <div className="lesson-square-icon">
                                <i className="far fa-file-code"/>
                            </div>
                            <div className="lesson-square-header">
                            Intermediate: Smart Functions</div>
                            <div className="lesson-square-description">
                            Learn how smart functions work and create basic ones. 
                            </div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/im-permissions/1">
                        <div className="lesson-square intermediate">
                            <div className="lesson-square-icon">
                                <i className="far fa-file-code"/>
                            </div>
                            <div className="lesson-square-header">
                            Intermediate: Permissions</div>
                            <div className="lesson-square-description">
                            Learn how rules and permissions work in Fluree. 
                            </div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/im-cryptography/1">
                        <div className="lesson-square intermediate">
                            <div className="lesson-square-icon">
                                <i className="fas fa-key"/>
                            </div>
                            <div className="lesson-square-header">
                            Intermediate: Cryptography</div>
                            <div className="lesson-square-description">
                            Learn about the cryptography behind Fluree. 
                            </div>
                        </div>
                    </LinkContainer>
                </div>
            </div>
            <div className="row text-center">
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/supp-graphql/1">
                        <div className="lesson-square example">
                            <div className="lesson-square-icon">
                                <i className="fas fa-chart-pie"/>
                            </div>
                            <div className="lesson-square-header">
                            Supplementary: GraphQL</div>
                            <div className="lesson-square-description">
                            Query and transact in GraphQL. 
                            </div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/supp-sparql/1">
                        <div className="lesson-square example">
                            <div className="lesson-square-icon">
                                <i className="fas fa-chart-pie"/>
                            </div>
                            <div className="lesson-square-header">
                            Supplementary: SPARQL</div>
                            <div className="lesson-square-description">
                            Query in SPARQL.
                            </div>
                        </div>
                    </LinkContainer>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/ex-crypto/1">
                        <div className="lesson-square example">
                            <div className="lesson-square-icon">
                                <i className="fas fa-coins"/>
                            </div>
                            <div className="lesson-square-header">
                            Example: Cryptocurrency</div>
                            <div className="lesson-square-description">
                            Build your own (simple) cryptocurrency. 
                            </div>
                        </div>
                    </LinkContainer>
            </div>
            <div className="col-md-3 col-sm-4 col-xs-6">
                    <LinkContainer to="/lesson/ex-voting/1">
                        <div className="lesson-square example">
                            <div className="lesson-square-icon">
                                <i className="fas fa-person-booth"/>
                            </div>
                            <div className="lesson-square-header">
                            Example: Voting</div>
                            <div className="lesson-square-description">
                            Build your own voting mechanism.
                            </div>
                        </div>
                    </LinkContainer>
            </div> 
        </div> 
    </div>
    )}}


class Learn extends React.Component {
    state = {
        displayLesson: false
    }

    componentDidMount(){
        let { topic, subtopic}  = this.props.match.params
        if(topic === undefined){
            this.setState({displayLesson: false, topic: undefined, subtopic: undefined})
        } else {
            this.loadLesson(topic, subtopic)
        }
    }

    componentDidUpdate(prevProps, prevState){   
        let prevTopic = String(prevState.topic)
        let prevSubtopic = String(prevState.subtopic)
        let { topic, subtopic}  = this.props.match.params
        topic = String(topic);
        subtopic = String(subtopic);
        if((prevTopic !== topic) || (prevSubtopic !== subtopic)){
            if(topic === "undefined" || topic ===  undefined){
                this.setState({displayLesson: false,  topic: undefined, subtopic: undefined})
            } else {
                this.loadLesson(topic, subtopic)   
            }
        } else if (topic === "undefined" && this.state.displayLesson === true){
            this.setState({displayLesson: false})
        }
    }

    loadLesson = (topic, subtopic) => {
        subtopic = subtopic === undefined || subtopic === "undefined" ? "1": subtopic;
        let readmePath, solutions, solution, numLessons;
        numLessons = get(LessonAmount, topic)

        try{
            readmePath = require(`../content/lesson-modules/${topic}/${subtopic}.md`);
            solutions = require(`../content/lesson-modules/${topic}/solutions.js`);
            solutions = solutions.default;
            solution = get(solutions, subtopic)
        }
        catch(err){
            this.setState({displayLesson: false, subtopic: undefined, topic: undefined }, this.props.history.push("/lesson/"))
        }

        fetch(readmePath)
        .then(response => {
            return response.text()
        })
        .then(text => {
            this.setState({displayLesson: true, markdown: marked(text), numLessons: numLessons, subtopic: subtopic, topic: topic, solution: solution })
        })
        .catch(err => console.log(err))
    }
    
    render() {
       const { displayLesson, topic, subtopic, markdown, solution, numLessons } = this.state
        return(
            <div style={{marginTop: "20px"}}>
                { 
                    displayLesson
                    ?
                    <>
                    <LessonContent {...this.props} topic={topic} numLessons={numLessons} markdown={markdown} solution={solution} subtopic={subtopic}/>
                    </>
                    :
                    <LearnHomePage />
                }
            </div>
        )
    }
}

export default Learn;