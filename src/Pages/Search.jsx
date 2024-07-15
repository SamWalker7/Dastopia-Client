import React from "react";
import SearchBar from "../components/Search/SearchBar";
import Filters from "../components/Search/Filters";
import ResultsGrid from "../components/Search/ResultsGrid";

const Search = () => {
  const gridContainerStyle = {
    display: "flex",
    marginTop: "20px",
    width: "100%",
  };

  const colSpanStyle = {
    width: "50%",
  };

  const mapContainerStyle = {
    backgroundColor: "white",
    padding: "16px",
    width: "50%",
    marginLeft: "50px",
  };

  const mapDetailsStyle = {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "20px",
  };

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <main>
        <div>
          <SearchBar />
          <Filters />
          <div style={gridContainerStyle}>
            <div style={colSpanStyle}>
              <ResultsGrid />
            </div>
            <div style={mapContainerStyle}>
              <div style={mapDetailsStyle}>
                Map details will be displayed here.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Search;
