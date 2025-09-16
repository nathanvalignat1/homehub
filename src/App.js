import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, NavLink, Outlet, Route, Routes } from "react-router-dom";
import { Home, Receipt, ListTodo, BookOpenText, NotebookPen, Settings, ChevronRight, ChevronLeft, Menu, X, } from "lucide-react";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import ExpensesPage from "./pages/ExpensesPage";
import TasksPage from "./pages/TasksPage";
import RecipesPage from "./pages/RecipesPage";
import NotesPage from "./pages/NotesPage";
import SettingsPage from "./pages/SettingsPage";
function SidebarLink({ to, icon: Icon, label, }) {
    return (_jsxs(NavLink, { to: to, className: ({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-xl transition
         ${isActive ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200" : "hover:bg-gray-100 dark:hover:bg-white/5"}`, children: [_jsx(Icon, { className: "h-5 w-5" }), _jsx("span", { className: "text-sm font-medium", children: label })] }));
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
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-900 dark:text-neutral-100", children: [_jsx("header", { className: "sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-neutral-900/70", children: _jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "rounded-xl border px-2 py-2 md:hidden hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5", onClick: () => setDrawerOpen(true), "aria-label": "Ouvrir le menu", children: _jsx(Menu, { className: "h-5 w-5" }) }), _jsx("button", { className: "hidden md:inline-flex rounded-xl border px-2 py-2 hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5", onClick: () => setCollapsed((v) => !v), "aria-label": "Afficher/Masquer la sidebar", children: collapsed ? (_jsx(ChevronRight, { className: "h-5 w-5" })) : (_jsx(ChevronLeft, { className: "h-5 w-5" })) }), _jsxs(Link, { to: "/", className: "ml-1 flex items-center gap-2 focus:outline-none", children: [_jsx("div", { className: "h-6 w-6 rounded-lg bg-sky-500" }), _jsx("span", { className: "font-semibold", children: "HomeHub" }), _jsx("span", { className: "rounded-md bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-200", children: "PWA" })] })] }), _jsx("button", { className: "rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 dark:border-white/10 dark:hover:bg-white/5", onClick: () => document.documentElement.classList.toggle("dark"), title: "Basculer clair/sombre", children: "Theme" })] }) }), _jsxs("div", { className: "mx-auto flex max-w-7xl", children: [!collapsed && (_jsx("aside", { className: `hidden md:block border-r px-3 py-4 dark:border-white/10 transition-all duration-200
    ${collapsed ? "absolute -left-64 opacity-0" : "relative w-64 opacity-100"}`, children: _jsxs("nav", { className: "space-y-1", children: [_jsx(SidebarLink, { to: "/", icon: Home, label: "Accueil" }), _jsx(SidebarLink, { to: "/expenses", icon: Receipt, label: "D\u00E9penses" }), _jsx(SidebarLink, { to: "/tasks", icon: ListTodo, label: "T\u00E2ches" }), _jsx(SidebarLink, { to: "/recipes", icon: BookOpenText, label: "Recettes" }), _jsx(SidebarLink, { to: "/notes", icon: NotebookPen, label: "Notes" }), _jsx(SidebarLink, { to: "/settings", icon: Settings, label: "Param\u00E8tres" })] }) })), drawerOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40 bg-black/40 md:hidden", onClick: () => setDrawerOpen(false) }), _jsxs("div", { className: "fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 text-neutral-100 p-4 md:hidden", children: [_jsxs("div", { className: "mb-3 flex items-center justify-between", children: [_jsx("span", { className: "font-semibold", children: "Menu" }), _jsx("button", { className: "rounded-xl border border-white/10 p-2", onClick: () => setDrawerOpen(false), "aria-label": "Fermer le menu", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("nav", { className: "space-y-1", children: [_jsx(SidebarLink, { to: "/", icon: Home, label: "Accueil" }), _jsx(SidebarLink, { to: "/expenses", icon: Receipt, label: "D\u00E9penses" }), _jsx(SidebarLink, { to: "/tasks", icon: ListTodo, label: "T\u00E2ches" }), _jsx(SidebarLink, { to: "/recipes", icon: BookOpenText, label: "Recettes" }), _jsx(SidebarLink, { to: "/notes", icon: NotebookPen, label: "Notes" }), _jsx(SidebarLink, { to: "/settings", icon: Settings, label: "Param\u00E8tres" })] })] })] })), _jsx("main", { className: "min-h-[calc(100vh-4rem)] flex-1 p-4 md:p-6", children: _jsx(Outlet, {}) })] })] }));
}
export default function App() {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(AppShell, {}), children: [_jsx(Route, { index: true, element: _jsx(HomePage, {}) }), _jsx(Route, { path: "expenses", element: _jsx(ExpensesPage, {}) }), _jsx(Route, { path: "tasks", element: _jsx(TasksPage, {}) }), _jsx(Route, { path: "recipes", element: _jsx(RecipesPage, {}) }), _jsx(Route, { path: "notes", element: _jsx(NotesPage, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsPage, {}) })] }) }));
}
