import { combineReducers } from "redux";
import TableReducer from "../../containers/TableContainer/reducer";
import DropdownReducer from "../../containers/DropdownContainer/reducer";
import TimelineReducer from "../../containers/TimelineContainer/reducer";
import SearchReducer from "../../containers/SearchContainer/reducer";
import FilterReducer from "../../containers/FilterContainer/reducer";

const  lastAction = (state = null, action) => {
    return action;
}

const rootReducer = combineReducers({
  rdxtable: TableReducer,
  rdxtimeline: TimelineReducer,
  rdxDropdown : DropdownReducer,
  lastAction : lastAction,
  rdxSearch: SearchReducer,
  rdxFilter: FilterReducer
});

export default rootReducer;
