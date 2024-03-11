export const toArrayQueryObject = (valueArr, queryName = "sortList") => {
  let result = {};

  if (valueArr == null || valueArr.length == 0) {
    return result;
  }

  valueArr.forEach((value, index) => {
    if (typeof value === "object") {
      result[`${queryName}[${index}].field`] = value.field;
      result[`${queryName}[${index}].order`] = value.order;
    } else {
      result[`${queryName}[${index}]`] = value;
    }
  });
  return result;
};

export const toPagingQueryObject = (searchParams) => {

  let result = {};

  if (!searchParams) {
    return result;
  }

  const params = new URLSearchParams(searchParams);

  if (params.get("p")) {
    result.p = params.get("p");
  }
  if (params.get("s")) {
    result.s = params.get("s");
  }
  return result;
};

/**
 * convert this string: sortList%5B0%5D.field=productBrand&sortList%5B0%5D.order=1
 * into [{field:productBrand, order: 1}]
 *
 */
export const toSortQueryObject = (searchString) => {
  const params = new URLSearchParams(searchString);

  const sortList = [];

  params.forEach((value, key) => {
    if (key.startsWith("sortList")) {
      // format ex: sortList[0].order
      const match = key.match(/\[(\d+)\]\.(\w+)/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        if (!sortList[index]) {
          sortList[index] = {};
        }
        sortList[index][field] = value;
      }
    }
  });

  return sortList;
};
