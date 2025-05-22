import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/re-usablecomponets/InputFeild";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { addDoctor, updateDoctorSlot } from "../../functions/doctorAPI";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../../functions/doctorSlice";
import VerifyPassword from "../../components/verify";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiCalendar,
  FiChevronDown,
  FiAlertCircle,
  FiBookOpen,
  FiAward,
  FiGlobe,
  FiCamera,
  FiInfo,
  FiArrowLeft,
} from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const qualificationOptions = [
  "MBBS",
  "MD Dermatology",
  "MS Orthopedics",
  "DM Cardiology",
  "DNB Psychiatry",
];

const AddDoctor = ({ isDoctor }) => {
  const [modelOn, setModelOn] = useState(false);
  const dispatch = useDispatch();
  const formDataRef = useRef(null);

  const doctors = useSelector((doctor) => doctor.doctors.doctors);
  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);

  const currentDoctor = doctors?.find((doctors) => doctors.id === isDoctor);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: currentDoctor ?? {} });

  useEffect(() => {
    if (currentDoctor) {
      reset(currentDoctor); // pre-fill the form with fetched doctor data
    }
  }, [currentDoctor, reset]);

  //   const password = watch("password");
  const onSubmit = (data) => {
    if (!isDoctor) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(data.password, salt);
      data.password = hash;
    }
    try {
      if (!isDoctor) {
        addDoctor(data);
        toast.success("Registered Successfully");
        reset();
      } else {
        formDataRef.current = data;
        setModelOn(true);
      }
    } catch (error) {
      toast.error(error);
      reset();
    }
  };
  const handleVerifiedSubmit = () => {
    try {
      if (formDataRef.current) {
        updateDoctorSlot(isDoctor, formDataRef.current);
        toast.success("Updated Successfully");
        setModelOn(false);
        formDataRef.current = null;
      }
    } catch (error) {
      toast.error("Something Went Wrong");
      toast.info("Please try again");
      console.error("updating Doctor" + error);
    }
  };

  return (
    <>
      <div className=" bg-[#EBF8FF] ">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            to={isDoctor ? `/doctor/profile/${isDoctor}` : "/admin/dashboard"}
            className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <FiArrowLeft className="mr-2 w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 w-fit p-3 rounded-2xl shadow-lg">
                  <FiUser className="text-white w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mt-4">
                  {isDoctor ? "Update Doctor Profile" : "Register New Doctor"}
                </h2>
                <p className="text-gray-500">
                  {isDoctor
                    ? "Update medical professional details"
                    : "Add new medical professional to the system"}
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiUser className="mr-2 text-gray-500" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("name", { required: "Name is required" })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="Dr. John Doe"
                    />
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.name && (
                    <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <FiAlertCircle className="mr-2" />
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Email & Phone */}
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
                        })}
                        className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        placeholder="doctor@clinic.com"
                      />
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.email && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiPhone className="mr-2 text-gray-500" />
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
                        <span className="text-gray-400 mr-1">+91</span>
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        {...register("phone", {
                          required: "Enter your number",
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
                        className="w-full px-4 py-3 pl-20 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.phone && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.phone.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Specialty & Experience */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiAward className="mr-2 text-gray-500" />
                      Specialty
                    </label>
                    <input
                      type="text"
                      {...register("specialty", {
                        /* validation */
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="Cardiology"
                    />
                    {errors.specialty && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.specialty.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiCalendar className="mr-2 text-gray-500" />
                      Experience
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="0"
                        defaultValue="0"
                        {...register("experience", {
                          /* validation */
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      {watch("experience") > 0 && (
                        <div
                          className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                          style={{
                            backgroundColor: (() => {
                              const val = Number(watch("experience"));
                              if (val <= 5) return "#e3f2fd";
                              if (val <= 10) return "#e8f5e9";
                              if (val <= 15) return "#fff3e0";
                              return "#fce4ec";
                            })(),
                            color: (() => {
                              const val = Number(watch("experience"));
                              if (val <= 5) return "#1976d2";
                              if (val <= 10) return "#2e7d32";
                              if (val <= 15) return "#ef6c00";
                              return "#ad1457";
                            })(),
                          }}
                        >
                          {watch("experience")} years {" -"}
                          {(() => {
                            const val = Number(watch("experience"));
                            if (val <= 5) return "Good experience";
                            if (val <= 10) return "Great experience";
                            if (val <= 15) return "Excellent experience";
                            return "Veteran in the field";
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Qualifications & Education */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiBookOpen className="mr-2 text-gray-500" />
                      Education
                    </label>
                    <textarea
                      rows="4"
                      {...register("education", {
                        /* validation */
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="Medical education details"
                    />
                    <FiBookOpen className="absolute left-4 top-8 text-gray-400" />
                    {errors.education && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.education.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiAward className="mr-2 text-gray-500" />
                      Qualifications
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {qualificationOptions.map((qual) => (
                        <label
                          key={qual}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={qual}
                            {...register("qualifications", {
                              /* validation */
                            })}
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{qual}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiGlobe className="mr-2 text-gray-500" />
                    Languages Spoken
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["English", "Hindi", "French", "Spanish"].map((lang) => (
                      <label
                        key={lang}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          value={lang}
                          {...register("languages", {
                            /* validation */
                          })}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Date of Birth & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiCalendar className="mr-2 text-gray-500" />
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        {...register("dateOfBirth", {
                          required: "DOB is required",
                        })}
                        className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                      <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.dateOfBirth && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.dateOfBirth.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiUser className="mr-2 text-gray-500" />
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                        className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none bg-white"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.gender && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.gender.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* About Me */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiInfo className="mr-2 text-gray-500" />
                    About Me
                  </label>
                  <textarea
                    rows="4"
                    {...register("about", {
                      maxLength: { value: 500, message: "Max 500 characters" },
                    })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                    placeholder="Brief professional bio..."
                  />
                  {errors.about && (
                    <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <FiAlertCircle className="mr-2" />
                      {errors.about.message}
                    </div>
                  )}
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiCamera className="mr-2 text-gray-500" />
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      {...register("image", {
                        required: "Image URL is required",
                      })}
                      className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder="https://example.com/profile.jpg"
                    />
                    <FiCamera className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.image && (
                    <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <FiAlertCircle className="mr-2" />
                      {errors.image.message}
                    </div>
                  )}
                </div>

                {/* Password for new doctors */}
                {!isDoctor && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiLock className="mr-2 text-gray-500" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        {...register("password", {
                          /* validation */
                        })}
                        className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {isDoctor ? "Update Profile" : "Register Doctor"}
                </button>
              </form>
            </div>
          </div>
        </div>
        {isDoctor && modelOn && (
          <VerifyPassword
            setModelOn={setModelOn}
            isDoctor={isDoctor}
            currentDoctor={currentDoctor}
            handleVerifiedSubmit={handleVerifiedSubmit}
          />
        )}
      </div>
    </>
  );
};

export default AddDoctor;
