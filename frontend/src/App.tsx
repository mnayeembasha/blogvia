import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { checkAuth } from "./store/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";
import { PublicRoute } from "./components/PublicRoute";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignUp } from "./pages/SignUp";
// import { Navbar } from './components/Navbar';
import Layout from "./components/Layout";
import { Profile } from "./components/Profile";
import { BlogView } from "./pages/BlogView";
import { BlogShowCase } from "./pages/BlogShowCase";
import CreateBlog from "./pages/CreateBlog";
import Dashboard from "./pages/Dashboard/Dashboard";

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCheckingAuth } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* <Navbar/> */}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Layout>
                  <Login />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Layout>
                  <SignUp />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile/>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/blogs" element={
            <Layout>
              <BlogShowCase />
            </Layout>
          } />
           <Route path="/blogs/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateBlog/>
                </Layout>
              </ProtectedRoute>
          } />
          <Route path="/:username/:slug" element={
            <Layout>
              <BlogView />
            </Layout>
          } />
          {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background text-foreground">
        <AppContent />
        <Toaster
  position="top-center"
  // containerStyle={{
  //   top: 80, // Account for navbar height
  // }}
  />
      </div>
    </Provider>
  );
};

export default App;
