import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../components/re-usablecomponets/InputFeild";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { addDoctor } from "../../functions/doctorAPI";
const qualificationOptions = [
  "MBBS",
  "MD Dermatology",
  "MS Orthopedics",
  "DM Cardiology",
  "DNB Psychiatry",
];

const AddDoctor = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  //   const password = watch("password");
  const onSubmit = (data) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);
    data.password = hash;
    console.log(data);
    try {
      addDoctor(data);
      toast.success("Registered Successfully");
      reset();
    } catch (error) {
      toast.error(error);
      reset();
    }
  };
  const errorClass =
    "text-[#D14343] text-sm w-fit p-1 font-medium uppercase mt-2 bg-red-50 rounded";
  return (
    <>
      <div className=" bg-[#EBF8FF] ">
        {/* back button */}
        <div className="pt-6 px-[5%] lg:px-[15%] xl:px-0 xl:ml-[24%]">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium group"
            aria-label="Return to dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        <div className="flex justify-center py-4 items-center min-h-screen">
          <div className="w-full max-w-4xl bg-white p-10 rounded-3xl shadow-2xl border border-[#E2E8F0]">
            <h2 className="text-3xl font-extrabold text-center text-[#2B6CB0] mb-8">
              Add Doctor
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Name */}
              <div>
                <Input
                  label="Full Name"
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className="w-full p-2 border rounded"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Input
                    label="Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                {/* Phone Number */}
                <div>
                  <Input
                    label="Phone Number"
                    type="text"
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
                    className="w-full p-2 border rounded"
                  />
                  {errors.phone && (
                    <p className="text-red-500">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Specialty & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Input
                    label="Specialty"
                    type=""
                    {...register("specialty", {
                      required: "Specialty is required",
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {errors.specialty && (
                    <p className="text-red-500">{errors.specialty.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Experience</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0"
                    defaultValue="0"
                    {...register("experience", {
                      required: "Experience is required",
                      min: { value: 1, message: "Must be at least 1 year" },
                      max: { value: 20, message: "Must not exceed 20 years" },
                    })}
                    className="w-full p-2 border rounded"
                  />
                  {watch("experience") > 0 && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "8px",
                        fontWeight: "bold",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        backgroundColor: (() => {
                          const val = Number(watch("experience"));
                          if (val <= 5) return "#e0f7fa"; // light blue
                          if (val <= 10) return "#e8f5e9"; // light green
                          if (val <= 15) return "#fff3e0"; // light orange
                          return "#fce4ec"; // light pink
                        })(),
                        color: (() => {
                          const val = Number(watch("experience"));
                          if (val <= 5) return "#00796b"; // teal
                          if (val <= 10) return "#388e3c"; // green
                          if (val <= 15) return "#f57c00"; // orange
                          return "#ad1457"; // pink
                        })(),
                      }}
                    >
                      {watch("experience")} —{" "}
                      {(() => {
                        const val = Number(watch("experience"));
                        if (val <= 5) return "Good experience";
                        if (val <= 10) return "Great experience";
                        if (val <= 15) return "Excellent experience";
                        return "Veteran in the field";
                      })()}
                    </span>
                  )}

                  {errors.experience && (
                    <p className="text-red-500">{errors.experience.message}</p>
                  )}
                </div>
              </div>
              {/* Qualifications & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Education */}
                <div className="">
                  <label className="block mb-2 font-semibold">Education</label>
                  <textarea
                    rows="4"
                    {...register("education", {
                      required: "Education is required",
                    })}
                    placeholder="AIIMS, University of Delhi"
                    className="bg-[#F7FAFC] border border-[#CBD5E0]
                    text-[#4A5568] text-sm rounded-lg focus:ring-[#3182CE]
                    focus:border-[#3182CE] block w-full p-3"
                  />
                  {errors.education && (
                    <p className="text-red-500">{errors.education.message}</p>
                  )}
                </div>
                {/* Qualifications */}
                <div className="">
                  <h3 className="mb-4 font-semibold text-gray-900">
                    Qualifications
                  </h3>
                  <ul className=" text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                    {qualificationOptions.map((qual) => {
                      const id = `${qual
                        .replace(/\s+/g, "-")
                        .toLowerCase()}-qualification`;
                      return (
                        <li
                          key={qual}
                          className="w-full border-b border-gray-200 rounded-t-lg"
                        >
                          <div className="flex items-center ps-3">
                            <input
                              type="checkbox"
                              id={id}
                              value={qual}
                              {...register("qualifications", {
                                required: "Select at least one qualification",
                              })}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                            />
                            <label
                              htmlFor={id}
                              className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                            >
                              {qual}
                            </label>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              {/* Languages */}
              <div>
                <h3 className="mb-4 font-semibold text-gray-900 ">Languages</h3>
                <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg flex ">
                  {/* English */}
                  <li className="w-full border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center ps-3">
                      <input
                        type="checkbox"
                        id="english-language"
                        value="English"
                        {...register("languages", {
                          required: "Select at least one language",
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                      />
                      <label
                        htmlFor="english-language"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                      >
                        English
                      </label>
                    </div>
                  </li>
                  {/* Hindi */}
                  <li className="w-full border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center ps-3">
                      <input
                        type="checkbox"
                        id="Hindi-language"
                        value="Hindi"
                        {...register("languages", {
                          required: "Select at least one language",
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                      />
                      <label
                        htmlFor="Hindi-language"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                      >
                        Hindi
                      </label>
                    </div>
                  </li>
                  {/* French */}
                  <li className="w-full border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center ps-3">
                      <input
                        type="checkbox"
                        id="French-language"
                        value="French"
                        {...register("languages", {
                          required: "Select at least one language",
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                      />
                      <label
                        htmlFor="French-language"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                      >
                        French
                      </label>
                    </div>
                  </li>
                  {/* Spanish */}
                  <li className="w-full border-b border-gray-200 rounded-t-lg">
                    <div className="flex items-center ps-3">
                      <input
                        type="checkbox"
                        id="Spanish-language"
                        value="Spanish"
                        {...register("languages", {
                          required: "Select at least one language",
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                      />
                      <label
                        htmlFor="Spanish-language"
                        className="w-full py-3 ms-2 text-sm font-medium text-gray-900"
                      >
                        Spanish
                      </label>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Password */}
              <div>
                <Input
                  label="Password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-2 font-semibold">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    {...register("dateOfBirth", {
                      required: "Date of birth is required",
                    })}
                    className="bg-[#F7FAFC] border border-[#CBD5E0] text-[#4A5568] text-sm rounded-lg focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] block w-full p-2.5"
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-semibold">Gender</label>
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className="bg-[#F7FAFC] border border-[#CBD5E0] text-[#4A5568] text-sm rounded-lg focus:ring-1 focus:ring-[#000000] focus:border-[#000000] block w-full p-2.5"
                  >
                    <option value="" hidden>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500">{errors.gender.message}</p>
                  )}
                </div>
              </div>

              {/* about me */}
              <div>
                <label className="block mb-2 font-semibold">About ME</label>
                <textarea
                  rows="4"
                  {...register("about", {
                    maxLength: { value: 500, message: "Max 500 characters" },
                  })}
                  className="bg-[#F7FAFC] border border-[#CBD5E0]
            text-[#4A5568] text-sm rounded-lg focus:ring-[#3182CE]
            focus:border-[#3182CE] block w-full p-3"
                />
                {errors.about && (
                  <p className="text-red-500">{errors.about.message}</p>
                )}
              </div>

              {/* Image URL */}
              <div>
                <Input
                  label="Image URL"
                  type="url"
                  {...register("image", { required: "Image URL is required" })}
                  className="w-full p-2 border rounded"
                />
                {errors.image && (
                  <p className="text-red-500">{errors.image.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3182CE] hover:bg-[#2C5282] transition duration-300 text-white font-bold rounded-xl"
              >
                Add Doctor
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDoctor;
