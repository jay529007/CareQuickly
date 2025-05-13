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

const PasswordChange = () => {
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
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("newpassword");
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
            navigate("/home");
            
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
      <div className="flex justify-center py-[10%]">
        <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
          <form
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Password Input */}
            <div>
              <Input
                label="Old Password"
                autoComplete="off"
                id="oldpassword"
                type="password"
                {...register("oldpassword", {
                  required: "Old Password is required",
                })}
              />
              {errors.oldpassword && (
                <p className="text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-red-50 rounded">
                  {errors.oldpassword.message}
                </p>
              )}
            </div>
            {verifyPassword && (
              <>
                <div>
                  <Input
                    label="New Password"
                    autoComplete="off"
                    id="newpassword"
                    type="password"
                    {...register("newpassword", {
                      required: "New Password is required",
                    })}
                  />
                  {errors.newpassword && (
                    <p className="text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-red-50 rounded">
                      {errors.newpassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="New Password"
                    autoComplete="off"
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm w-fit p-1 font-medium uppercase mt-2 bg-red-50 rounded">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-[#3182CE] hover:bg-[#2C5282] transition duration-300 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#90CDF4]"
              >
                {verifyPassword ? "Change Password" : "Verify"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordChange;
