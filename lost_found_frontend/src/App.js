// src/App.js

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import ItemDetail from "./pages/ItemDetail";
import ItemForm from "./pages/ItemForm";
import Reports from "./pages/Reports";
import ReportForm from "./components/reports/ReportForm";
import ReportDetail from "./components/reports/ReportDetail";
import Claims from "./pages/Claims";
import Profile from "./pages/Profile";
import ClaimForm from "./components/claims/ClaimForm";
import ClaimDetail from "./components/claims/ClaimDetail";
import ClaimApproval from "./components/claims/ClaimApproval";

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <Items />
              </ProtectedRoute>
            }
          />

          <Route
            path="/items/:itemId"
            element={
              <ProtectedRoute>
                <ItemDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/items/new"
            element={
              <ProtectedRoute>
                <ItemForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/items/:itemId/edit"
            element={
              <ProtectedRoute>
                <ItemForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/new"
            element={
              <ProtectedRoute>
                <ReportForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/:reportId"
            element={
              <ProtectedRoute>
                <ReportDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/claims"
            element={
              <ProtectedRoute>
                <Claims />
              </ProtectedRoute>
            }
          />

          <Route
            path="/claims/new"
            element={
              <ProtectedRoute>
                <ClaimForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/claims/:claimId"
            element={
              <ProtectedRoute>
                <ClaimDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/claims/:claimId/approve"
            element={
              <ProtectedRoute>
                <ClaimApproval />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
