import { FaClinicMedical, FaTooth, FaHeartbeat, FaBrain } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { Link } from "react-router-dom";

const AllServices = () => {
  const services = [
    {
      title: "Dermatology",
      icon: <FaClinicMedical className="w-full h-full" />,
      description:
        "Skin care specialists for acne, eczema, and cosmetic treatments",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Dentistry",
      icon: <FaTooth className="w-full h-full" />,
      description: "Complete dental care including implants and orthodontics",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Cardiology",
      icon: <FaHeartbeat className="w-full h-full" />,
      description: "Heart health specialists and preventive care",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Neurology",
      icon: <FaBrain className="w-full h-full" />,
      description: "Treatment for brain and nervous system disorders",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "General Medicine",
      icon: <GiMedicinePills className="w-full h-full" />,
      description: "Comprehensive care for all your health needs",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Surgeons",
      icon: <FaUserDoctor className="w-full h-full" />,
      description: "Healing through skilled hands and modern techniques.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-blue-600">Medical Services</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Specialized care across all major medical disciplines
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white  rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Icon Container */}
              <div
                className={`${service.bgColor} py-20 flex items-center justify-center`}
              >
                <div className={`w-20 h-20 ${service.iconColor}`}>
                  {service.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 h-full ">
                <div className="">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {service.title}
                  </h3>
                </div>
                <div className="">
                  <p className="text-gray-600 mb-6">{service.description}</p>
                </div>
                {/* View Specialists */}
                {/* <div className="">
                  <Link
                    to={`/doctors?specialty=${service.title.toLowerCase()}`}
                    className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition"
                  >
                    View Specialists
                    <svg
                      className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Can't find what you're looking for?
          </h3>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition"
          >
            Contact Our Support Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllServices;
