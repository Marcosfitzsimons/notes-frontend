import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/protected-routes";
import Home from "./components/home";
import NotFound from "./components/not-found";
import Login from "./components/login";
import Header from "./components/header";

function App() {
  return (
    <div className="min-h-screen w-[min(95%,1000px)] mx-auto antialiased">
      <Header />
      <main>
        <Routes>
          <Route path="/">
            <Route path="*" element={<NotFound />} />
            <Route path="login" element={<Login />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
