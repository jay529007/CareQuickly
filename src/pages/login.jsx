import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import bcrypt from "bcryptjs";
import { saveState } from "../store/localstorage";
import { updateUser } from "../functions/userAPI";
import { toast } from "react-toastify";
import { fetchDoctor } from "../functions/doctorSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  // data fetching
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const doctors = useSelector((state) => state.doctors.doctors);
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDoctor());
  }, [dispatch]);
  //   console.log(users);

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
        // Save user ID and role
        localStorage.setItem("userId", id);
        localStorage.setItem("userType", userType);

        // Role-based logs (or redirection)
        if (userType === "user") {
          console.log("User logged in", matchUser);
          // navigate("/user-dashboard");
        } else if (userType === "admin") {
          console.log("Admin logged in", matchUser);
          // navigate("/admin-dashboard");
        } else if (userType === "doctor") {
          console.log("Doctor logged in", matchUser);
          // navigate("/doctor-dashboard");
        }
        navigate("/");
        reset();
        toast.success("Login Successfully");
        setTimeout(() => window.location.reload(), 100);
      } catch (error) {
        toast.error("Login failed");
        console.error("Error during login:", error);
      }
    } else {
      toast.error("Invalid email or password");
      console.error("No matching account found");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5] px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-center text-[#0066CC] mb-8">
            Welcome
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div>
              <Input
                label="Email Address"
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-red-50 rounded">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Input
                label="Password"
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-red-50 rounded">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-[#3182CE] hover:bg-[#2C5282] transition duration-300 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#90CDF4]"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#718096]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#0066CC] hover:underline font-semibold"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
