export const toArrayQueryString = (valueArr, queryName = "sortList") => {
    let result = "";
  
    if (valueArr == null || valueArr.length == 0) {
      return result;
    }
  
    valueArr.forEach((value, index) => {
      if (typeof value === "object") {
        result +=
          encodeURIComponent(`${queryName}[${index}].field`) + `=${value.field}&`;
        result +=
          encodeURIComponent(`${queryName}[${index}].order`) + `=${value.order}&`;
      } else {
        result += encodeURIComponent(`${queryName}[${index}]`) + `=${value}&`;
      }
    });
    if (result.endsWith("&")) {
      // Removes the last character
      result = result.slice(0, -1);
    }
    return result;
  };