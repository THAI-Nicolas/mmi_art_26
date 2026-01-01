/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1154068080")

  // update collection data
  unmarshal({
    "name": "artistes"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1154068080")

  // update collection data
  unmarshal({
    "name": "Artistes"
  }, collection)

  return app.save(collection)
})
