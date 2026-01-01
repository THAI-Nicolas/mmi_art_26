/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_436783588")

  // update collection data
  unmarshal({
    "name": "oeuvres_images"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_436783588")

  // update collection data
  unmarshal({
    "name": "Oeuvres_images"
  }, collection)

  return app.save(collection)
})
