import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BasicLayout from "./layouts/BasicLayout/index";
import EventCreate from "./pages/EventCreate";
import EventList from "./pages/EventList";
import ActivityCreate from "./pages/ActivityCreate";
import ActivityDetails from "./pages/ActivityDetails";
import Login from "./pages/Login";
import UserList from "./pages/Users";
import UserDetail from "./pages/Users/Detail";
import { isAuthenticated } from "./services/auth";
import "./styles/global.scss";

// 路由守卫组件
const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
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
          <Route index element={<EventList />} />
          <Route path="events/create" element={<EventCreate />} />
          <Route path="events/:id/edit" element={<EventCreate />} />
          <Route path="activity/create/:eventId" element={<ActivityCreate />} />
          <Route
            path="activity/edit/:eventId/:activityId"
            element={<ActivityCreate />}
          />
          <Route path="users" element={<UserList />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="activity-details" element={<ActivityDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
