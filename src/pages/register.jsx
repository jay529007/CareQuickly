import React from "react";
import { useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { addUser, updateUser } from "../functions/userAPI";

const Register = () => {
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
    addUser(safeData);
  };

  const errorClass =
    "text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-gray-200/50";

  return (
    <div className="flex justify-center py-[1%] bg-indigo-50 items-center min-h-screen">
      <div className="w-full max-w-screen-lg bg-indigo-200 p-10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Register
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <Input
              label="Full Name"
              type="text"
              className=""
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className={errorClass}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                label="Phone Number"
                type="number"
                placeholder="10-digit number"
                {...register("number", {
                  required: "Enter your number",
                  pattern: {
                    value: /^[6-9]/,
                    message: "Number must start with 6-9",
                  },
                  validate: {
                    isTenDigits: (value) =>
                      value.length === 10 || "Phone number must be 10 digits",
                  },
                })}
              />
              {errors.number && (
                <p className={errorClass}>{errors.number.message}</p>
              )}
            </div>
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className={errorClass}>{errors.password.message}</p>
              )}
            </div>

            <div>
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className={errorClass}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* DOB + Gender */}
          <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Date of Birth"
                type="date"
                {...register("dob", { required: "Date of birth is required" })}
              />
              {errors.dob && <p className={errorClass}>{errors.dob.message}</p>}
            </div>

            <div className="place-content-end">
              <label
                htmlFor="gender"
                className="block text-md font-sm text-black"
              >
                Gender
              </label>
              <select
                className="mt-2.5 block bg-white w-full p-2  border-gray-300 rounded-md"
                {...register("gender", { required: "Gender is required" })}
              >
                <option hidden value="">
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className={errorClass}>{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Emergency Contact Name"
                {...register("emergency_contact.name")}
              />
            </div>

            <div>
              <Input
                label="Emergency Contact Number"
                type="text"
                {...register("emergency_contact.phone", {})}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="inline-block mb-1 text-black pl-1">
              Address:
            </label>
            <textarea
              rows="2"
              className="w-full bg-slate-50 px-4 py-2 mt-1 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("address", {
                minLength: {
                  value: 10,
                  message: "Too short! Add more detail.",
                },
              })}
            />
            {errors.address && (
              <p className={errorClass}>{errors.address.message}</p>
            )}
          </div>

          {/* Medical History */}
          <div>
            <label className="inline-block mb-1 text-black pl-1">
              Medical History:
            </label>
            <textarea
              rows="2"
              className="w-full bg-slate-50 px-4 py-2 mt-1 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("medical_history")}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Register
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
