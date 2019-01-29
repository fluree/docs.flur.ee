import React from 'react';
import { fixSidebar, PreviousSidebarNav } from './LoadTopics';
import marked from 'marked';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { currentVersion } from '../index';
import { languages } from '../screens/Docs';

class PreviousVersion extends React.Component {

    state = {
        headers: [],
        headerLinks: [],
        fixedSidebar: false,
        version: this.props.match.params.version,
        language: "flureeql",
        nav: {}
    }

    componentDidMount(){
        let version = this.props.match.params.version

        if(version === currentVersion){
            this.props.history.push("/")
        }
        window.addEventListener('scroll', fixSidebar.bind(this))
        this.loadDocs(version)
    }


    componentDidUpdate(nextProps){
        if(this.props.match.params.version !== nextProps.match.params.version){
            let version = nextProps.match.params.version;
            if(version === currentVersion){
                this.props.history.push("/")
            }
            this.loadDocs(version)
        }
    }

    componentWillUnmount(){
        window.removeEventListener('scroll', this.fixSideBar);
   }

   getHTML = () => {
        const markdown = this.state.markdown
        let markedHTML = document.createElement('div')
        markedHTML.innerHTML= markdown
        return markedHTML
    }

    loadDocs = (version) => {
        let versionFolder= version.split(".").join("")
        let file; 
        
        try {
            file = require(`../content/previousVersions/${versionFolder}/full.md`)
        } catch {
            file = require(`../content/docs/404.md`)     
        }
        
        fetch(file)
        .then(response => {
            return response.text()
        })
        .then(text => {
            let markdown = marked(text)
            let markedHTML = document.createElement('div')
            markedHTML.innerHTML= markdown

            let language = this.state.language
            let html = this.loadLanguage(markedHTML, language)
        
            let nav = this.loadNav(markedHTML)

        this.setState({text: text, markdown:html, nav: nav }, this.scrollToTop)
        return null
    })
    }

    loadNav = (html) => {
        let elements = html.childNodes;
        let nav = {};
        let h1Idx = -1;
        let h2Idx = -1;
        let h3Idx = -1;

        for(let i = 0; i < elements.length; i++){
            if(elements[i].nodeName === "H1"){
                h1Idx = h1Idx + 1;
                h2Idx = -1;
                nav[h1Idx] = 
                { 
                    "link": elements[i].id,
                    "headerName": elements[i].innerText,
                    "subTopics": {}
                }
            } else if (elements[i].nodeName === "H2"){
                h2Idx = h2Idx + 1;
                h3Idx = -1;
                nav[h1Idx]["subTopics"][h2Idx] = {
                    "link": elements[i].id,
                    "headerName": elements[i].innerText,
                    "subTopics": {}
                }
            } else if (elements[i].nodeName === "H3"){
                h3Idx = h3Idx + 1;
                nav[h1Idx]["subTopics"][h2Idx]["subTopics"][h3Idx] = {
                    "link": elements[i].id,
                    "headerName": elements[i].innerText
                }
            }
        }

        return nav
    }

    scrollToTop = () => {
        if (!this.props.location.hash) {
            window.scrollTo(0, 0)
        }
    }

    loadLanguage = (html, language) =>{
        html = html ? html : this.getHTML()
        let codeSegments = html.getElementsByTagName('pre')
        for(let segment of codeSegments){
            let code = segment.getElementsByTagName('code')[0]
            if(code.classList.contains(`language-${language}`)){
                segment.style.display = "block";
            } else if (code.classList.contains(`language-all`)){
                segment.style.display = "block";
            } else {
                segment.style.display = "none";
            }
        }
        return html.outerHTML
    }

    changeLanguage = (html, language) => {
        html = this.loadLanguage(html, language)
        this.setState({language: language, markdown: html})
    }
    
    render() {
        const { fixedSidebar, markdown, language, nav } = this.state;

        return (
            <div className="row">
                    <div className="col-md-4 mt20 mb20">
                        <div className={fixedSidebar ? "fixedSidebar" : "sidebar" }>
                            <div>
                                    <ToggleButtonGroup 
                                        name="language" 
                                        type="radio" 
                                        value={language}
                                        onChange={(e) => this.changeLanguage(null, e)}>
                                        { languages.map(lang => <ToggleButton key={lang} style={{fontVariant: "small-caps"}} value={lang}>{lang}</ToggleButton>)}
                                    </ToggleButtonGroup>
                                </div>
                            <PreviousSidebarNav {...this.props} nav={nav} robust={true} />
                        </div>
                    </div>
                <div className="col-md-8 mb20">
                    <article className="mt20 mb20 docs-section" style={{minHeight: "400px", width: "95%"}} dangerouslySetInnerHTML={{__html: markdown}}></article>
                </div>
            </div>
        )
    }
}

export default PreviousVersion;