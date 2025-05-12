import { loadState } from "../../store/localstorage";
import AddDoctor from "../admin/addDoctor";

const UpdateProfile = () => {
  const authdata = loadState();
  const isDoctor = authdata.id;

  return (
    <div>
      <AddDoctor isDoctor={isDoctor} />
    </div>
  );
};

export default UpdateProfile;
