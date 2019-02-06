import React from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Editor from './Editor';

export const LessonAmount = {
    "bg-query": 10,
    "bg-query2": 6,
    "bg-schema": 7,
    "bg-transact": 9,
    "bg-api": 6,
    "bg-infra": 7,
    "im-query": 10,
    "im-smart-functions": 11,
    "im-permissions": 5,
    "im-cryptography": 5,
    "supp-graphql": 11,
    "supp-sparql": 10,
    "ex-crypto": 11,
    "ex-voting": 15
}

class LessonContent extends React.Component {

    getNextTopic= () => {
        const { topic} = this.props;
        let lessons = Object.keys(LessonAmount);
        let currentIdx = lessons.indexOf(topic)
        let nextIdx = currentIdx + 1;
        let nextLesson = lessons[nextIdx]
        if(nextLesson === undefined){
            return `/lesson`
        }
        return `/lesson/${nextLesson}/1`
    }
    
    render() {
        const { markdown, subtopic, topic, solution, numLessons } = this.props;
        let nextPageNum = Number(subtopic) + 1
        const nextPage = nextPageNum > numLessons ? this.getNextTopic() : `/lesson/${topic}/` + nextPageNum
        
        let prevPageNum = Number(subtopic) - 1;
        const prevPage = `/lesson/${topic}/` + prevPageNum
        let progress = subtopic/numLessons * 100

        return (
            <>
                <div className="col-sm-10">
                     <div className="text-center mb20" style={{width: "100%", backgroundColor: "lightgrey"}}><ProgressBar now={progress}/></div>
                </div>
                <div className="col-sm-2 text-center">
                    <LinkContainer to={"/lesson/"}>
                        <span className="lessons-home"><i className="fas fa-home"/>&nbsp;<span className="hidden-xs hidden-sm">Lessons</span></span>
                    </LinkContainer>
                </div>
                <div className="col-sm-5 mb20">
                    <article className="mb20" style={{minHeight: "400px"}} dangerouslySetInnerHTML={{__html: markdown}}></article>
                    <div className="row">
                        <div className="col-sm-6 text-left">
                        {
                            prevPageNum === 0
                            ?
                            null
                            :
                            <LinkContainer to={prevPage}>
                                <Button>Previous</Button>
                            </LinkContainer>
                        }
                        </div>
                        <div className="col-sm-6 text-right">
                            <LinkContainer to={nextPage}>
                                <Button>Next</Button>
                            </LinkContainer>
                        </div>
                    </div>
                </div>
                <div className="col-sm-7">
                    <Editor solution={solution}/>
                </div>
            </>
        )
    }
}

export default LessonContent;