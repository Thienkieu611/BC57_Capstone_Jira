import ReactDOM from "react-dom/client";
import {
  Navigate,
  Route,
  Routes,
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";

//cấu hình redux
import { Provider } from "react-redux";

import HomeTemplate from "./templates/HomeTemplate";

//Cấu hình chuyển hướng trang thông qua history
import { createBrowserHistory } from "history";
import Home from "./pages/Home";
import { store } from "./redux/store.js";
import CreateProject from "./pages/CreateProject/CreateProject.jsx";
import UpdateProject from "./pages/UpdateProject.jsx";

//history giúp chuyển hướng trang
export const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <HistoryRouter history={history}>
      <Routes>
        <Route path="/" element={<HomeTemplate />}>
          <Route index element={<Home />}></Route>
          <Route path="createProject" element={<CreateProject />}></Route>
          <Route path="updateProject" element={<UpdateProject />}></Route>
          <Route path="*" element={<Navigate to="" />}></Route>
        </Route>
      </Routes>
    </HistoryRouter>
  </Provider>
);
