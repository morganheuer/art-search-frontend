import { IArtData } from "./IArtData";

const Favorite = (props: { card: IArtData }) => {
  const { card } = props;
  if (card) {
    return (
      <div className="result-object">
        <div className="frame">
          <img alt={card.title} src={card.primaryImageSmall}></img>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Favorite;
