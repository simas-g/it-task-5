import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../lib/fetchUsers";
import { useState } from "react";
import Table from "../components/Table/Table";
import ToastContainer from "../components/Table/ToastContainer";

export default function DashboardPage() {
  const { data, isPending, refetch } = useQuery({
    queryKey: [""],
    queryFn: () => fetchUsers(),
  });
  const [toast, setToast] = useState({ message: "", type: "" });
  const notifyUser = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };
  return (
    <div className="flex flex-col pt-14 items-center justify-start min-h-screen bg-indigo-50 p-4">
      <main>
        <Table users={data} refetch={refetch} notifyUser={notifyUser} />
      </main>
      {isPending && <p>Loading...</p>}
      <ToastContainer
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />
    </div>
  );
}
