/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_533768264")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1154068080",
    "hidden": false,
    "id": "relation567433284",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "artiste_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_533768264")

  // remove field
  collection.fields.removeById("relation567433284")

  return app.save(collection)
})
