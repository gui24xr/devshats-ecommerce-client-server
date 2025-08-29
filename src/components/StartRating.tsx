export default function StarRating({ rating, maxStars = 5 }) {
    const stars = [];
    
    for (let i = 1; i <= maxStars; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-400 text-lg">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-400 text-lg">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 text-lg">☆</span>);
      }
    }
    
    return <div className="flex items-center">{stars}</div>;
  };