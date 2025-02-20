import { toast } from "react-toastify";

export const showToast = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  };

  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  } else if (type === "warn") {
    toast.warn(message, options);
  } else if (type === "info") {
    toast.info(message, options);
  }
};
