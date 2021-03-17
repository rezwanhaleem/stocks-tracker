import React from 'react';
import { confirmAlert } from 'react-confirm-alert';

import '../style/End.css';

class End extends React.Component {

    toggleLoad = (id) => {
        if ((this.props.daySetting !== id)){
            this.props.toggleLoad(id);
        }
    }

    upload = () => {
        if (this.props.dataLoaded) {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui'>
                            <h1 style={{ color: '#0F9D58' }}>All done?</h1>
                            <p> All your selected changes will be reflected on Google Sheets!</p>
                            <div className='alert-container'>
                                <button className="checkbox" style={{ color: '#0F9D58' }}
                                    onClick={() => {
                                        this.props.saveChanges(true);
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
        else {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='custom-ui'>
                            <h1 style={{ color: '#F4B400' }}>Data not been loaded</h1>
                            <p> To upload you must Load data at the start page and then make changes!</p>
                            <div className='alert-container'>
                                <button className="checkbox" style={{ color: '#F4B400' }}
                                    onClick={() => {
                                        this.props.changePage(0);
                                        onClose();
                                    }}>
                                    Go to Start
                                </button>
                                <button className="checkbox" onClick={onClose}>Cancel</button>
                            </div>
                        </div>
                    );
                }
            });
        }
    }

    renderRows() {
        return this.props.players.map((player, index) => {
            return (
                <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{player.name}</td>
                    <td className="discord">{player.discord}</td>
                    <td>{}</td>
                    <td className={"" + (this.props.daySetting === 0 ? "assigned" : "")}>{this.props.daySetting === 0 ? this.props.currentAssignment[index] : player.mon}</td>
                    <td className={"" + (this.props.daySetting === 1 ? "assigned" : "")}>{this.props.daySetting === 1 ? this.props.currentAssignment[index] : player.wed}</td>
                    <td className={"" + (this.props.daySetting === 2 ? "assigned" : "")}>{this.props.daySetting === 2 ? this.props.currentAssignment[index] : player.fri}</td>
                </tr>
            );
        });
    };

    render() {
        return (
            <div className="End container">
                <div className="upload">
                    <div className="price">
                        <h4><i className="fas fa-cloud-upload-alt"></i>Upload Changes</h4>
                    </div>
                    <div className="settings">
                        <h5>Which day(s) would you like to upload?</h5>
                        <div className="daySetting">
                            <div className={"day " + ((this.props.daySetting === 0 || this.props.loadID[0]) ? 'selected' : '')} onClick={() => this.toggleLoad(0)}>Mon</div>
                            <div className={"day " + ((this.props.daySetting === 1 || this.props.loadID[1]) ? 'selected' : '')} onClick={() => this.toggleLoad(1)}>Wed</div>
                            <div className={"day " + ((this.props.daySetting === 2 || this.props.loadID[2]) ? 'selected' : '')} onClick={() => this.toggleLoad(2)}>Fri</div>
                        </div>
                    </div>
                    <div className="finish">
                        <div className="next-page" onClick={this.upload}>
                            <div className={"icon-container " + this.props.uploading}>
                                <i className="fas fa-arrow-up" />Upload
                            </div>
                        </div>
                        <div className="next-page start-over" onClick={this.props.startOver}><i className="fas fa-undo" />Start Over</div>
                    </div>
                </div>
                <div className="svg-container">
                    <svg viewBox="0 0 100 15">
                        <path fill="#5161ce" d="M0 30 V12 Q30 17 55 12 T100 11 V30z" />
                    </svg>
                </div>
                <div className="table-container">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col"><i className="fas fa-user"></i>Name</th>
                                <th scope="col" className="discord"><i className="fab fa-discord"></i>Discord Tag</th>
                                <th scope="col"></th>
                                <th scope="col" className={"" + (this.props.daySetting === 0 ? "assigned" : "")}>Mon</th>
                                <th scope="col" className={"" + (this.props.daySetting === 1 ? "assigned" : "")}>Wed</th>
                                <th scope="col" className={"" + (this.props.daySetting === 2 ? "assigned" : "")}>Fri</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default End;