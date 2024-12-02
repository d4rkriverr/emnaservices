import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import { useAuth } from "./hooks/auth";

import Layout from "./features/layout";
import PreloadView from "./features/preload";
import EmployeesPage from "./features/employees";
// import ContractsPage from "./features/invoices"
import ExpansesPage from "./features/expanses"
import AuthPage from "./features/authentication";
import AuthManager from "./features/auth_manager";
import DashboardPage from "./features/dashboard";
import InvoiceListPage from "./features/invoices/list_invoices";
import ContractsPage from "./features/invoices";


const App = () => {
  const { isAuthed, isLoad } = useAuth();
  if (isLoad) return <PreloadView />;

  const isAuthedGuard = () => (isAuthed) ? redirect("/expanses") : null;
  const isNotAuthedGuard = () => (!isAuthed) ? redirect("/auth") : null;
  
  return <RouterProvider router={createBrowserRouter(
    [
      { path: "/auth", element: <AuthPage />, loader: isAuthedGuard },
      {
        path: "/", element: <Layout />, loader: isNotAuthedGuard,
        children: [
          { path: "", index: true, element: <AuthManager element={<DashboardPage />} prIndex={0} /> },
          {
            path: "/invoices",
            children: [
              { path: "", loader: () => redirect("/invoices/list") },
              { path: "list", index: true, element: < AuthManager element={<InvoiceListPage />} prIndex={1} /> },
              { path: "old", index: true, element: < AuthManager element={<ContractsPage />} prIndex={1} /> },
            ]
          },
          {
            path: "/expanses", element: <AuthManager element={<ExpansesPage />} prIndex={2} />
          },
          { path: "/employees", element: <AuthManager element={<EmployeesPage />} prIndex={3} /> },
        ]
      },
    ]
  )} />;
}
export default App
