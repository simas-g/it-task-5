import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../lib/fetchUsers";
import Table from "../components/Table/Table";
export default function DashboardPage() {
  const { data, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });
  return (
    <div className="flex flex-col pt-14 items-center justify-start min-h-screen bg-indigo-50 p-4">
      <main>
        <Table users={data} />
      </main>
      {isPending && <p>Loading...</p>}
    </div>
  );
}
