import React from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Editor from './Editor';

const LessonContent = (props) => {
        const { solution, markdown, prevPage, nextPage, progress, version } = props;
        return (
            <>
                <div className="col-sm-10">
                    <div className="text-center mb20" style={{ width: "100%", backgroundColor: "lightgrey" }}><ProgressBar now={progress} /></div>
                </div>
                <div className="col-sm-2 text-center">
                    <LinkContainer to={"/lesson/"}>
                        <span className="lessons-home"><i className="fas fa-home" />&nbsp;<span className="hidden-xs hidden-sm">Lessons</span></span>
                    </LinkContainer>
                </div>
                <div className="col-sm-5 mb20">
                    <article className="mb20" style={{ minHeight: "400px" }} dangerouslySetInnerHTML={{ __html: markdown }}></article>
                    <div className="row">
                        <div className="col-sm-6 text-left">
                            {
                                prevPage && 
                                    <LinkContainer to={prevPage}>
                                        <Button>Previous</Button>
                                    </LinkContainer>
                            }
                        </div>
                        <div className="col-sm-6 text-right">
                            {
                                nextPage &&
                                <LinkContainer to={nextPage}>
                                    <Button>Next</Button>
                                </LinkContainer>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-sm-7">
                    <Editor solution={solution} />
                </div>
            </>
        )
}


export default LessonContent;