import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { fetchUsers } from "../lib/fetchUsers";
import Table from "../components/Table/Table";
export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isPending, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-indigo-50 p-4">
      <main>
        <Table users={data} />
      </main>
      {isPending && <p>Loading...</p>}
    </div>
  );
}
