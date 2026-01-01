/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2015356637")

  // update collection data
  unmarshal({
    "name": "canaux_numeriques"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2015356637")

  // update collection data
  unmarshal({
    "name": "Canaux_numeriques"
  }, collection)

  return app.save(collection)
})
