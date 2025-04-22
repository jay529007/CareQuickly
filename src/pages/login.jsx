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
    <div className="flex justify-center items-center min-h-screen bg-sky-50">
      <div className="w-full max-w-md bg-sky-200 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <Input
              label="Email: "
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
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
              {...register("password", {
                required: "Password is required",
              })}
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
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
