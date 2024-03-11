import React from "react";
import classNames from "classnames/bind";
import styles from "./ProductDetail.module.scss";
const ProductDetail = () => {
  const cx = React.useMemo(() => classNames.bind(styles), []);

  return (
    <section className="grid grid-cols-12 gap-4 pt-3 px-4">
      <div>aaaassssss</div>
    </section>
  );
};

export default ProductDetail;
