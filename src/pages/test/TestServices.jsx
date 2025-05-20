export default function TestServices() {
  const services = [
    {
      title: "Dermatology",
      icon: "🩺",
      description:
        "Skin care specialists for acne, eczema, and cosmetic treatments",
    },
    {
      title: "Dentistry",
      icon: "🦷",
      description: "Complete dental care including implants and orthodontics",
    },
    {
      title: "Cardiology",
      icon: "❤️",
      description: "Heart health specialists and preventive care",
    },
    {
      title: "Neurology",
      icon: "🧠",
      description: "Treatment for brain and nervous system disorders",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Our Medical Services
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-6xl mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              <button className="mt-6 text-blue-600 font-medium hover:text-blue-700">
                View Doctors →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
