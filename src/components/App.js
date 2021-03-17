import React from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Nav from './Nav';
import Start from './Start';
import TestHook from './TestHook';
import End from './End';
import Progress from './Progress';
import Carousel from './Carousel';
import DummyData from '../data/DummyData';
import '../style/App.css';

class App extends React.Component {
  state = {
    players: [],
    previous: 0,
    visible: 0,
    autoScroll: false,
    page: 0,
    spreadSheetId: '',
    daySetting: 1,
    day: ['Monday', 'Wednesday', 'Friday'],
    isReset: false,
    loading: '',
    uploading: '',
    currentAssignment: [],
    dataLoaded: false,
    loadID: [false, false, false],
    googleUrl: '',
    userName: ''
  };

  updateCurrentAssignment() {
    let assignment = [];
    this.state.players.map((player) => {
      switch (this.state.daySetting) {
        case 0:
          assignment.push(player.mon);
          break;
        case 1:
          assignment.push(player.wed);
          break;
        case 2:
          assignment.push(player.fri);
          break;
        default:
          assignment.push('');
          break;
      }
      this.setState({ currentAssignment: assignment });
      return 0;
    });
  }

  loadData = async () => {
    let res;

    this.setState({
      loading: 'fa-spin'
    }, async () => {
      try {
        res = await axios.get('/api/players', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        setTimeout(() => {
          this.setState({ players: res.data, loading: '', dataLoaded: true }, this.updateCurrentAssignment);
        }, 2000);
      }
      catch (err) {
        console.log('Connection Failed! :(.  ' + err);
        this.setState({ loading: '' });
      }
    });
  }

  selectPlayer = (index) => {
    if (index >= 0 && index < this.state.players.length)
      this.setState((state) => ({ previous: state.visible, visible: index }));
    else if (index >= this.state.players.length)
      this.handlePageChange(2);
  }

  toggleAutoScroll = () => {
    this.setState(prevState => ({ autoScroll: !prevState.autoScroll }));
  }

  handlePageChange = (page) => {
    this.setState({ page: page });
  }

  checkDaySettings() {
    if (this.state.player[0].mon === '') {
      this.setState({ daySetting: 0 }, this.updateCurrentAssignment);
    }
    else if (this.state.player[0].wed === '') {
      this.setState({ daySetting: 1 }, this.updateCurrentAssignment);
    }
    else if (this.state.player[0].fri === '') {
      this.setState({ daySetting: 2 }, this.updateCurrentAssignment);
    }
  }

  isAssigned(day) {
    if (day === 0) {
      if (this.state.player[0].mon === '')
        return false;
      else
        return true;
    }
    else if (day === 1) {
      if (this.state.player[0].wed === '')
        return false;
      else
        return true;
    }
    else if (day === 2) {
      if (this.state.player[0].fri === '')
        return false;
      else
        return true;
    }
  }

  changeDay = day => {
    if (day !== this.state.daySetting) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='custom-ui'>
              <h1>Are you sure?</h1>
              <p>You want to edit {this.state.day[day]}? You have unsaved changes!</p>
              <div className='alert-container'>
                <button className="checkbox"
                  onClick={() => {
                    this.saveChanges(false);
                    this.setState({ daySetting: day }, this.updateCurrentAssignment);
                    onClose();
                  }}>
                  Save changes
                </button>
                <button className="checkbox"
                  onClick={() => {
                    this.setState({ daySetting: day }, this.updateCurrentAssignment);
                    onClose();
                  }}>
                  Discard changes
                </button>
                <button className="checkbox" onClick={onClose}>Cancel</button>
              </div>
            </div>
          );
        }
      });
    }
  }

  resetDays = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1 style={{ color: '#DB4437' }}>Are you sure?</h1>
            <p>You want to reassign this ENTIRE week?</p>
            <div className='alert-container'>
              <button style={{ color: '#DB4437' }} className="checkbox"
                onClick={() => {
                  let temp = this.state.players.slice();
                  temp.map((player) => {
                    player.mon = "";
                    player.wed = "";
                    player.fri = "";
                    return 0;
                  });
                  this.setState({ isReset: true, players: temp });
                  onClose();
                }}>
                Yes
              </button>
              <button className="checkbox" onClick={onClose}>No</button>
            </div>
          </div>
        );
      }
    });
  }

  saveChanges = (upload) => {
    let temp = this.state.players.slice();
    let tempIsLoaded = this.state.loadID.slice();

    if (temp.length === 0) {
      return;
    }

    switch (this.state.daySetting) {
      case 0:
        temp.map((player, index) => {
          player.mon = this.state.currentAssignment[index];
          return 0;
        });
        break;
      case 1:
        temp.map((player, index) => {
          player.wed = this.state.currentAssignment[index];
          return 0;
        });
        break;
      case 2:
        temp.map((player, index) => {
          player.fri = this.state.currentAssignment[index];
          return 0;
        });
        break;
      default:
        break;
    }

    tempIsLoaded[this.state.daySetting] = true;
    this.setState({ players: temp, loadID: tempIsLoaded }, () => {
      if (upload) {
        this.upload();
      }
    });
  }

  toggleLoad = (id) => {
    let tempIsLoaded = this.state.loadID.slice();
    tempIsLoaded[id] = !tempIsLoaded[id];
    this.setState({ loadID: tempIsLoaded });
  }

  assignPlayer = (assignment, index) => {
    let tempAssign = this.state.currentAssignment.slice();

    if (tempAssign.length === 0) {
      return;
    }

    tempAssign[index] = assignment;

    this.setState({ currentAssignment: tempAssign });
  }

  upload = async () => {
    let res;

    this.setState({
      uploading: 'upwards'
    }, async () => {
      try {
        res = await axios.post('/api/upload', {
          players: JSON.stringify(this.state.players),
          config: JSON.stringify(this.state.loadID)
        });

        if (res.data.toString() === "Success") {
          confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-ui'>
                  <h1 style={{ color: '#0F9D58' }}>Changes Uploaded!</h1>
                  <p> Would you like to see the changes at your Google Sheets?</p>
                  <div className='alert-container'>
                    <button className="checkbox" style={{ color: '#0F9D58' }}
                      onClick={() => {
                        window.open("https://docs.google.com/spreadsheets/d/" + this.state.spreadSheetId + "/edit?usp=sharing", "_blank");
                        onClose();
                      }}>
                      Take me there!
                    </button>
                    <button className="checkbox" onClick={onClose}>No thanks</button>
                  </div>
                </div>
              );
            }
          });
        }

        setTimeout(() => {
          this.setState({ uploading: '' });
        }, 2000);
      }
      catch (err) {
        console.log('Connection Failed! :(.  ' + err);
        this.setState({ uploading: '' });
      }
    });
  }

  startOver = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1 style={{ color: '#DB4437' }}>Are you sure?</h1>
            <p> This will discard ALL changes and refresh the page!</p>
            <div className='alert-container'>
              <button className="checkbox" style={{ color: '#DB4437' }}
                onClick={() => {
                  window.removeEventListener("beforeunload", this.savePlayerState);
                  document.cookie = "appState=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  document.cookie = "spreadsheetId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  window.location.reload();
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

  signIn = () => {
    if (this.state.googleUrl !== "") {
      window.removeEventListener("beforeunload", this.savePlayerState);
      window.open(this.state.googleUrl, "_self");
    }
  }

  signOut = async () => {
    let res;

    try {
      res = await axios.post('/api/signout');
      document.cookie = "appState=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log(res);
    }
    catch (err) {
      console.log('Connection Failed! :(. ' + err);
    }
    finally {
      window.removeEventListener("beforeunload", this.savePlayerState);
      window.location.reload();
    }
  }

  init = async () => {
    let res;
    let twelveId = this.getCookie('twelveId');

    if (twelveId === "") {
      try {
        res = await axios.get('/api/init', {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        console.log(res);
      }
      catch (err) {
        console.log('Connection Failed! :(. ' + err);
      }
    }
    else {
    }
  }

  getCookie = cookiename => {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
  }

  savePlayerState = () => {
    // sessionStorage.setItem('appState', JSON.stringify(this.state));
    var now = new Date();
    now.setTime(now.getTime() + 1 * 3600 * 1000);
    document.cookie = "appState=" + JSON.stringify(this.state) + "; expires=" + now.toUTCString() + "; path=/; secure; samesite=strict";
  }

  componentDidUpdate(prevState) {
    if (this.state.player !== prevState.player) {
      this.checkDaySettings();
    }
  }

  componentDidMount() {
    this.init();

    window.addEventListener("beforeunload", this.savePlayerState);
    // let appState = JSON.parse(sessionStorage.getItem('appState'));    

    if (this.getCookie('appState') !== "") {
      let appState = JSON.parse(this.getCookie('appState'));
      
      if(appState.players.length > 0){
        this.setState({
          players: appState.players,
          currentAssignment: appState.currentAssignment,
          daySetting: appState.daySetting,
          isReset: appState.isReset,
          autoScroll: appState.autoScroll,
          page: appState.page,
          visible: appState.visible,
          dataLoaded: appState.dataLoaded,
          loadID: appState.loadID
        }, this.updateCurrentAssignment);
      }
      else{
        this.setState({ players: DummyData }, this.updateCurrentAssignment);
      }
    }
    else {
      this.setState({ players: DummyData }, this.updateCurrentAssignment);
    }

  }

  render() {
    const currentPage = {
      transform: "translateX(-" + (1 * this.state.page) + "00%)"
    };

    return (
      <div className="App">
        <Nav
          page={this.state.page}
          onPageChange={this.handlePageChange}
          googleUrl={this.state.googleUrl}
          userName={this.state.userName}
          signIn={this.signIn}
          signOut={this.signOut}
        />
        <div className="container">
          <div className="pages" style={currentPage}>
            <div className="page page-0">
              <Start
                changeDay={this.changeDay}
                resetDays={this.resetDays}
                daySetting={this.state.daySetting}
                spreadSheetId={this.state.spreadSheetId}
                autoScroll={this.state.autoScroll}
                toggleAutoScroll={this.toggleAutoScroll}
                loading={this.state.loading}
                loadData={this.loadData}
                changePage={this.handlePageChange}
              />
              <TestHook
              />
            </div>
            <div className="page page-1 container">
              <Progress
                page={this.state.page}
                players={this.state.players}
                points={this.state.players.length - 1}
                visible={this.state.visible}
                onPlayerSelect={this.selectPlayer}
              />
              <Carousel
                daySetting={this.state.daySetting}
                previous={this.state.previous}
                visible={this.state.visible}
                players={this.state.players}
                onPlayerChange={this.selectPlayer}
                autoScroll={this.state.autoScroll}
                isReset={this.state.isReset}
                assignPlayer={this.assignPlayer}
              />
            </div>
            <div className="page page-2">
              <End
                players={this.state.players}
                daySetting={this.state.daySetting}
                currentAssignment={this.state.currentAssignment}
                loadID={this.state.loadID}
                dataLoaded={this.state.dataLoaded}
                uploading={this.state.uploading}
                toggleLoad={this.toggleLoad}
                saveChanges={this.saveChanges}
                startOver={this.startOver}
                changePage={this.handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
