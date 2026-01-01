/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1154068080")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select3419663749",
    "maxSelect": 1,
    "name": "mmi_year",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "1e année",
      "2e année",
      "3e année",
      "ancien étudiant"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1154068080")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select3419663749",
    "maxSelect": 1,
    "name": "mmi_year",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "1ère année",
      "2ème année",
      "3ème année",
      "ancien étudiant"
    ]
  }))

  return app.save(collection)
})
