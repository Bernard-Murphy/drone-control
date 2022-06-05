import React from 'react';
import { io } from 'socket.io-client';

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      loaded: false,
      buttonsPressed: [],
      controllerLoop: '',
      commands: {
        ascend: false,
        descend: false,
        throttle: 0,
        roll: 0,
        yaw: 0,
        pitch: 0
      },
      socket: ''
    }
  }

  componentDidMount(){
    this.setState({
      ...this.state,
      socket: io('http://localhost:5043')
    }, () => {
      window.addEventListener('gamepadconnected', this.connectController);
      window.addEventListener('gamepaddisconnected', this.connectController);
      this.connectController();
    }); 
  }

  connectController = () => {
    const controller = window.navigator.getGamepads()[0];
    if (controller) this.setState({
      ...this.state,
      loaded: true,
      controllerLoop: setInterval(this.handleInputs, 200)
    });
    else this.setState({
      ...this.state,
      loaded: false,
      controllerLoop: ''
    }, () => clearInterval(this.state.controllerLoop));
  }

  handleInputs = () => {
    const controller = window.navigator.getGamepads()[0];
    if (controller) this.setState({
      ...this.state,
      commands: {
        ascend: controller.buttons[4].pressed,
        descend: controller.buttons[5].pressed,
        throttle: Math.round(controller.axes[1] * 1000),
        roll: Math.round(controller.axes[0] * 1000),
        yaw: Math.round(controller.axes[2] * 1000),
        pitch: Math.round(controller.axes[3] * 1000)
      }
    }, () => this.state.socket.emit('command', this.state.commands));
  }

  render(){
    return (
      <>
        <div className="h-100 d-flex flex-column">
          <h1 className="text-center display-6 mt-3">Drone Control</h1>
          <hr></hr>
          <div style={{flexGrow: 1}} className='container-fluid'>
            <div className="row h-100">
              <div className="col-3">
                <h5 className="text-center" style={{margin: 0}}>Throttle<span style={{opacity: 0, cursor: 'default'}}>Roll</span></h5>
                <div style={{width:'max-content'}} className="d-flex mx-auto"> 
                  <div className="sticks border border-dark">
                    <div style={{left: `${(5 + (5 * (this.state.commands.roll / 1000))) - 0.24}rem`, top: `${(5 + (5 * (this.state.commands.throttle / 1000))) - 0.24}rem`}} className="controller-dots bg-dark"></div>
                  </div>
                  <h5 style={{margin: 0}} className="align-self-center">Roll</h5>
                </div>
                <div className="mt-3 container-fluid">
                  <div className="row">
                    <div className="col-6">
                      <h5 className="text-center">Ascend</h5>
                      {this.state.commands.ascend ?
                      <img className="d-block mx-auto w-100" src="/left-bump-active.png"></img>:
                      <img className="d-block mx-auto w-100" src="/left-bump-inactive.png"></img>}
                    </div>
                    <div className="col-6">
                      <h5 className="text-center">Descend</h5>
                      {this.state.commands.descend ?
                      <img className="d-block mx-auto w-100" src="/right-bump-active.png"></img>:
                      <img className="d-block mx-auto w-100" src="/right-bump-inactive.png"></img>}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{height: '95%'}} className="col-6 bg-secondary"></div>
              <div className="col-3">
                <h5 className="text-center" style={{margin: 0}}>Yaw<span style={{opacity: 0, cursor: 'default'}}>Pitch</span></h5>
                <div style={{width:'max-content'}} className="d-flex mx-auto">
                  <div className="sticks border border-dark">
                    <div style={{left: `${(5 + (5 * (this.state.commands.yaw / 1000))) - 0.24}rem`, top: `${(5 + (5 * (this.state.commands.pitch / 1000))) - 0.24}rem`}} className="controller-dots bg-dark"></div>
                  </div>
                  <h5 style={{margin: 0}} className="align-self-center">Pitch</h5>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </>
    )
  }
}

export default App;