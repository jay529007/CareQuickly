import { useParams } from "react-router-dom";

const doctors = [
  {
    name: "Dr. Aarti Sharma",
    email: "aarti@test.com",
    phone: "9876543210",
    specialty: "Dermatologist",
    education: "AIIMS, University of Delhi",
    qualifications: ["MBBS", "MD Dermatology"],
    languages: ["English", "Hindi", "Spanish"],
    password: "$2b$10$NNt5EDLyaC615dgrG2orP.daKmvcYQG1QkrP4IvfUMgH2T9OQOrwC",
    dateOfBirth: "1983-07-12",
    gender: "Female",
    about: "Specializing in Skin care aarti1234",
    image: "https://doctor-apoinment-system.vercel.app/docter4.png",
    experience: "8",
    id: "xEpTWag",
    availableslots: [],
    unavailableslots: [
      {
        date: "2025-04-10",
        start: "11:00",
        end: "12:00",
      },
      {
        date: "2025-05-14",
        start: "11:00",
        end: "13:00",
      },
    ],
  },
];

export default function TestDoctorProfile() {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Doctor Header */}
          <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-48 h-48 rounded-full object-cover border-4 border-blue-100"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
              <p className="text-blue-600 text-xl font-medium mb-4">
                {doctor.specialty}
              </p>
              <div className="flex items-center gap-4 text-gray-600">
                <span>🏥 {doctor.experience}+ Years Experience</span>
                <span>📅 Next Available: Tomorrow</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Qualifications</h2>
              <ul className="list-disc pl-6 space-y-2">
                {doctor.qualifications.map((q, i) => (
                  <li key={i} className="text-gray-600">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Languages & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Languages Spoken</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Availability</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-100 rounded-lg">
                  <p className="font-medium">Mon-Fri</p>
                  <p className="text-gray-600">9:00 AM - 5:00 PM</p>
                </div>
                <div className="p-4 bg-red-100 rounded-lg">
                  <p className="font-medium">Saturday</p>
                  <p className="text-gray-600">Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
