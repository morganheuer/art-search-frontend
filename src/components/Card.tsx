import { IArtData } from "./IArtData";

const Card = (props: { art: IArtData; addToDeck: any; deck: IArtData[] }) => {
  const { art } = props;
  const isFavorite = props.deck.find((element) => element === art);
  if (
    art.primaryImageSmall &&
    art.artistDisplayName &&
    art.isPublicDomain &&
    !isFavorite
  ) {
    return (
      <div className="result-object">
        <div className="image-container">
          <img alt={art.title} src={art.primaryImageSmall}></img>
        </div>
        <div className="info">
          <div className="title">{art.title}</div>
          <div className="attribution">
            {art.artistDisplayName}, {art.objectDate}
          </div>
        </div>
        <div id="container">
          <button
            className="button"
            id="addFavoriteButton"
            onClick={() => props.addToDeck(art.objectID)}
          >
            <span id="heart">♥</span> Add to Favorites
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Card;
