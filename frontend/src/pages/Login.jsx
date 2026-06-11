import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function Login() {
  const { login } = useAuth(); 
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); 
    
    try {
      // 🎯 Production Ready dynamic base fallbacks instead of hardcoded strings
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/";
      // Ensure smooth slashes when joining paths
      const cleanBaseUrl = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
      
      const res = await axios.post(`${cleanBaseUrl}/api/token/`, credentials);
      
      // ✅ Added await to guarantee context profile updates sync completely before moving
      await login(res.data.access, res.data.refresh); 
      
      navigate("/");
    } catch (err) {
      console.error("Login authorization error:", err.response?.data || err.message);
      setErrorMessage("Invalid username or password. Please verify credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        .login-card {
          border: none;
          box-shadow: 0 10px 30px rgba(79, 70, 229, 0.05), 0 5px 15px rgba(0, 0, 0, 0.02);
          border-radius: 16px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .login-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(79, 70, 229, 0.1);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          border: none;
          transition: opacity 0.2s ease;
        }
        .btn-gradient:hover {
          opacity: 0.9;
          color: white;
        }
        .app-brand {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #10b981 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .form-floating > .form-control:focus ~ label {
          color: #4f46e5 !important;
        }
        .form-control:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.15) !important;
        }
      `}</style>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4 animate-fade-in">
            
            {/* Main Application Heading */}
            <div className="text-center mb-4">
              <h1 className="fw-black display-6 app-brand mb-0 tracking-tight text-uppercase fw-bold">ExamForge</h1>
              <p className="text-muted small fw-medium mt-1">Smart Examination & Assessment System</p>
            </div>

            <div className="card login-card p-3 bg-white">
              <div className="card-body">
                
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                  <p className="text-muted small">Please enter your details to sign in</p>
                </div>

                {/* Smooth error indicator message component banner if validation fails */}
                {errorMessage && (
                  <div className="alert alert-danger border-0 rounded-3 small py-2 px-3 mb-3 text-center fw-medium animate-fade-in" role="alert">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control rounded-3"
                      id="floatingUsername"
                      placeholder="Username"
                      required
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    />
                    <label htmlFor="floatingUsername" className="text-muted">Username</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control rounded-3"
                      id="floatingPassword"
                      placeholder="Password"
                      required
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    <label htmlFor="floatingPassword" className="text-muted">Password</label>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4 small">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="rememberMe" style={{ cursor: "pointer" }} />
                      <label className="form-check-label text-muted user-select-none" htmlFor="rememberMe" style={{ cursor: "pointer" }}>
                        Remember me
                      </label>
                    </div>
                    <Link to="/password-reset" className="text-decoration-none fw-semibold text-primary">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient w-100 py-2.5 fw-bold rounded-3 mb-3 d-flex align-items-center justify-content-center shadow-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span>Verifying Workspace...</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <p className="text-muted small mb-0">
                      Don't have an account?{" "}
                      <Link to="/register" className="text-decoration-none fw-semibold text-primary">
                        Sign up for free
                      </Link>
                    </p>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}