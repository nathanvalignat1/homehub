import { Link, NavLink, Outlet, Route, Routes } from "react-router-dom";
import {
  Home,
  Receipt,
  ListTodo,
  BookOpenText,
  NotebookPen,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import ExpensesPage from "./pages/ExpensesPage";
import TasksPage from "./pages/TasksPage";
import RecipesPage from "./pages/RecipesPage";
import NotesPage from "./pages/NotesPage";
import SettingsPage from "./pages/SettingsPage";

function SidebarLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: any;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl transition
         ${isActive ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200" : "hover:bg-gray-100 dark:hover:bg-white/5"}`
      }
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

function AppShell() {
  const [collapsed, setCollapsed] = useState(false); // desktop: collapse total
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile: tiroir

  // Ferme le tiroir quand on navigue (mobile)
  useEffect(() => {
    const close = () => setDrawerOpen(false);
    window.addEventListener("hashchange", close);
    window.addEventListener("popstate", close);
    return () => {
      window.removeEventListener("hashchange", close);
      window.removeEventListener("popstate", close);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-neutral-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Bouton menu mobile */}
            <button
              className="rounded-xl border px-2 py-2 md:hidden hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
              onClick={() => setDrawerOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Bouton collapse desktop */}
            <button
              className="hidden md:inline-flex rounded-xl border px-2 py-2 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Afficher/Masquer la sidebar"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>

            {/* Logo + lien Home */}
            <Link
              to="/"
              className="ml-1 flex items-center gap-2 focus:outline-none"
            >
              <div className="h-6 w-6 rounded-lg bg-sky-500" />
              <span className="font-semibold">HomeHub</span>
              <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-200">
                PWA
              </span>
            </Link>
          </div>

          {/* Recherche masquée pour l’instant */}
          {/* <input className="hidden md:block w-64 ..." placeholder="Rechercher…" /> */}

          <button
            className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5"
            onClick={() => document.documentElement.classList.toggle("dark")}
            title="Basculer clair/sombre"
          >
            Theme
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {!collapsed && (
          <aside
            className={`hidden md:block border-r px-3 py-4 dark:border-white/10 transition-all duration-200
    ${collapsed ? "absolute -left-64 opacity-0" : "relative w-64 opacity-100"}`}
          >
            <nav className="space-y-1">
              <SidebarLink to="/" icon={Home} label="Accueil" />
              <SidebarLink to="/expenses" icon={Receipt} label="Dépenses" />
              <SidebarLink to="/tasks" icon={ListTodo} label="Tâches" />
              <SidebarLink to="/recipes" icon={BookOpenText} label="Recettes" />
              <SidebarLink to="/notes" icon={NotebookPen} label="Notes" />
              <SidebarLink to="/settings" icon={Settings} label="Paramètres" />
            </nav>
          </aside>
        )}

        {/* Drawer mobile */}
        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 text-neutral-100 p-4 md:hidden">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">Menu</span>
                <button
                  className="rounded-xl border border-white/10 p-2"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fermer le menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1">
                <SidebarLink to="/" icon={Home} label="Accueil" />
                <SidebarLink to="/expenses" icon={Receipt} label="Dépenses" />
                <SidebarLink to="/tasks" icon={ListTodo} label="Tâches" />
                <SidebarLink
                  to="/recipes"
                  icon={BookOpenText}
                  label="Recettes"
                />
                <SidebarLink to="/notes" icon={NotebookPen} label="Notes" />
                <SidebarLink
                  to="/settings"
                  icon={Settings}
                  label="Paramètres"
                />
              </nav>
            </div>
          </>
        )}

        {/* Contenu */}
        <main className="min-h-[calc(100vh-4rem)] flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
