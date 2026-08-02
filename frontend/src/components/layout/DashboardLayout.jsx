import { BarChart3, BedDouble, Building2, CreditCard, FileText, Home, LogOut, Menu, MessageSquareWarning, Moon, Settings, Sun, Users, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const adminLinks = [
  ["Dashboard", "/pgbooking/admin/dashboard", Home],
  ["Branches", "/pgbooking/admin/branches", Building2],
  ["Rooms", "/pgbooking/admin/rooms", BedDouble],
  ["Beds", "/pgbooking/admin/beds", BedDouble],
  ["Bookings", "/pgbooking/admin/bookings", FileText],
  ["Residents", "/pgbooking/admin/residents", Users],
  ["Wardens", "/pgbooking/admin/wardens", Users],
  ["Payments", "/pgbooking/admin/payments", CreditCard],
  ["Complaint Management", "/pgbooking/admin/complaints", MessageSquareWarning],
  ["Reports & Analytics", "/pgbooking/admin/reports", BarChart3],
  ["Settings", "/pgbooking/admin/settings", Settings]
];

const wardenLinks = [
  ["Dashboard", "/pgbooking/warden/dashboard", Home],
  ["Residents", "/pgbooking/warden/residents", Users],
  ["Payments", "/pgbooking/warden/payments", CreditCard],
  ["Occupancy", "/pgbooking/warden/occupancy", BarChart3]
];

const DashboardLayout = ({ role }) => {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const linksByRole = {
    ADMIN: adminLinks,
    WARDEN: wardenLinks
  };
  const roleLabels = {
    ADMIN: "Admin",
    WARDEN: "Warden"
  };
  const links = linksByRole[role] ?? adminLinks;

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-4 lg:min-h-screen">
        <div className="mb-5 flex items-center gap-2 text-lg font-bold">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-brand/20 bg-white shadow-soft">
            <img src="/logo.jpeg" alt="Mom's Care PG House logo" className="h-full w-full object-cover" />
          </span>
          <span>Mom's Care</span>
        </div>
        <nav className="hidden gap-2 overflow-x-auto pb-2 md:flex lg:flex-col lg:overflow-visible">
          {links.map(([label, to, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith("/dashboard")}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-mint text-white" : "text-slate-600 hover:bg-slate-50"}`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="min-w-0">
        <header className="relative flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-md border bg-white text-slate-600 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="min-w-0">
              <p className="text-sm text-slate-500">{roleLabels[role] ?? "Dashboard"}</p>
              <h1 className="truncate text-lg font-semibold">{user?.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-md border bg-white text-mint transition hover:bg-mint hover:text-white"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
          {open && (
            <nav className="absolute left-0 right-0 top-full z-40 max-h-[calc(100dvh-65px)] overflow-y-auto border-b border-slate-200 bg-white p-2 shadow-lg md:hidden">
              {links.map(([label, to, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to.endsWith("/dashboard")}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium ${isActive ? "bg-mint text-white" : "text-slate-600 hover:bg-slate-50"}`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          )}
        </header>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
