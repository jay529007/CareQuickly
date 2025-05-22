import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import Input from "./re-usablecomponets/InputFeild";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { FiShield, FiKey,FiLock , FiX } from "react-icons/fi";

const VerifyPassword = ({
  setModelOn,
  isDoctor,
  currentDoctor,
  handleVerifiedSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    let isPasswordCorrect = false;
    if (isDoctor) {
      isPasswordCorrect = bcrypt.compareSync(
        data.password,
        currentDoctor.password
      );
    }

    try {
      if (isPasswordCorrect) {
        handleVerifiedSubmit();
        // setisVerify(true);
        setModelOn(false);
        reset();
      } else {
        console.error("error");
        toast.error("Password is incorrect");
        toast.info("Check Password again");
        reset();
      }
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error(error);
      reset();
    }
  };
  return (
    <>
      <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-100">
          {/* Close Button */}
          <button
            onClick={() => setModelOn(false)}
            className="absolute -top-3 -right-3 bg-white hover:bg-gray-50 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiX className="w-6 h-6 text-gray-600 hover:text-gray-900" />
          </button>

          {/* Security Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg -mt-12">
              <FiLock className="w-8 h-8 text-white" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Input */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <FiKey className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                  <FiAlertCircle className="flex-shrink-0 mr-2" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Password
            </button>

            {/* Security Tips */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <p className="inline-flex items-center space-x-1">
                <FiShield className="text-green-500" />
                <span>Must be at least 8 characters</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyPassword;
