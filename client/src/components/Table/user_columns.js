const user_columns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Status", accessor: "status" },
  { header: "Registered", accessor: "created_at", isDate: true },
  { header: "Last Active", accessor: "last_login_time", isDate: true },
];
export default user_columns;
