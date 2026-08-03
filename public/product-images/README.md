# Product photos

Copy every image file from the accounting export folder
`zrebuilt.File1405-04-23` into this folder (`public/product-images/`).

Each product in `src/data/catalog.json` has an `imageName` field taken from the
"تصویر" column of the Excel export (e.g. `Img20260504-460.jpg`). The site loads
it from `/product-images/<imageName>` and falls back to a placeholder photo when
the file is missing.
