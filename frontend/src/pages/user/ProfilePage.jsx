import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [debugError, setDebugError] = useState("");

  // Sync profile when AuthContext successfully loads the user
  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || "",
        email: user.email || ""
      });
    }
  }, [user]);

  // Diagnostic tool to force data synchronization directly from local storage
  const forceSyncProfile = async () => {
    setDebugError("");
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      setDebugError("No 'access_token' found in local storage. Try signing out and signing back in.");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/accounts/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      if (setUser) setUser(response.data); // Backfill AuthContext
    } catch (err) {
      setDebugError(`API Fetch failed: ${err.response?.status || ""} - ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Profile...</span>
        </div>
      </div>
    );
  }

  const initials = profile.username ? profile.username.substring(0, 2).toUpperCase() : "EF";

  return (
    <div className="row g-4 justify-content-center my-2 animate-fade-in">
      
      {/* Visual Identity Side Banner */}
      <div className="col-12 col-md-4 col-xl-3">
        <div className="card border-0 shadow-sm rounded-4 text-center p-4 bg-white">
          <div className="d-flex justify-content-center mb-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-2 shadow-sm text-uppercase" style={{ width: '80px', height: '80px' }}>
              {initials}
            </div>
          </div>
          <h5 className="fw-bold mb-1 text-dark text-capitalize">{profile.username || "Candidate"}</h5>
          <p className="text-muted small mb-3">Student / Candidate Account</p>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
            Active Account
          </span>
          <button className="btn btn-outline-primary btn-sm rounded-3 mt-2 w-100 fw-semibold" onClick={forceSyncProfile}>
            🔄 Sync Data
          </button>
        </div>
      </div>

      {/* Profile Form Details Editor Panel */}
      <div className="col-12 col-md-8 col-xl-6">
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">Profile Settings</h4>
          
          {debugError && (
            <div className="alert alert-warning border-0 rounded-3 small py-2 px-3 mb-3 fw-medium">
              ⚠️ {debugError}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <label className="form-label text-muted small fw-bold text-uppercase">Username</label>
              <input 
                type="text" 
                className="form-control rounded-3 bg-light text-dark fw-medium text-capitalize" 
                value={profile.username} 
                placeholder="Not Synced"
                readOnly 
                style={{ cursor: "not-allowed" }}
              />
            </div>
            
            <div className="col-12 col-sm-6">
              <label className="form-label text-muted small fw-bold text-uppercase">Email Address</label>
              <input 
                type="email" 
                className="form-control rounded-3 bg-light text-dark fw-medium" 
                value={profile.email} 
                placeholder="Not Synced"
                readOnly 
                style={{ cursor: "not-allowed" }}
              />
            </div>
          </div>

          <div className="mt-4 pt-2">
            <p className="text-muted small mb-0">
              💡 <em>To modify credentials, please contact your systems management team or use the recovery framework path.</em>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}