import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { addUser } from "../functions/userAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MdContactEmergency } from "react-icons/md";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCalendar,
  FiChevronDown,
  FiAlertCircle,
  FiMapPin,
  FiPlus,
  FiArrowRight,
} from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = (data) => {
    const { confirmPassword, ...safeData } = data;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(safeData.password, salt);
    safeData.password = hash;

    try {
      addUser(safeData);
      console.log("Successfully added");
      toast.success("Registred Successfully");
      navigate("/");
    } catch (error) {
      toast.error(error);
      console.error("Add user failed", error);
    }
  };

  const errorClass =
    "flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg";

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl transition-all duration-300 transform hover:shadow-2xl">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 w-fit p-3 rounded-2xl shadow-lg">
                <FiUser className="text-white w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mt-4">
                Create Your Account
              </h2>
              <p className="text-gray-500">
                Join our community in just a few steps
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiUser className="mr-2 text-gray-500" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                    placeholder="John Doe"
                  />
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                {errors.name && (
                  <div className={errorClass}>
                    <FiAlertCircle className="mr-2" />
                    {errors.name.message}
                  </div>
                )}
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiMail className="mr-2 text-gray-500" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                      placeholder="name@example.com"
                    />
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.email && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiPhone className="mr-2 text-gray-500" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("number", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[6-9]/,
                          message: "Number must start with 6 - 9",
                        },
                        validate: {
                          isTenDigits: (value) =>
                            value.length === 10 ||
                            "Phone number must be 10 digits",
                        },
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                      placeholder="9876543210"
                    />
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.number && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.number.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiLock className="mr-2 text-gray-500" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.password ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePassword("password")}
                    >
                      {showPassword.password ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.password.message}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiLock className="mr-2 text-gray-500" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === password || "Passwords don't match",
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                      placeholder="••••••••"
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePassword("confirm")}
                    >
                      {showPassword.confirm ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>
              </div>

              {/* DOB + Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiCalendar className="mr-2 text-gray-500" />
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("dob", { required: "DOB is required" })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                    />
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.dob && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.dob.message}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiUser className="mr-2  text-gray-500" />
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none bg-white"
                    >
                      <option hidden value="">
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.gender && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.gender.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MdContactEmergency className="mr-2 text-gray-500" />
                    Emergency Contact Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("emergency_contact?.name")}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                      // placeholder=""
                    />
                    <MdContactEmergency className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.emergency_contact?.name && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.emergency_contact?.name.message}
                    </div>
                  )}
                </div>
                {/* Emergency Contact Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MdContactEmergency className="mr-2 text-gray-500" />
                    Emergency Contact Phone
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      {...register("emergency_contact.phone", {
                        pattern: {
                          value: /^[6-9]/,
                          message: "Number must start with 6 - 9",
                        },
                        validate: {
                          isTenDigits: (value) =>
                            value?.toString().length === 10 ||
                            "Phone number must be 10 digits",
                        },
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                      placeholder="9876543210"
                    />
                    <MdContactEmergency className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.emergency_contact?.phone && (
                    <div className={errorClass}>
                      <FiAlertCircle className="mr-2" />
                      {errors.emergency_contact.phone.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiMapPin className="mr-2 text-gray-500" />
                  Address
                </label>
                <textarea
                  rows="3"
                  {...register("address", {
                    minLength: {
                      value: 10,
                      message: "Too short (min 10 chars)",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter your full address"
                />
                {errors.address && (
                  <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                    <FiAlertCircle className={errorClass} />
                    {errors.address.message}
                  </div>
                )}
              </div>

              {/* Medical History */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiPlus className="mr-2 text-gray-500" />
                  Medical History (Optional)
                </label>
                <textarea
                  rows="3"
                  {...register("medical_history")}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                  placeholder="List any medical conditions or allergies"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Create Account
                <FiArrowRight className="inline-block ml-2" />
              </button>

              {/* Footer Links */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
