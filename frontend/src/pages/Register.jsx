import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/accounts/register/", formData);
      navigate("/login");
    }  catch (err) {
  // This will alert the actual error details sent back by Django
  const errorDetails = err.response?.data ? JSON.stringify(err.response.data) : err.message;
  alert("Registration Failed: " + errorDetails);
  console.log(err.response?.data);
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
        .register-card {
          border: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-radius: 16px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .register-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
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
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="row justify-content-center w-100">
          <div className="col-10 col-sm-8 col-md-6 col-lg-4 animate-fade-in">
            
            {/* Main Application Heading */}
            <div className="text-center mb-4">
              <h1 className="fw-extrabold display-5 app-brand mb-0 tracking-tight text-uppercase">ExamForge</h1>
              <p className="text-muted small">Smart Examination & Assessment System</p>
            </div>

            <div className="card register-card p-4 bg-white">
              <div className="card-body">
                
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                  <p className="text-muted small">Join us today by completing the form below</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingUsername"
                      placeholder="Username"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <label htmlFor="floatingUsername" className="text-muted">Username</label>
                  </div>

                  {/* Email Field inside Register.jsx */}
{/* Email Field inside Register.jsx */}
<div className="form-floating mb-3">
  <input
    type="email"
    name="email" // 👈 Added explicitly
    className="form-control"
    id="floatingEmail"
    placeholder="name@example.com"
    required
    value={formData.email || ""} // 👈 Added fallback to prevent undefined states
    onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })} // 👈 Added .trim() to remove accidental spaces
  />
  <label htmlFor="floatingEmail" className="text-muted">Email address</label>
</div>

                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <label htmlFor="floatingPassword" className="text-muted">Password</label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gradient w-100 py-2.5 fw-bold rounded-3 mb-3 d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <p className="text-muted small mb-0">
                      Already have an account?{" "}
                      <Link to="/login" className="text-decoration-none fw-semibold text-primary">
                        Sign In
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