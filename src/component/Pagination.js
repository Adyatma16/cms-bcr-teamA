import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const PaginationCar = (props) => {
  const { page, setPage, data } = props;
  const count = Math.ceil(data?.data?.count / 10);

  return (
    <Pagination>
      {Array.from({ length: count }).map((_, index) => (
        <PaginationItem active={page === index + 1} key={index}>
          <PaginationLink onClick={() => setPage(index + 1)}>
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
    </Pagination>
  );
};

export default PaginationCar;
