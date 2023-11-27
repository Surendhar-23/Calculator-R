import "boxicons";
import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELECT_DIGIT: "delete-digit",
  CLEAR_CURRENT: "clear-current",
  EVALUATE: "evaluate",
  SQUARE: "square",
  SQUARE_ROOT: "square-root",
  SIGN_CHANGE: "sign-change",
  ONE_BY: "one-by",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.previousOperand == null && state.currentOperand == null)
        return state;
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
        };
      }
      if (state.operation && state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.SQUARE:
      if (state.previousOperand == null && state.currentOperand == null)
        return state;
      if (state.previousOperand == null)
        return {
          ...state,
          currentOperand: square(state.currentOperand),
        };
      if (state.currentOperand == null)
        return {
          ...state,
          currentOperand: square(state.previousOperand) + state.currentOperand,
          previousOperand: null,
        };

      return {
        ...state,
        currentOperand: evaluate({
          ...state,
          currentOperand: square(state.currentOperand),
        }),
        previousOperand: null,
        operation: null,
      };

    case ACTIONS.SQUARE_ROOT:
      if (state.previousOperand == null && state.currentOperand == null)
        return state;
      if (state.previousOperand == null)
        return {
          ...state,
          currentOperand: Math.sqrt(state.currentOperand),
        };
      if (state.currentOperand == null)
        return {
          ...state,
          currentOperand:
            Math.sqrt(state.previousOperand) + state.currentOperand,
          previousOperand: null,
        };

      return {
        ...state,
        currentOperand: evaluate({
          ...state,
          currentOperand: Math.sqrt(state.currentOperand),
        }),
        previousOperand: null,
        operation: null,
      };
    case ACTIONS.SIGN_CHANGE:
      if (state.previousOperand == null && state.currentOperand == null)
        return state;
      if (state.currentOperand !== null)
        return {
          ...state,
          currentOperand: state.currentOperand * -1,
        };
      return {
        ...state,
        previousOperand: state.previousOperand * -1,
      };

    case ACTIONS.ONE_BY:
      if (state.previousOperand == null && state.currentOperand == null)
        return state;
      if (state.currentOperand !== null)
        return {
          ...state,
          currentOperand: 1 / state.currentOperand,
        };
      return {
        ...state,
        previousOperand: (1 / state.previousOperand) * -1,
      };
    case ACTIONS.DELECT_DIGIT:
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1)
        return {
          ...state,
          currentOperand: null,
        };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.CLEAR_CURRENT:
      return {
        ...state,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      console.log("clear");
      return {};
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null)
        return {
          ...state,
          currentOperand: state.previousOperand,
          previousOperand: null,
          operation: null,
        };
      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
      };
    default:
      return state;
  }
}
function square(operand) {
  return operand * operand;
}
function evaluate({ currentOperand, previousOperand, operation }) {
  let op1 = parseFloat(previousOperand);
  let op2 = parseFloat(currentOperand);
  console.log(op1, op2);
  let result = "";
  switch (operation) {
    case "+":
      result = op1 + op2;
      break;
    case "-":
      result = op1 - op2;
      break;
    case "X":
      result = op1 * op2;
      break;
    case "÷":
      result = op1 / op2;
      break;
    case "%":
      result = (op1 / 100) * op2;
      break;
    default:
      result = "";
  }
  return result.toString();
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  // dispact({ type: ACTIONS.ADD_DIGIT, payload: { digit: 1 } });
  return (
    <div className="container">
      <div className="calculator-grid">
        <div className="output">
          <div className="previousvalue">
            {previousOperand} {operation}
          </div>
          <div className="currentvalue">{currentOperand}</div>
        </div>
        <OperationButton operation={"%"} dispatch={dispatch} />

        <button onClick={() => dispatch({ type: ACTIONS.CLEAR_CURRENT })}>
          CE
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>C</button>
        <button>
          <box-icon
            type="solid"
            name="tag-x"
            onClick={() => dispatch({ type: ACTIONS.DELECT_DIGIT })}
          ></box-icon>
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.ONE_BY })}>1/x</button>
        <button onClick={() => dispatch({ type: ACTIONS.SQUARE })}>
          x<sup>2</sup>
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.SQUARE_ROOT })}>
          √x
        </button>

        <OperationButton operation={"÷"} dispatch={dispatch} />

        <DigitButton digit={"7"} dispatch={dispatch} />
        <DigitButton digit={"8"} dispatch={dispatch} />
        <DigitButton digit={"9"} dispatch={dispatch} />
        <OperationButton operation={"X"} dispatch={dispatch} />

        <DigitButton digit={"4"} dispatch={dispatch} />
        <DigitButton digit={"5"} dispatch={dispatch} />
        <DigitButton digit={"6"} dispatch={dispatch} />
        <OperationButton operation={"-"} dispatch={dispatch} />
        <DigitButton digit={"3"} dispatch={dispatch} />
        <DigitButton digit={"2"} dispatch={dispatch} />
        <DigitButton digit={"1"} dispatch={dispatch} />
        <OperationButton operation={"+"} dispatch={dispatch} />
        <button onClick={() => dispatch({ type: ACTIONS.SIGN_CHANGE })}>
          +/-
        </button>
        <DigitButton digit={"0"} dispatch={dispatch} />
        <DigitButton digit={"."} dispatch={dispatch} />
        <button
          className="equal"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
