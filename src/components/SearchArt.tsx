import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { IArtData } from "./IArtData";
const SearchArt = () => {
  const [query, setQuery] = useState("");
  const [objects, setObjects] = useState([]);
  const [artData, setArtData] = useState<IArtData[]>([]);
  // add lopading state

  const URL = "https://collectionapi.metmuseum.org/public/collection/v1";

  const getObjectsFromSearch = () => {
    axios
      .get(`${URL}/search`, {
        params: {
          hasImages: true,
          artistOrCulture: true,
          q: query,
        },
      })
      .then((res) => {
        const objectIDs = res.data.objectIDs.slice(0, 70);
        setObjects(objectIDs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getArtDataWaiting = () => {
    const pendingData: Promise<IArtData>[] = [];
    for (let i of objects) {
      pendingData.push(
        axios
          .get(`${URL}/objects/${i}`)
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            console.log(err);
          })
      );
    }
    Promise.all(pendingData).then((res) => {
      setArtData(res);
    });
  };

  useEffect(getArtDataWaiting, [objects]);

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("#searchText") as HTMLInputElement;
    setQuery(input.value);
    getObjectsFromSearch();
  };

  return (
    <div className="searchArt">
      <form className="searchForm" onSubmit={(event) => search(event)}>
        <label htmlFor="query"></label>
        <input
          type="text"
          name="query"
          id="searchText"
          className="searchInput"
          placeholder={`Try "Monet" or "Van Gogh"`}
          // value={query}
          // onChange={(e) => setQuery(e.target.value)}
        />
        <button className="searchButton" type="submit">
          Search
        </button>
      </form>
      <div className="art-container">
        {artData.map((art) => (
          <Card key={art.objectID} art={art} query={query} />
        ))}
      </div>
    </div>
  );
};

export default SearchArt;
