import React from "react";
import "./App.css";
import SearchArt from "./components/SearchArt";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [query, setQuery] = useState("Vincent van Gogh");
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const getAllArt = () => {
    axios
      .get(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}&hasImages=true&isPublicDomain=true`
      )
      .then((res) => {
        console.log(res.data.objectIDs);
        setData(res.data.objectIDs.slice(0, 10));
        getImage();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getImage = () => {
    axios
      .get(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${data[4]}`
      )
      .then((res) => {
        console.log(res.data.primaryImageSmall);
        setImage(res.data.primaryImageSmall);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // getImage(436529);
  useEffect(() => {
    getAllArt();
  }, []);
  const displayData = () => {
    return data ? (
      data.map((data) => {
        return (
          <div>
            <h3>{data}</h3>
          </div>
        );
      })
    ) : (
      <h3>No data yet</h3>
    );
  };

  return (
    <div className="App">
      <SearchArt />
      <img src={image} alt="artwork"></img>
      <div>{displayData()}</div>
    </div>
  );
}

export default App;
