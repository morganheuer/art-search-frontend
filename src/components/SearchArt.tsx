import { useState } from "react";
import axios from "axios";
const SearchArt = () => {
  const [query, setQuery] = useState("");
  const [objects, setObjects] = useState([]);
  const [images, setImages] = useState<string[]>([]);

  const getObjectsFromSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .get(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}&hasImages=true&isPublicDomain=true`
      )
      .then((res) => {
        const objectIDs = res.data.objectIDs.slice(0, 10);
        setObjects(objectIDs);
        getImages();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getImages = () => {
    let img: string[] = [];
    for (let i of objects) {
      axios
        .get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${i}`
        )
        .then((res) => {
          let imgsrc = res.data.primaryImageSmall;
          console.log(imgsrc);
          if (imgsrc) {
            img.push(imgsrc);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setImages(img);
  };

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
        {images.map((image) => (
          <img alt="artwork" src={image} width="20%"></img>
        ))}
      </div>
    </div>
  );
};

export default SearchArt;