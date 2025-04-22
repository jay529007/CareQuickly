export const loadState = () => {
  try {
    return localStorage.getItem("userId");
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
