import { fetchTrendingAnime } from "@/lib/consumet";
import BannerSwiper from "./banner-swiper";

export const Banner = async () => {
  const top = await fetchTrendingAnime(1, 10);
  return (
    <div className="relative">
      <div className="relative w-full max-w-full p-0">
        <BannerSwiper trendingAnime={top.results} />
      </div>
    </div>
  );
};
