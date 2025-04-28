import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../functions/userSlice";
import bcrypt from "bcryptjs";
import { saveState } from "../store/localstorage";
import { updateUser } from "../functions/userAPI";

const LoginPage = () => {
  const navigate = useNavigate();
  // data fetching
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  //   console.log(users);

  // Setup useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (formdata) => {
    let matchuser = await users.find((user) => {
      const match =
        user.email === formdata.email &&
        bcrypt.compareSync(formdata.password, user.password);
      return match;
    });
    if (matchuser) {
      const id = matchuser.id;
      try {
        // await updateUser(id, matchuser);
        console.log("user login");
        saveState(id);
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("error 400");
      }
    } else {
      console.error("error");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-sky-100 via-blue-100 to-sky-100 px-4">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8">
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
                <p className="text-red-500 text-sm mt-1">
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-semibold"
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
