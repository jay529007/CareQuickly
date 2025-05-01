export const generateCSV = (users) => {
  const headers = [
    "Name",
    "Email",
    "Service",
    "Doctor",
    "Status",
    "Date",
    "Start Time",
    "End Time",
    "Notes",
  ];
  const rows = [];

  users.forEach((user) => {
    user.appointments?.forEach((app) => {
      rows.push([
        user.name,
        user.email,
        app.service,
        app.doctor,
        app.status,
        app.slot.date,
        app.slot.start,
        app.slot.end,
        app.notes,
      ]);
    });
  });

  return [headers, ...rows].map((e) => e.join(",")).join("\n");
};

export const downloadCSV = (csvContent, filename = "appointments.csv") => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
