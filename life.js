/** @jsx React.DOM */
(function() {
  var Cell = React.createClass({
    handleCellClicked: function() {
      this.props.handleCellClicked(this.props.row, this.props.col);
    },

    render: function() {
      var dim = this.props.dim;
      return (
        <rect
        width={dim} height={dim} fill={this.props.fill}
        stroke='black' strokeWidth='1'
        x={dim*this.props.col} y={dim*this.props.row}
        onClick={this.handleCellClicked}>
        </rect>
      );
    }
  });

  var Board = React.createClass({
    time: new Date().getTime(),
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      var state = {
        custom:false,
        running:false,
        rows:50,
        cols:50,
        fps:1000,
        
        birth1:false,
        birth2:false,
        birth3:true,
        birth4:false,
        birth5:false,
        birth6:false,
        birth7:false,
        birth8:false,

        survival1:false,
        survival2:true,
        survival3:true,
        survival4:false,
        survival5:false,
        survival6:false,
        survival7:false,
        survival8:false
      };

      for (var row = 0 ; row < state.rows ; row ++ ) {
        for (var col = 0 ; col < state.cols; col ++ ) {
          state[[row,col]] = Math.round(Math.random());
        }
      };

      return state;
    },

    render: function() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      var boardWidth;
      var boardHeight;

      var ratio = (width * 2/3 - 40) / (height - 40);
      var boardRatio = this.state.cols / this.state.rows;

      if (ratio > boardRatio) {
        boardHeight = height - 40;
        boardWidth = boardHeight * (this.state.cols / this.state.rows)
      } else if (ratio < boardRatio) {
        boardWidth = (width * 2 / 3) - 40;
        boardHeight = boardWidth * (this.state.rows / this.state.cols)
      } else {
        boardWidth = width * 2/3 - 40;
        boardHeight = height - 40;
      }

      var gameStyle = {
        width:width,
        height:height,
        position:"absolute",
        top:"0px",
        left:"0px",
        fontFamily:'Arial',
        fontSize:'10pt'
      }

      var controlStyle = {
        width:width / 3 - 20,
        height:height - 20,
        position:'absolute',
        top:'20px',
        left:'20px',
      }

      var svgStyle = {
        width: boardWidth,
        height: boardHeight,
        position:'absolute',
        top:'20px',
        left:(width / 3 + 20) + "px",
        background:'yellow'
      }

      var rangeStyle = {
        height:'9px'
      }

      var cellLength = Math.min(boardWidth, boardHeight) / Math.min(this.state.rows, this.state.cols);

      var a = [];
      for (var row=0; row<this.state.rows; row++) {
        for (var col=0; col<this.state.cols; col++) {
          a.push(<Cell
                 dim={cellLength} col={col} row={row}
                 key={row + ',' + col}
                 fill={this.state[[row,col]] ? 'black': 'white'}
                 handleCellClicked={this.handleCellClicked}
                 />);
        }
      }

      var checkboxStyle = {
        marginRight:'10px'
      }
      var b = [];
      for (var i = 1 ; i < 9 ; i ++ ){
        b.push(<label style={checkboxStyle}><input type='checkbox' data-rule={'birth' + i} checked={this.state["birth" + i]} onChange={this.handleChecked}/>{i}</label>)
      }

      var s = [];
      for (var i = 1 ; i < 9 ; i ++ ){
        s.push(<label style={checkboxStyle}><input type='checkbox' data-rule={'survival' + i} checked={this.state["survival" + i]} onChange={this.handleChecked}/>{i}</label>)
      }

      var startStyle = {
        background:'#16C725',
        borderRadius:'99px',
        margin:'0px 0px 0px 10px',
        width: 30,
        height: 30,
        lineHeight:'30px',
      };

      if (this.state.running) {
        startStyle.background = '#D13838';
      }

      var coverStyle = {
        display:'none',
        position:'absolute',
        top:0,
        left:0,
        width:width,
        height:height,
        background:'white',
        opacity:0.90
      };

      if (this.state.custom) {
        coverStyle.display = 'block';
      };

      var inputStyle = {
        position:'absolute',
        width: width * 2/3,
        height: height - 100,
        top:20,
        left:width * 1 / 6
      };

      var submitStyle = {
        position:'absolute',
        background:'#3B3B3B',
        top: height - 100 + 20,
        left:width * 1 / 6,
      };

      var cancelStyle = {
        position:'absolute',
        background:'#D13838',
        top: height - 100 + 20,
        left:width * 1 / 6 + 110,
      };

      var defaultPattern = '........................O\n......................O.O\n............OO......OO............OO\n...........O...O....OO............OO\nOO........O.....O...OO\nOO........O...O.OO....O.O\n..........O.....O.......O\n...........O...O\n............OO';

      return (
        <div id="game" style={gameStyle}>
          <div id="control" style = {controlStyle}>
            <h1>Game of Life (react.js)</h1>
            <h3> Instructions </h3>
            <ul>
              <li>Clicking on the individual cells toggles them on and off.</li>
              <li>Click start/stop button to start/stop the simulation.</li>
              <li>Change the number of rows and columns using provided sliders.</li>
              <li>Change the birth and survival rules using the provided checkboxes.</li>
              <li>The number next to the birth/survival checkboxes indicate the number of neighbors required for birth of a new cell or survival of an existing cell.</li>
            </ul>
            <h3> Settings </h3>
            <p>
              Number of Rows: <input id="rows" style={rangeStyle} type="range" min="1" max="100" valueLink={this.linkState('rows')}/> {this.state.rows}
            </p>
            <p>
              Number of Columns: <input id="cols" style={rangeStyle} type="range" min="1" max="100" valueLink={this.linkState('cols')}/> {this.state.cols}
            </p>
            <p>
              Birth rule: {b}
            </p>
            <p>
              Survival rule: {s}
            </p>
              <div id="blank" className="button" onClick={this.blank}>blank</div>
              <div id="randomize" className="button" onClick={this.randomize}>randomize</div>
              <div id="custom" className="button" onClick={this.handleCustom}>custom</div>
              <div id="startButton" className="button" style={startStyle} onClick={this.handleToggle}>{this.state.running ? 'Stop' : 'Start'}</div>
          </div>
          <svg style = {svgStyle}>
            {a}
          </svg>
          <div id="cover" style={coverStyle}>
            <textarea id="pattern" value={defaultPattern} style={inputStyle}/>
            <div className="button" style={submitStyle} onClick={this.handleSubmit}>Submit</div>
            <div className="button" style={cancelStyle} onClick={this.handleCancel}>Cancel</div>
          </div>
        </div>
      )
    },

    birthRule: function() {
      var rule = '';
      for (var i = 1 ; i < 9 ; i ++ ) {
        if (this.state['birth' + i]) rule += String(i);
      }

      return rule;
    },

    survivalRule: function() {
      var rule = '';
      for (var i = 1 ; i < 9 ; i ++ ) {
        if (this.state['survival' + i]) rule += String(i);
      }

      return rule;
    },

    update: function() {
      this.time = new Date().getTime(); 
      var newState = {};
      for (var r = 0 ; r < this.state.rows ; r ++ ) {
        for (var c = 0 ; c < this.state.cols ; c ++ ) {
          if(this.checkState(this.state, r, c)) {
            newState[[r,c]] = this.state[[r,c]] ? 0 : 1;
          }
        }
      }

      this.setState(newState);

      var now = new Date().getTime();
      var delta = now - this.time;
      while (delta < 1000 / this.state.fps) {
        now = new Date().getTime();
        delta = now - this.time;
      }
      this.intervalID = requestAnimationFrame(this.update);
    },

    checkState: function(state, row, col) {
      var rStart = Math.max(row - 1, 0);
      var cStart = Math.max(col - 1, 0);
      var rEnd = Math.min(row + 1, this.state.rows - 1);
      var cEnd = Math.min(col + 1, this.state.cols - 1);

      var sum = 0;
      var currentState = state[[row,col]];

      for (var r = rStart ; r <= rEnd; r ++ ) {
        for (var c = cStart ; c <= cEnd ; c ++ ) {
          sum += state[[r,c]];
        }
      }

      sum -= state[[row,col]];
      var change = false;
      if (currentState == 1) {
        if (!this.state['survival' + sum]) {
          change = true;
        } 
      } else if ( currentState == 0 ) {
        if (this.state['birth' + sum]) {
          change = true;
        }
      }

      return change;
    },

    blank: function() {
      var state = {};
      for (var row = 0 ; row < this.state.rows ; row ++ ) {
        for (var col = 0 ; col < this.state.cols; col ++ ) {
          state[[row,col]] = 0;
        }
      };

      this.setState(state);
    },

    randomize: function() {
      var state = {};
      for (var row = 0 ; row < this.state.rows ; row ++ ) {
        for (var col = 0 ; col < this.state.cols; col ++ ) {
          state[[row,col]] = Math.round(Math.random());
        }
      };

      this.setState(state);
    },

    handleChecked: function() {
      var newState = {};
      newState[event.target.getAttribute('data-rule')] = event.target.checked;
      this.setState(newState);
    },

    handleCellClicked: function(r, c) {
      cancelAnimationFrame(this.intervalID);
      this.state[[r,c]] = this.state[[r,c]] ? 0: 1;
      if (this.state.running) {
        this.state.running = false;
        this.forceUpdate(this.handleToggle);
      } else {
        this.forceUpdate();
      }
    },

    handleCustom: function() {
      if (this.state.custom) {
        this.setState({custom:false});
      } else {
        this.setState({custom:true});
      }
    },

    handleSubmit: function() {
      var lines = document.getElementById('pattern').value.split('\n')
      var newState = {};
      var rows = 0;
      var cols = 0;
      var cleaned = [];
      for (var row = 0 ; row < lines.length ; row ++ ) {
        var line = lines[row];
        if (line[0] != '!') {
          rows ++;
          if (cols < line.length) cols = line.length;
          cleaned.push(line);
        }
      }

      for (var row = 0 ; row < rows ; row ++ ) {
        var line = cleaned[row];
        for (var col = 0 ; col < cols; col ++ ) {
          if (col < line.length) {
            if (line[col] == '.') {
              newState[[row,col]] = 0;
            } else {
              newState[[row,col]] = 1;
            }
          }
          else newState[[row,col]] = 0;
        }
      };

      newState['custom'] = false;
      newState['rows'] = rows;
      newState['cols'] = cols;

      this.setState(newState);
    },

    handleCancel: function() {
      this.setState({custom:false});
    },

    handleToggle: function() {
      if (this.state.running) {
        this.setState({running:false});
        cancelAnimationFrame(this.intervalID);
      } else {
        this.setState({running:true});
        this.intervalID = requestAnimationFrame(this.update);
      }
    },
  });

  React.renderComponent(<Board />, document.body);
})()