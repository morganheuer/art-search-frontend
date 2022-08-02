import { useEffect, useState } from "react";
import axios from "axios";
const SearchArt = () => {
  const [query, setQuery] = useState("");
  const [objects, setObjects] = useState([]);
  const [artData, setArtData] = useState<any[]>([]);
  // add lopading state

  const URL = "https://collectionapi.metmuseum.org/public/collection/v1";

  const getObjectsFromSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(query);
    axios
      .get(`${URL}/search`, {
        params: {
          q: query,
          isHighlight: true,
          hasImages: true,
          isPublicDomain: true,
          artistDisplayName: query,
        },
      })
      .then((res) => {
        const objectIDs = res.data.objectIDs.slice(0, 20);
        console.log(objectIDs);
        setObjects(objectIDs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getArtDataWaiting = () => {
    const pendingData: Promise<{}>[] = [];
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
      console.log(artData);
    });
  };

  useEffect(getArtDataWaiting, [objects]);

  return (
    <div>
      <form onSubmit={getObjectsFromSearch}>
        <label htmlFor="query"></label>
        <input
          type="text"
          name="query"
          placeholder={`Try "Monet" or "Van Gogh"`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {artData.map((art) => (
          <img alt="artwork" src={art.primaryImageSmall} width="20%"></img>
        ))}
      </div>
    </div>
  );
};

export default SearchArt;
