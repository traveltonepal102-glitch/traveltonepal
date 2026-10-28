import { Icon } from "@ttn/ui/icon";

/** Five stars, `rating` of them filled, read out as "Rated 4 out of 5". */
export const ReviewStars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <span className="inline-flex text-saffron">
    {Array.from({ length: 5 }, (_, index) => (
      <Icon key={index} name={index < rating ? "star-fill" : "star"} size={size} aria-hidden="true" />
    ))}
    <span className="sr-only">Rated {rating} out of 5</span>
  </span>
);
