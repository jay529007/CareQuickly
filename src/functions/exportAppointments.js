import { toast } from "react-toastify";

export const generateCSV = (users) => {
  try {
    const headers = [
      "Id",
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
          user.id,
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

    toast.success("CSV generated successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
    return [headers, ...rows].map((e) => e.join(",")).join("\n");
  } catch (error) {
    console.error("Error generating CSV:", error);
    toast.error("Failed to generate CSV.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
    });
  }
};

export const downloadCSV = (csvContent, filename = "appointments.csv") => {
  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV downloaded successfully!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  } catch (error) {
    console.error("Error downloading CSV:", error);
    toast.error("Failed to download CSV.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }
};
