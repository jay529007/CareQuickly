import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearState, loadState } from "../store/localstorage";
import { set, useForm } from "react-hook-form";
import Input from "../components/re-usablecomponets/InputFeild";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctor } from "../functions/doctorSlice";
import { fetchUsers } from "../functions/userSlice";
import { updateDoctorSlot } from "../functions/doctorAPI";
import { updateUser } from "../functions/userAPI";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  FiLock,
  FiKey,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
} from "react-icons/fi";

const PasswordChange = () => {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verifyPassword, setVerifyPassword] = useState(false);
  const authdata = loadState();
  const type = authdata.type;
  const id = authdata.id;

  const doctor = useSelector((state) => state.doctors?.doctors);
  const users = useSelector((state) => state.users?.users);
  if (!type) {
    navigate("/login");
    clearState();
  }

  const isUser = type === "user";
  const isAdmin = type === "admin";
  const isDoctor = type === "doctor";
  let currentLoginInfo = null;
  if (isUser || isAdmin) {
    useEffect(() => {
      dispatch(fetchUsers());
    }, []);
    currentLoginInfo = users.find((user) => user.id === id);
  }
  if (isDoctor) {
    useEffect(() => {
      dispatch(fetchDoctor());
    }, []);
    currentLoginInfo = doctor.find((doc) => doc.id === id);
  }
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const newpassword = watch("newpassword");

  const onSubmit = (data) => {
    const isPasswordCorrect = bcrypt.compareSync(
      data.oldpassword,
      currentLoginInfo.password
    );
    if (!verifyPassword) {
      try {
        if (isPasswordCorrect) {
          toast.success("Password is Correct");
          toast.info("now please enter new password");
          setVerifyPassword(true);
        } else {
          toast.error("Incorrect Password");
          setVerifyPassword(false);
          reset();
        }
      } catch (error) {
        toast.error("Something Went Wrong");
        toast.info("Please try Again");
        setVerifyPassword(false);
        reset();
      }
    }

    if (verifyPassword) {
      try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.confirmPassword, salt);
        const updatedInfo = { ...currentLoginInfo, password: hash };
        if (isAdmin || isUser) {
          updateUser(id, updatedInfo);
          toast.success("Password Changed");
          setVerifyPassword(false);
          reset();
          if (isUser) {
            navigate("/");
          } else {
            navigate("/admin/dashboard");
          }
        } else if (isDoctor) {
          updateDoctorSlot(id, updatedInfo);
          toast.success("Password Changed");
          setVerifyPassword(false);
          reset();
          navigate("/doctor/dashboard");
        } else {
          clearState();
          navigate("login");
        }
      } catch (error) {
        toast.error("Something Went Wrong");
        toast.info("Please try Again");
        setVerifyPassword(true);
        reset();
      }
    }
  };
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
                {verifyPassword ? "Set New Password" : "Verify Identity"}
              </h2>
              <p className="text-gray-500">
                {verifyPassword
                  ? "Create a strong, new password"
                  : "Confirm your current password to continue"}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Old Password Field */}
              {!verifyPassword && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <FiKey className="mr-2 text-gray-500" />
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      id="oldpassword"
                      type={showPasswords.old ? "text" : "password"}
                      {...register("oldpassword")}
                      placeholder="Enter current password"
                    />
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => togglePasswordVisibility("old")}
                    >
                      {showPasswords.old ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.oldpassword && (
                    <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                      <FiAlertCircle className="mr-2" />
                      {errors.oldpassword.message}
                    </div>
                  )}
                </div>
              )}

              {/* New Password Fields */}
              {verifyPassword && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiKey className="mr-2 text-gray-500" />
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        id="newpassword"
                        type={showPasswords.new ? "text" : "password"}
                        {...register("newpassword", {
                          required: "Password is Required",
                          validate: {
                            minLength: (v) =>
                              v.length >= 8 || "Minimum 8 characters",

                            hasNumber: (v) =>
                              /\d/.test(v) || "At least one number",

                            hasSpecial: (v) =>
                              /[!@#$%^&*(),.?":{}|<>]/.test(v) ||
                              "At least one special character",
                          },
                        })}
                        className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                        placeholder="Create new password"
                      />
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? (
                          <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.newpassword && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.newpassword.message}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <FiKey className="mr-2 text-gray-500" />
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === newpassword || "Passwords do not match",
                        })}
                        className="w-full px-4 py-3 pl-11 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                        placeholder="Confirm new password"
                      />
                      <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? (
                          <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                        <FiAlertCircle className="mr-2" />
                        {errors.confirmPassword.message}
                      </div>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium text-blue-800">
                      Password Requirements:
                    </p>
                    <ul className="text-sm space-y-1">
                      <li
                        className={`flex test-sm items-center ${
                          newpassword?.length >= 8
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-xl pr-3 py-0.5">
                          {newpassword?.length >= 8 ? (
                            <FiCheckCircle className="text-green-500" />
                          ) : (
                            <FiAlertCircle className="text-red-500" />
                          )}
                        </span>
                        Minimum 8 characters
                      </li>
                      <li
                        className={`flex test-sm items-center ${
                          /\d/.test(newpassword)
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-xl pr-3 py-0.5">
                          {/\d/.test(newpassword) ? (
                            <FiCheckCircle className="text-green-500" />
                          ) : (
                            <FiAlertCircle className="text-red-500" />
                          )}
                        </span>
                        At least one number
                      </li>
                      <li
                        className={`flex test-sm items-center ${
                          /[!@#$%^&*(),.?":{}|<>]/.test(newpassword)
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="text-xl pr-3 py-0.5">
                          {/[!@#$%^&*(),.?":{}|<>]/.test(newpassword) ? (
                            <FiCheckCircle className="text-green-500" />
                          ) : (
                            <FiAlertCircle className="text-red-500" />
                          )}
                        </span>
                        At least one special character
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  {verifyPassword ? "Update Password" : "Continue"}
                </button>

                {verifyPassword && (
                  <button
                    type="button"
                    onClick={() => setVerifyPassword(false)}
                    className="w-full py-2.5 text-gray-600 hover:text-blue-600 font-medium flex items-center justify-center gap-2"
                  >
                    <FiArrowLeft />
                    Back to verification
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordChange;
