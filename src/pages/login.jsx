import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { fetchDoctor } from "../functions/doctorSlice";
import { loadState } from "../store/localstorage";
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const authdata = loadState();
  const params = useParams();
  // data fetching
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const doctors = useSelector((state) => state.doctors.doctors);
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDoctor());
  }, [dispatch]);

  // Setup useForm hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (formdata) => {
    let matchUser = users.find((user) => {
      return (
        user.email === formdata.email &&
        bcrypt.compareSync(formdata.password, user.password)
      );
    });

    let userType = null;

    // Determine if user or admin
    if (matchUser) {
      userType = matchUser.role === "admin" ? "admin" : "user";
    } else {
      // If not in users, check doctors
      matchUser = doctors.find((doc) => {
        return (
          doc.email === formdata.email &&
          bcrypt.compareSync(formdata.password, doc.password)
        );
      });

      if (matchUser) {
        userType = "doctor";
      }
    }

    if (matchUser) {
      const id = matchUser.id;

      try {
        localStorage.setItem("userId", id);
        localStorage.setItem("userType", userType);

        // Role-based logs (or redirection)
        if (userType === "user") {
          // console.log("User logged in", matchUser);
          navigate("/");
        } else if (userType === "admin") {
          // console.log("Admin logged in", matchUser);
          navigate("/admin/dashboard");
        } else if (userType === "doctor") {
          // console.log("Doctor logged in", matchUser);
          navigate("/doctor/dashboard");
        }
        reset();
        toast.success("Login Successfully");
        // setTimeout(() => window.location.reload(), 100);
      } catch (error) {
        toast.error("Login failed");
        reset();
        console.error("Error during login:", error);
      }
    } else {
      toast.error("Invalid email or password");
      reset();
      console.error("No matching account found");
    }
  };
  useEffect(() => {
    if (authdata.type === "user") navigate("/");
    else if (authdata.type === "admin") navigate("/admin/dashboard");
    else if (authdata.type === "doctor") navigate("/doctor/dashboard");
  }, [params]);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 transform hover:shadow-2xl">
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 w-fit p-3 rounded-2xl shadow-lg">
                <FiLock className="text-white w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mt-4">
                Welcome Back
              </h2>
              <p className="text-gray-500">
                Sign in to continue to your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiMail className="mr-2 text-gray-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                    placeholder="name@example.com"
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

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <FiLock className="mr-2 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                    <FiAlertCircle className="mr-2" />
                    {errors.password.message}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Sign In
                <FiArrowRight className="inline-block ml-2" />
              </button>

              {/* Footer Links */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Create account
                  </Link>
                </p>
                <p className="mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Forgot password?
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

export default LoginPage;
