/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1154068080")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_533768264",
    "hidden": false,
    "id": "relation1227410978",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "oeuvres_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2015356637",
    "hidden": false,
    "id": "relation2168330563",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "canaux_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1154068080")

  // remove field
  collection.fields.removeById("relation1227410978")

  // remove field
  collection.fields.removeById("relation2168330563")

  return app.save(collection)
})
