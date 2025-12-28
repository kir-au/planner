import { PlannerMark } from "./components/PlannerMark";
import Navbar from './navbar';
import { getServerSession } from 'next-auth/next';

export default async function Nav() {
  const session = await getServerSession();
  return <Navbar user={session?.user} />;
}

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4">
      <a href="/planner" className="flex items-center gap-2">
        <PlannerMark className="h-6 w-6" />
        <span className="hidden sm:inline font-semibold">Planner</span>
      </a>
      {/* ...other navbar content... */}
    </nav>
  );
}
