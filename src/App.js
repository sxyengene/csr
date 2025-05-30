import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BasicLayout from "./layouts/BasicLayout";
import CreateActivity from "./pages/CreateActivity";
import ActivityList from "./pages/ActivityList";
import EventCreate from "./pages/EventCreate";
import Login from "./pages/Login";
import UserList from "./pages/Users";
import UserDetail from "./pages/Users/Detail";
import "./styles/global.scss";

// 路由守卫组件
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <BasicLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ActivityList />} />
          <Route path="activities/create" element={<CreateActivity />} />
          <Route path="activities/:id/edit" element={<CreateActivity />} />
          <Route path="event/create/:activityId" element={<EventCreate />} />
          <Route
            path="event/edit/:activityId/:eventId"
            element={<EventCreate />}
          />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
