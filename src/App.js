import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./App.scss";
import { DateRange } from "react-date-range";
import { useState } from "react";
import {
  differenceInCalendarWeeks,
  addMonths,
  differenceInDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const localStoreKey = "@localstate";

const getItem = (initial) => {
  const data = localStorage.getItem(localStoreKey);
  if (!data) {
    return initial;
  }
  return JSON.parse(data);
};

const setItem = (data) => {
  const item = JSON.stringify(data);
  localStorage.setItem(localStoreKey, item);
};

const useStatePersist = (initial) => {
  const [state, setState] = useState(getItem(initial));
  const setStatePersist = (params) => {
    setState((prevState) => {
      const newState = params instanceof Function ? params(prevState) : params;
      setItem(newState);
      return newState;
    });
  };

  return [state, setStatePersist];
};

const round2Decimals = (num) => Math.round(num * 100) / 100;

const initialState = {
  amount: undefined,
  selectionRange: {
    startDate: new Date(),
    endDate: addMonths(new Date(), 1),
    key: "selection",
    color: "#4caf50",
  },
};

function App() {
  const [state, setState] = useStatePersist(initialState);
  const { amount, selectionRange } = state;
  const startDate = new Date(selectionRange.startDate);
  const endDate = new Date(selectionRange.endDate);

  const setAmount = (value) =>
    setState((preState) => ({
      ...preState,
      amount: value,
    }));

  const setSelectionRange = (value) =>
    setState((preState) => ({
      ...preState,
      selectionRange: value,
    }));

  const weeksCount = 1 + differenceInCalendarWeeks(endDate, startDate);
  const daysCount = 1 + differenceInDays(endDate, startDate);

  const calcPerWeek = () => {
    if (!amount) {
      return 0;
    }
    return round2Decimals(amount / weeksCount);
  };

  const calcPerDay = () => {
    if (!amount) {
      return 0;
    }
    return round2Decimals(amount / daysCount);
  };

  const ranges = [
    {
      ...selectionRange,
      startDate,
      endDate,
    },
  ];

  return (
    <div className="App">
      <div className="App__container">
        <div className="App__input-group">
          <input
            className="App__input"
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(+e.target.value)}
          />
        </div>
        <div className="App__amount">
          <div className="App__amount-item">
            <div>Total</div>
            <div className="text">{amount}</div>
          </div>
          <div className="App__amount-item">
            <div>Por semana ({weeksCount}x)</div>
            <div className="text">{calcPerWeek()}</div>
          </div>
          <div className="App__amount-item">
            <div>Por dia ({daysCount}x)</div>
            <div className="text"> {calcPerDay()}</div>
          </div>
        </div>
        <DateRange
          weekdayDisplayFormat="EEEEEE"
          locale={ptBR}
          months={2}
          ranges={ranges}
          onChange={(item) => {
            console.log(item);
            setSelectionRange(item.selection);
          }}
        />
      </div>
    </div>
  );
}

export default App;
