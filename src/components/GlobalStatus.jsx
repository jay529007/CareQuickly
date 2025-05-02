import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
  }, [error]);

  if (isLoading) {
    if (!isLoading) return;
    console.log("Loading...");
    return (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center p-6 space-y-4 bg-white bg-opacity-80 rounded-2xl shadow-lg">
            <AiOutlineLoading className="w-12 h-12 text-gray-700 animate-spin" />
            <span className="text-gray-800 font-medium">Loading…</span>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default GlobalStatus;
