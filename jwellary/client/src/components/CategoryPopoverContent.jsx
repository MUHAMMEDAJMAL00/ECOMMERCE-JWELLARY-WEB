// components/CategoryPopoverContent.jsx
import React from "react";
import { Link } from "react-router-dom";

const CategoryPopoverContent = ({
  categories = [],
  titleImage,
  extraText,
  filterFn,
}) => {
  const filtered = filterFn ? categories.filter(filterFn) : categories;

  const leftItems = filtered.slice(0, Math.ceil(filtered.length / 2));
  const rightItems = filtered.slice(Math.ceil(filtered.length / 2));

  return (
    <div>
      <div className="mainpop ">
        <div className="vertical-line"></div>
        <div className="row ">
          <hr className="headlinepop" />
          <div className="col-lg-6 col-xl-6">
            {leftItems.map((cat) => (
              <Link
                to={`/categorydetail/${cat._id}`}
                key={cat._id}
                className="text-decoration-none text-black"
              >
                <div className="poptext">{cat.name}</div>
              </Link>
            ))}
          </div>
          <div className="col-lg-6 col-xl-6">
            {rightItems.map((cat) => (
              <Link
                to={`/categorydetail/${cat._id}`}
                key={cat._id}
                className="text-decoration-none text-black"
              >
                <div className="poptext">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="p-3">
          {titleImage && (
            <div className="secondpop ">
              <img
                className="imagesecondpop"
                src={titleImage}
                alt="promotion"
              />
              {extraText?.map((txt, idx) => (
                <div key={idx} className="secondpoptext">
                  {txt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPopoverContent;
