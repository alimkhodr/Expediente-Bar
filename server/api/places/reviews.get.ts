const PLACE_ID = 'ChIJVx-dQk9LzJQR80Am0iwvW10'

export default cachedEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return $fetch(
    `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews&languageCode=pt-BR&key=${config.apiKey}`
  )
}, {
  maxAge: 60 * 60 * 24,
  swr: true,
  name: 'places-reviews',
})
