import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Editor from './Editor';

const LessonContent = (props) => {
    const { solution, markdown, prevPage, nextPage } = props;
    return (
        <>
            {/* <div className="col-sm-10">
                    <div className="text-center mb20" style={{ width: "100%", backgroundColor: "lightgrey" }}><ProgressBar now={progress} /></div>
                </div> */}
            <div className="col-sm-12 mb20 mt20 text-center" style={{ width: "100%" }}>
                <LinkContainer to={"/lesson/"}>
                    <button className="lessons-home buttonPurple"><i className="fas fa-home" />&nbsp;<span className="hidden-xs hidden-sm">Lessons</span></button>
                </LinkContainer>
            </div>
            <div className="col-sm-5 mb20">
                <article className="mb20" style={{ minHeight: "400px" }} dangerouslySetInnerHTML={{ __html: markdown }}></article>
                <div className="row">
                    <div className="col-sm-6 text-left">
                        {
                            prevPage &&
                            <LinkContainer to={prevPage}>
                                <Button id="buttonPurplePrevious">Previous</Button>
                            </LinkContainer>
                        }
                    </div>
                    <div>

                    </div>
                    <div className="col-sm-6 text-right">
                        {
                            nextPage &&
                            <LinkContainer to={nextPage}>
                                <Button className="buttonPurple">Next</Button>
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