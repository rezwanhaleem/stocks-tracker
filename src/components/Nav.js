import React from 'react';
import { confirmAlert } from 'react-confirm-alert';

import '../style/Nav.css';

class Nav extends React.Component {
    state = {
        selected1: '',
        selected2: 'active',
        selected3: '',
        activeTop: 0,
        activeLeft: 0,
        activeHeight: 0,
        activeWidth: 0
    };

    constructor(props) {
        super(props);
        this.tab = [React.createRef(), React.createRef(), React.createRef()];
    }

    handleClick = (tabId) => {
        switch (tabId) {
            case 0:
                this.setState({ selected1: 'active', selected2: '', selected3: '' });
                break;
            case 1:
                this.setState({ selected1: '', selected2: 'active', selected3: '' });
                break;
            case 2:
                this.setState({ selected1: '', selected2: '', selected3: 'active' });
                break;
            default:
                break;
        }

        let targ = this.tab[tabId].current;
        this.setState({
            activeTop: targ.offsetTop,
            activeLeft: targ.offsetLeft,
            activeHeight: targ.offsetHeight + 1,
            activeWidth: targ.clientWidth
        });
        this.props.onPageChange(tabId);
    }

    signIn = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1 style={{ color: '#0F9D58' }}>Sign in with Google?</h1>
                        <p> This will discard ALL changes and take you to Google!</p>
                        <div className='alert-container'>
                            <button className="checkbox" style={{ color: '#0F9D58' }}
                                onClick={() => {
                                    this.props.signIn();
                                    onClose();
                                }}>
                                Yes
                            </button>
                            <button className="checkbox" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                );
            }
        });
    }

    signOut = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h1 style={{ color: '#DB4437' }}>Want to sign out?</h1>
                        <p> This will discard ALL changes and refresh the page!</p>
                        <div className='alert-container'>
                            <button className="checkbox" style={{ color: '#DB4437' }}
                                onClick={() => {
                                    this.props.signOut();
                                    onClose();
                                }}>
                                Yes
                            </button>
                            <button className="checkbox" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                );
            }
        });
    }

    renderLogin = () => {
        if (this.props.userName !== "") {
            return (
                <div className="nav-link google" onClick={this.signOut}><i className="fab fa-google"></i>{this.props.userName}</div>
            );
        }
        else {
            return (
                <div className="nav-link google" onClick={this.signIn}>Sign in with <i className="fab fa-google"></i></div>
            );
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.page !== prevProps.page) ||
            (this.props.googleUrl !== prevProps.googleUrl)) {
            this.handleClick(this.props.page);
        }
    }

    componentDidMount() {
        this.handleClick(this.props.page);
        setTimeout(() => { 
            this.handleClick(this.props.page);
        }, 3000);
    }

    render() {
        const horri = {
            top: this.state.activeTop + "px",
            left: this.state.activeLeft + "px",
            height: this.state.activeHeight + "px",
            width: this.state.activeWidth + "px"
        };
        return (
            <nav className="Nav navbar navbar-expand-lg navbar-mainbg">
                <div className="navbar-brand navbar-logo" ><i className="fas fa-coins"></i>Stocks Tracker</div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <div className="hori-selector" style={horri}><div className="left"></div><div className="right"></div></div>
                        <li ref={this.tab[0]} className={"nav-item " + this.state.selected1} onClick={(e) => this.handleClick(0)}>
                            <div className="nav-link" ><i className="fas fa-home"></i>Start</div>
                        </li>
                        <li ref={this.tab[1]} className={"nav-item " + this.state.selected2} onClick={(e) => this.handleClick(1)}>
                            <div className="nav-link" ><i className="fas fa-users"></i>Assign</div>
                        </li>
                        <li ref={this.tab[2]} className={"nav-item " + this.state.selected3} onClick={(e) => this.handleClick(2)}>
                            <div className="nav-link" ><i className="fas fa-file-upload"></i>Upload</div>
                        </li>
                        <li>
                            {this.renderLogin()}
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Nav;