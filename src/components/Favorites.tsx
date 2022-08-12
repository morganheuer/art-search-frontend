import { IArtData } from "./IArtData";

const Favorite = (props: { card: IArtData }) => {
  const { card } = props;
  if (card) {
    return (
      <div className="result-object">
        <div className="image-container">
          <img alt={card.title} src={card.primaryImageSmall}></img>
        </div>
        <div className="info">
          <div className="title">{card.title}</div>
          <div className="attribution">
            {card.artistDisplayName}, {card.objectDate}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Favorite;
