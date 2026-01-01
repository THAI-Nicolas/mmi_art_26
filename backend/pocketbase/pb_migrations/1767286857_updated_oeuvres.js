/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_533768264")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_436783588",
    "hidden": false,
    "id": "relation4035429547",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "oeuvres_images",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_533768264")

  // remove field
  collection.fields.removeById("relation4035429547")

  return app.save(collection)
})
