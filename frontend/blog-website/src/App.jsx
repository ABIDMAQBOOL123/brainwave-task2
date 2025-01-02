import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import SignupForm from "./Pages/SignupForm";
import LoginForm from "./Pages/LoginForm";
import PostPage from "./Pages/PostPage";
import Home from "./Pages/Home";
import CreatePost from "./Components/CreatePostForm";
import UpdatePostForm from "./Components/UpdatePostForm";
import Cookies from "js-cookie";

import { authState } from "./Atom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useRecoilState(authState);

  useEffect(() => {
    const token = Cookies.get("x-auth-token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);

    Cookies.set("x-auth-token", "your-token-here", {
      secure: true,
      sameSite: "Strict",
    });
  };

  // Handle user logout
  const handleLogout = () => {
    Cookies.remove("x-auth-token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <nav>
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout}>Logout</button>
              <Link to="/create">Create Post</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>

        <Routes>
          {/* Home route */}
          <Route
            path="/"
            element={
              <Home
                isAuthenticated={isAuthenticated}
                handleLogout={handleLogout}
              />
            }
          />

          {/* Signup route */}
          <Route
            path="/signup"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <SignupForm handleLogin={handleLogin} />
              )
            }
          />

          {/* Login route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LoginForm handleLogin={handleLogin} />
              )
            }
          />

          {/* Authenticated routes */}
          <Route
            path="/create"
            element={
              isAuthenticated ? (
                <CreatePost />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route
            path="/posts/:id/edit"
            element={
              isAuthenticated ? (
                <UpdatePostForm />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
