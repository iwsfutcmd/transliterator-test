import React, { Component } from 'react';
import './App.css';
import XRegExp from 'xregexp';
import { query } from './api.js';

const INITIALINPUTS = [
  "марий йылме",
  "пий",
  "пырыс",
  "Азий",
  "дикобраз",
];

class ColoredText extends Component {
  render() {
    let text = this.props.value.split("").map(c => {
      if (XRegExp("\\p{Cyrillic}").test(c)) {
        return [c, "Cyrl"];
      } else if (XRegExp("\\p{Latin}").test(c)) {
        return [c, "Latn"];
      } else {
        return [c, "Zyyy"];
      }
    });
    return (
      <div>
        {
          text.map((cScr, i) => (
            <span key={i} className={cScr[1]}>{cScr[0]}</span>
          ))
        }
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      testinputs: INITIALINPUTS,
      testoutputs: INITIALINPUTS.map(() => ""),
      rules: "",
      goodRules: true,
    };
  }

  XRegExp = XRegExp;

  transliterate = () => {
    let rules = this.state.rules;
    query("/transliterate", {rules, txt: this.state.testinputs}).then(r => {
      this.setState({
        testoutputs: r.txt || this.state.testinputs.map(() => ""),
        goodRules: Boolean(r.txt)
      });
    });
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.transliterate}>→</button>
        {this.state.goodRules ? "" : "RULES BE BROKE"}
        <div id="main-block">
          <textarea id="rules" value={this.state.rules} onChange={e => this.setState({rules: e.target.value})}/>
          <div>
            <div id="tests">
              <div id="inputs">
                {
                  this.state.testinputs.map((s, i) => (
                    <div className="line" key={i}>
                      <input value={s} onChange={e => {
                        let testinputs = this.state.testinputs;
                        testinputs[i] = e.target.value;
                        this.setState({testinputs});
                      }}/>
                      <ColoredText value={this.state.testoutputs[i] || ""}/>
                      {/* <div>{this.state.testoutputs[i]}</div> */}
                    </div>
                  ))
                }
              </div>
            </div>
            <button onClick={() => {
              this.setState({
                testinputs: this.state.testinputs.concat([""]),
                testoutputs: this.state.testoutputs.concat([""])
              })
            }}>
              +
            </button>
            <button onClick={() => {
              this.setState({
                testinputs: this.state.testinputs.slice(0, -1),
                testoutputs: this.state.testoutputs.slice(0, -1)
              })
            }}>
              -
            </button>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
