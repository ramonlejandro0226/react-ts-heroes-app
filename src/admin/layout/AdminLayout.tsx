import { Outlet } from "react-router";

export const AdminLayout = () => {
  return (
    <div className="bg-blue-500">
      <h1>hola mundo</h1>
      <Outlet />
    </div>
  );
};
