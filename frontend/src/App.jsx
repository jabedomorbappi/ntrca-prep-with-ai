import AppRoutes from "./routes/AppRoutes";
import { ExamProvider } from "./context/ExamContext";
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function App() {
  return (
    <AuthProvider> 
      <ExamProvider>
        <AppRoutes />
      </ExamProvider> {/* Make sure this is present and spelled exactly like this */}
    </AuthProvider>
  );
}