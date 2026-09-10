import type { ReviewsResponse } from '~/types/reviews'

export default cachedEventHandler(async (event): Promise<ReviewsResponse> => {
  const dados = await buscarPlace<ReviewsResponse>(event, 'reviews,rating,userRatingCount')
  return {
    reviews: dados?.reviews ?? [],
    rating: dados?.rating,
    userRatingCount: dados?.userRatingCount
  }
}, {
  maxAge: import.meta.dev ? 1 : 60 * 60 * 24,
  swr: true,
  name: 'places-reviews',
  getKey: () => 'v2'
})
