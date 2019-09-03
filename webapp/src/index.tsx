import React from "react";
import { render } from "react-dom";
import App from "./components/containers/App";
import * as serviceWorker from './serviceWorker';

render(<App />, document.querySelector("#root"));

serviceWorker.unregister();