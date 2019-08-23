import React from 'react';
import get from 'lodash.get';
import { LinkContainer } from 'react-router-bootstrap';
import { HashLink as Link } from 'react-router-hash-link';

const SectionNav = (props) => {
    const { headers, headerLinks } = props
    return(
        <div className="third-level-nav">
            {headers && headerLinks
                ?
                headers.map((header, index) => <Link to={`#${headerLinks[index]}`} key={header} ><p>{header}</p></Link>)
            :
            null}
        </div>
    )
}

export function SidebarNav(props){
    let { nav, robust, page, chosenTopic, chosenSubTopic } = props
    let keys = Object.keys(nav)
    let headers = keys.map(key => get(nav[key], "pageName"))
    return (<div className="mt20">
        { keys.map((item, idx) => {
            let subTopicObj = get(nav, [ item, "subTopics"])
            let subTopics = Object.keys(subTopicObj)
            return( 
                <div key={item}>
                    <div className="top-level-nav">
                        <LinkContainer style={{fontWeight: 600, cursor: "pointer"}} to={`/${page}/${item}/${subTopics[0]}`}>
                        <div>
                            {headers[idx]}
                        </div>
                        </LinkContainer>
                    </div>
                    { subTopics.map(subtopic => {
                         if(chosenTopic === item && chosenSubTopic === subtopic){
                            return (<div className="second-level-nav chosen" key={subtopic}>
                                        <LinkContainer to={`/${page}/${item}/${subtopic}`}>
                                        <div>
                                            {get(subTopicObj, [subtopic, "headerName"])}
                                        </div>
                                        </LinkContainer>
                                        <SectionNav {...props} />
                                    </div>)
                        } else if (chosenTopic === item || robust === true) {
                            return(<div className="second-level-nav" key={subtopic}>
                                        <LinkContainer to={`/${page}/${item}/${subtopic}`}>
                                        <div>
                                            {get(subTopicObj, [subtopic, "headerName"])}
                                        </div>
                                        </LinkContainer>
                                    </div>
                            )
                        }
                        return null;
                    })}
                </div>
        )})}
    </div>
)}