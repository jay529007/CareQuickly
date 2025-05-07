import React from "react";
import { useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { addUser } from "../functions/userAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Dropdown from "../components/re-usablecomponets/dropdown";

const Register = () => {
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
    "text-[#D14343] text-sm w-fit p-1 font-medium uppercase mt-2 bg-red-50 rounded";

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#EBF8FF] px-4 py-4">
        <div className="w-full max-w-4xl bg-white p-10 rounded-3xl shadow-2xl border border-[#E2E8F0]">
          <h2 className="text-3xl font-extrabold text-center text-[#2B6CB0] mb-8">
            Create your account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Full Name */}
            <div>
              <Input
                label="Full Name"
                type="text"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className={errorClass}>{errors.name.message}</p>
              )}
            </div>
            {/* Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      message: "Number must start with 6 - 9",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  {...register("password", {
                    required: "Password is required",
                  })}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register("dob", {
                    required: "Date of birth is required",
                  })}
                />
                {errors.dob && (
                  <p className={errorClass}>{errors.dob.message}</p>
                )}
              </div>

              {/* Gender (Dropdown) */}
              <div>
                <label
                  htmlFor="gender"
                  className="block mb-2 text-slate-700 font-semibold"
                >
                  Gender
                </label>
                <select
                  className="bg-[#F7FAFC] border border-[#CBD5E0] text-[#4A5568] text-sm rounded-lg focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] block w-full p-2.5"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  {...register("emergency_contact.phone")}
                />
              </div>
            </div>
            {/*  Address */}
            <label className="block mb-2 text-slate-700 font-semibold">
              Address
            </label>
            <textarea
              rows="3"
              className="bg-[#F7FAFC] border border-[#CBD5E0]
            text-[#4A5568] text-sm rounded-lg focus:ring-[#3182CE]
            focus:border-[#3182CE] block w-full p-3"
              {...register("address", {
                minLength: {
                  value: 10,
                  message: "Too short! Add more detail.",
                },
              })}
            />
            {/* Medical History */}
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">
                Medical History
              </label>
              <textarea
                rows="3"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                {...register("medical_history")}
              />
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#3182CE] hover:bg-[#2C5282] transition duration-300 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#90CDF4]"
            >
              Register
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#718096]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#3182CE] hover:underline font-semibold"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
