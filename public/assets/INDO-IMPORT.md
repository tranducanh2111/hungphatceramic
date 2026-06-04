# INDO tile assets — import from Google Drive

Source folder: [MẪU GẠCH INDO](https://drive.google.com/drive/folders/1rEh2ZKte59w-NTTw5H9DvrwgrkccX6gA)

**Automated (recommended):** pull all JPGs from the shared Drive folder:

```bash
pnpm download:indo-assets
pnpm optimize:product-images
```

**Manual:** copy each file into the path below (keep filenames). Then run `pnpm optimize:product-images`.

## Square formats (100×100 primary — also list 120×120cm in catalog)

| SKU | Copy from Drive | Local path |
|-----|-----------------|------------|
| GS881042 | `GS881042.jpg` | `100X100/INDO GS881042/GS881042.jpg` |
| GS881042 | `GS881042_PhoiCanh.jpg` | `100X100/INDO GS881042/GS881042_PhoiCanh.jpg` |
| GS881042 | `GS881042_FullFaces.jpg` | `100X100/INDO GS881042/GS881042_FullFaces.jpg` |
| GS881045 | same pattern | `100X100/INDO GS881045/` |
| GS883009 | same pattern | `100X100/INDO GS883009/` |
| SS886101 | same pattern | `100X100/INDO SS886101/` |
| SS886106 | `SS886106.jpg`, `SS886106_PhoiCanh.jpg` only (FullFaces is PDF) | `100X100/INDO SS886106/` |

For **120×120cm** assets later, add a `120X120/INDO {SKU}/` folder only when you have files (do not commit empty placeholder directories).

## Large format 60×120

| SKU | Local folder |
|-----|----------------|
| SS1261307 | `60X120/INDO SS1261307/` |
| SS1261310 | `60X120/INDO SS1261310/` |
| SS1261311 | `60X120/INDO SS1261311/` |
| SS1261315 | `60X120/INDO SS1261315/` |

Use `{SKU}.jpg`, `{SKU}_PhoiCanh.jpg`, and `{SKU}_FullFaces.jpg` where Drive provides JPG (not PDF).
