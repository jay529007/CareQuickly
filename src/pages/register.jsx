import React from "react";
import { useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import { Link } from "react-router-dom";
import bcrypt from "bcryptjs";
import { addUser } from "../functions/userAPI";
import { useNavigate } from "react-router-dom";

const Register = () => {
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
    addUser(safeData);
    console.log("Sucessfull-added");
    navigate("/");
    window.location.reload();
  };

  const errorClass =
    "text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-gray-200/50";

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 px-4 py-4">
  <div className="w-full max-w-4xl bg-white p-10 rounded-3xl shadow-2xl">
    <h2 className="text-4xl font-extrabold text-center text-indigo-600 mb-10">
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
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
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
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
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
          {errors.number && <p className={errorClass}>{errors.number.message}</p>}
        </div>
      </div>

      {/* Password + Confirm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        <div>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => value === password || "Passwords do not match",
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
            {...register("dob", { required: "Date of birth is required" })}
          />
          {errors.dob && <p className={errorClass}>{errors.dob.message}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block mb-2 text-gray-700 font-semibold">
            Gender
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            {...register("gender", { required: "Gender is required" })}
          >
            <option hidden value="">
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
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

      {/* Address */}
      <div>
        <label className="block mb-2 text-gray-700 font-semibold">Address</label>
        <textarea
          rows="3"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          {...register("address", {
            minLength: {
              value: 10,
              message: "Too short! Add more detail.",
            },
          })}
        />
        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
      </div>

      {/* Medical History */}
      <div>
        <label className="block mb-2 text-gray-700 font-semibold">Medical History</label>
        <textarea
          rows="3"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          {...register("medical_history")}
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Register
        </button>
      </div>
    </form>

    <div className="mt-8 text-center">
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline font-semibold">
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
