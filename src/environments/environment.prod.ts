export const environment = {
  production: true,


  
  IsLoggedIn: () => {
    if (typeof localStorage.getItem("userEmail") == "undefined" || localStorage.getItem("userEmail") == null || localStorage.getItem("userEmail") == "") {
      return false;
    }
    else {
      return true;
    }
  }
};
