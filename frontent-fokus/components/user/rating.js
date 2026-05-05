import { Star } from "lucide-react";
import { useState } from "react";
import { GoStarFill } from "react-icons/go";

export default function RatingStars({ rating, setRating }) {
  const [hover, setHover] = useState(null);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Rating
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= (hover || rating);
          return (
            <GoStarFill
              key={star}
              size={28}
              className={`cursor-pointer transition-colors ${
                isFilled ? "text-red-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
      </div>
    </div>
  );
}
