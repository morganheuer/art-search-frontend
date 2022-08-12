import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import Favorite from "./Favorites";
import { IArtData } from "./IArtData";
const SearchArt = () => {
  const [query, setQuery] = useState("");
  const [objects, setObjects] = useState([]);
  const [artData, setArtData] = useState<IArtData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [cards, setCards] = useState<IArtData[]>([]);

  const URL = "https://collectionapi.metmuseum.org/public/collection/v1";

  useEffect(() => {
    const getObjectsFromSearch = () => {
      axios
        .get(`${URL}/search`, {
          params: {
            hasImages: true,
            // artistOrCulture: true,
            q: query,
          },
        })
        .then((res) => {
          if (!res.data.objectIDs) {
            setIsError(true);
          } else {
            const objectIDs = res.data.objectIDs.slice(0, 100);
            setObjects(objectIDs);
            setIsError(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    if (query) {
      getObjectsFromSearch();
    }
  }, [query]);

  const getArtDataWaiting = () => {
    setIsLoading(true);
    const pendingData: Promise<IArtData>[] = [];
    for (let i of objects) {
      pendingData.push(
        axios
          .get(`${URL}/objects/${i}`, { validateStatus: () => true })
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
      setIsLoading(false);
    });
  };

  useEffect(getArtDataWaiting, [objects]);

  const search = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("#searchText") as HTMLInputElement;
    setQuery(input.value);
  };

  const addToDeck = (id: number) => {
    const card: IArtData | undefined = artData.find(
      (item) => item.objectID === id
    );
    if (card !== undefined) {
      if (cards) {
        let array: IArtData[] = cards;
        array.push(card);
        setCards([...array]);
      } else {
        setCards([card]);
      }
    }

    console.log(cards);
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
          placeholder={`Try "Degas" or "Van Gogh"`}
        />
        <button className="searchButton">Search</button>
      </form>
      <div className="art-container">
        {cards.map((card) => (
          <Favorite key={card.objectID} card={card} />
        ))}
      </div>
      <div className="art-container">
        {isLoading && <p>Loading...</p>}
        {isError && <p>No results matching your search for "{query}"</p>}
        {!isLoading &&
          artData.map((art) => (
            <Card
              key={art.objectID}
              art={art}
              addToDeck={addToDeck}
              deck={cards}
            />
          ))}
      </div>
    </div>
  );
};

export default SearchArt;
