import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import Input from "./re-usablecomponets/InputFeild";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
          {/* Modal Header */}
          <div className="flex justify-end ">
            <div className=" bg-gradient-to-b from-white to-white/80">
              <button
                onClick={() => setModelOn(false)}
                aria-label="Close modal"
                className="rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FiX
                  size={24}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                />
              </button>
            </div>
          </div>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Password Input */}
            <div>
              <Input
                label="Password"
                autoComplete="off"
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
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
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyPassword;
