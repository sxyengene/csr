import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BasicLayout from "./layouts/BasicLayout";
import CreateActivity from "./pages/CreateActivity";
import ActivityList from "./pages/ActivityList";
import EventCreate from "./pages/EventCreate";
import "./styles/global.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BasicLayout />}>
          <Route index element={<ActivityList />} />
          <Route path="activities/create" element={<CreateActivity />} />
          <Route path="activities/:id/edit" element={<CreateActivity />} />
          <Route path="event/create/:activityId" element={<EventCreate />} />
          <Route
            path="event/edit/:activityId/:eventId"
            element={<EventCreate />}
          />
          <Route path="users" element={<div>用户管理页面</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
