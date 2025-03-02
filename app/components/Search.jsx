import React from "react";
import Style from "../styles/HomePage.module.css";
import { AiOutlineSearch } from "react-icons/ai";

const Search = () => {
  return (
    <div className={Style.navbar_container_right_search}>
      <div className={Style.navbar_container_right_search_input}>
        <input
          class="input"
          type="text"
          placeholder="Search certificate by ID or Candidate's name"
          title="Search certificate by ID or Candidate's name"
        />
        <AiOutlineSearch
          className={Style.navbar_container_right_search_box_send}
          onClick={() => stateHandle()}
        />
      </div>
    </div>
  );
};

export default Search;
