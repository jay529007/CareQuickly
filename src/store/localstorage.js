export const loadState = () => {
  try {
    const id = localStorage.getItem("userId");
    const type = localStorage.getItem("userType");
    const authdata = {
      id: id,
      type: type,
    };
    return authdata;
  } catch (error) {
    console.error("could not load local state", error);
    return undefined;
  }
};

export const saveState = (userId) => {
  try {
    localStorage.setItem("userId", userId);
  } catch (error) {
    console.error("could not save local state", error);
  }
};

export const clearState = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("could not clear local state", error);
  }
};
