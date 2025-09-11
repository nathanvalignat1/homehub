import { Link } from 'react-router-dom'
import { Receipt, ListTodo, BookOpenText, NotebookPen } from 'lucide-react'

const Card = ({ to, title, desc, Icon }: { to: string; title: string; desc: string; Icon: any }) => (
  <Link
    to={to}
    className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md
               dark:border-white/10 dark:bg-white/5"
  >
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-sky-100 p-3 text-sky-700 group-hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-200">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  </Link>
)

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bienvenue 👋</h1>
        <p className="text-gray-600 dark:text-gray-400">Portail HomeHub — tout au même endroit.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card to="/expenses" title="Dépenses" desc="Tricount-like : groupes, partages, soldes." Icon={Receipt} />
        <Card to="/tasks" title="Tâches" desc="Priorités, récurrence, rappels locaux." Icon={ListTodo} />
        <Card to="/recipes" title="Recettes & Repas" desc="Plan hebdo, ingrédients, courses." Icon={BookOpenText} />
        <Card to="/notes" title="Notes" desc="Markdown simple, tags, recherche." Icon={NotebookPen} />
      </div>
    </div>
  )
}
