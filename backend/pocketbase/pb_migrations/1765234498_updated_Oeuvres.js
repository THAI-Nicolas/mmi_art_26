/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_533768264")

  // update collection data
  unmarshal({
    "name": "oeuvres"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_533768264")

  // update collection data
  unmarshal({
    "name": "Oeuvres"
  }, collection)

  return app.save(collection)
})
