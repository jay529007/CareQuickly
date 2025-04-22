import { useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";

const GlobalStatus = () => {
  const userState = useSelector((state) => state.users);
  const doctorState = useSelector((state) => state.doctors);

  const isLoading = userState.loading || doctorState.loading;
  const error = userState.error || doctorState.error;

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-md z-50">
        {console.log("loading...")}
        <AiOutlineLoading className="size-9 text-gray-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-red-400 px-4 py-2 rounded shadow-md z-50">
        {error}
      </div>
    );
  }

  return null;
};

export default GlobalStatus;
