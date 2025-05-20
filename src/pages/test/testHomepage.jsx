import { Link } from "react-router-dom";
import { FaCalendarAlt, FaUserMd, FaBell, FaArrowRight } from "react-icons/fa";
import { MdHealthAndSafety, MdAccessibility } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";

function TestHomepage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Modern Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              MD
            </div>
            <h1 className="text-2xl font-bold text-blue-800">MediBook</h1>
          </div>

          <nav className="hidden lg:flex space-x-8">
            <Link
              to="/"
              className="text-blue-800 font-medium hover:text-blue-600 transition relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/testservices"
              className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
            >
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/testdoctor"
              className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
            >
              Doctors
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 font-medium hover:text-blue-600 transition relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-800 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Doctor Image */}
      <section className="relative">
        <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
        <img
          src="https://doctor-apoinment-system.vercel.app/heroDoctor.jpg"
          alt="Doctor with patient"
          className="w-full h-[600px] object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 z-10">
            <div className="max-w-2xl bg-white bg-opacity-90 p-8 rounded-xl shadow-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Healthcare <span className="text-blue-600">Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Book appointments with top specialists in minutes, not days.
                Your health is our priority.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/testdoctor"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition"
                >
                  Find Link Doctor <FaArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/testservices"
                  className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg flex items-center justify-center transition"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                5,000+
              </div>
              <div className="text-gray-600">Happy Patients</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Specialist Doctors</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Service Availability</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-600">Medical Specialties</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting medical care has never been easier with our simple 3-step
              process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-3xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Find Your Doctor</h3>
              <p className="text-gray-600 mb-6">
                Browse our network of specialists and choose the right doctor
                for your needs.
              </p>
              <img
                src="https://doctor-apoinment-system.vercel.app/happyPatient1.jpg"
                alt="Happy patient"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-3xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
              <p className="text-gray-600 mb-6">
                Select available time slots that work with your schedule.
              </p>
              <img
                src="https://doctor-apoinment-system.vercel.app/Appointment-Calendar.png"
                alt="Appointment booking"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 text-3xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Get Treated</h3>
              <p className="text-gray-600 mb-6">
                Visit the doctor and receive quality healthcare with peace of
                mind.
              </p>
              <img
                src="https://doctor-apoinment-system.vercel.app/medicalTeam1.jpg"
                alt="Medical team"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose <span className="text-blue-600">MediBook</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                We're revolutionizing healthcare access with technology that
                puts patients first.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full mt-1">
                    <MdHealthAndSafety className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Verified Doctors</h3>
                    <p className="text-gray-600">
                      All our specialists are thoroughly vetted and certified.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full mt-1">
                    <FaCalendarAlt className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
                    <p className="text-gray-600">
                      See real-time availability and book instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full mt-1">
                    <RiCustomerService2Fill className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                    <p className="text-gray-600">
                      Our team is always ready to assist you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full mt-1">
                    <MdAccessibility className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                    <p className="text-gray-600">
                      Designed for all users, including those with disabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <img
                  // src="""
                  src="https://doctor-apoinment-system.vercel.app/happyPatient.jpg"
                  alt="Doctor consultation"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who've found better healthcare through
            our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/testdoctor"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Find Link Doctor Now
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  MD
                </div>
                <h3 className="text-xl font-bold">MediBook</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Making healthcare accessible and convenient for everyone.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/testservices"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/testdoctor"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Dermatology
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Dentistry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Cardiology
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Neurology
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    General Physician
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <address className="not-italic text-gray-400 space-y-3">
                <p>123 Medical Drive</p>
                <p>Health City, HC 12345</p>
                <p>Email: info@medibook.com</p>
                <p>Phone: (01234) 567890</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2023 MediBook. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TestHomepage;
