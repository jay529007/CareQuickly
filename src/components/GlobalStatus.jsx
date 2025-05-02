import { useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../pages/error/loading";

const GlobalStatus = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.users);
  const doctorState = useSelector((state) => state.doctors);

  const isLoading = userState.loading || doctorState.loading;
  const error = userState.error || doctorState.error;

  useEffect(() => {
    if (error) {
      navigate("/nouserfound");
    }
  }, [error, navigate]); // 🔥 add dependencies!

  if (isLoading) {
    console.log("Loading...");
    return (
      <>
        <div className="flex justify-center items-center max-h-screen h-[200dvh]">
          <AiOutlineLoading className="size-9 text-gray-500 animate-spin" />
        </div>
      </>
    );
  }

  return null;
};

export default GlobalStatus;
