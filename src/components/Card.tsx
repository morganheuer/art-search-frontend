import { IArtData } from "./IArtData";

const Card = (props: { art: IArtData; query: string; addToDeck: any }) => {
  const { art } = props;
  if (art.primaryImageSmall && art.artistDisplayName && art.isPublicDomain) {
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
        <div>
          <button onClick={() => props.addToDeck(art.objectID)}>
            Add to Deck
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Card;
