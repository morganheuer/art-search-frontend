import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import { IArtData } from "./IArtData";
const SearchArt = () => {
  const [query, setQuery] = useState("");
  const [objects, setObjects] = useState([]);
  const [artData, setArtData] = useState<IArtData[]>([]);
  // add lopading state

  const URL = "https://collectionapi.metmuseum.org/public/collection/v1";

  const getObjectsFromSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);
    axios
      .get(`${URL}/search`, {
        params: {
          // isPublicDomain: true,
          // artistDisplayName: query,
          q: query,
          // isHighlight: true,
          // departmentId: 11,
          hasImages: true,
          // searchField: "ArtistCulture",

          // artistOrCulture: true,
        },
      })
      .then((res) => {
        const objectIDs = res.data.objectIDs.slice(0, 50);
        console.log(objectIDs);
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
            console.log(res.data.primaryImageSmall);
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

  return (
    <div className="searchArt">
      <form className="searchForm" onSubmit={getObjectsFromSearch}>
        <label htmlFor="query"></label>
        <input
          type="text"
          name="query"
          className="searchInput"
          placeholder={`Try "Monet" or "Van Gogh"`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
