import { useReducer } from "react";
import DigitButton from "./Components/DigitButton"; 
import OperationButton from "./Components/OperationButton";
import "./styles.css";

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


function reducer(state, {type, payload}) {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentInput: payload.digit
        }
      }
      if (payload.digit === "0" && state.currentInput === "0") {
        return state
      };
      if (payload.digit === "." && state.currentInput.includes(".")) {
        return state
      };
      return {
        ...state,
        currentInput: `${state.currentInput || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if( state.currentInput == null && state.previousInput == null ){
        return state;
      }
      if(state.previousInput == null) {
        return{
          ...state,
          operation: payload.operation,
          previousInput: state.currentInput,
          currentInput: null
        }
      }
      return {
        ...state,
        previousInput: evaluate(state),
        operation: payload.operation,
        currentInput: null
      }
    case ACTIONS.EVALUATE:
      if (state.previousInput == null || state.currentInput == null || state.operation == null) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousInput: null,
        operation: null,
        currentInput: evaluate(state)
      }
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentInput: null
        };
      }
      if (state.currentInput == null) {
        return state;
      }
      if (state.currentInput.length === 1) {
        return {
          ...state,
          currentInput: null
        };
      }
      return {
        ...state,
        currentInput: state.currentInput.slice(0, -1)
      };
    case ACTIONS.CLEAR:
      return {}
  }

}
  
function evaluate({currentInput, previousInput, operation}) {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return prev;
    let computation = "";
    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
      computation = prev - current;
      break;
      case "*":
      computation = prev * current;
      break;
      case "/":
      computation = prev / current;
      break;
    }
    return computation.toString();
  }

const INTEGER_FORMATER = new Intl.NumberFormat("en-US", { 
  maximumFractionDigits: 0
});

function formatNumber(number) {
  if (number == null) return ""; 
  const [integer, decimal] = number.split(".");
  const integerPart = INTEGER_FORMATER.format(integer);
  if (decimal == null) return integerPart;
  return `${integerPart}.${decimal}`;
}

function App() {

  const [{currentInput, previousInput, operation}, dispatch] = useReducer(reducer,{});


  return (
    <div className="container-grid">
      <div className="result-box">
        <div className="previous-input">{formatNumber(previousInput)} {operation}</div>
        <div className="current-result">{formatNumber(currentInput)}</div>
      </div>
      <button className="two-colums-button" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch}/>
      <DigitButton digit="1" dispatch={dispatch}/>
      <DigitButton digit="2" dispatch={dispatch}/>
      <DigitButton digit="3" dispatch={dispatch}/>
      <OperationButton operation="*" dispatch={dispatch}/>
      <DigitButton digit="4" dispatch={dispatch}/>
      <DigitButton digit="5" dispatch={dispatch}/>
      <DigitButton digit="6" dispatch={dispatch}/>
      <OperationButton operation="+" dispatch={dispatch}/>
      <DigitButton digit="7" dispatch={dispatch}/>
      <DigitButton digit="8" dispatch={dispatch}/>
      <DigitButton digit="9" dispatch={dispatch}/>
      <OperationButton operation="-" dispatch={dispatch}/>
      <DigitButton digit="." dispatch={dispatch}/>
      <DigitButton digit="0" dispatch={dispatch}/>
      <button className="two-colums-button" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
