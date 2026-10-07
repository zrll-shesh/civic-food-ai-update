# Project audit

The supplied analysis ZIP contained 53 source files. This Vercel project preserves all of them under `public/source-data`.

- 24 PNG figures are copied to `public/assets` and exposed through the Evidence Library.
- 20 CSV analytical tables are converted to JSON for interactive previews and remain available in original CSV form under `public/source-data`.
- 3 analytical data CSVs are converted to JSON for the live dashboard: integrated decision support, 2026–2028 forecast, and final public voice NLP.
- The 38-province GeoJSON is used by the interactive choropleth.
- Analysis and run metadata are retained in `public/data` and the original source-data tree.

The dashboard is evidence-first: values displayed in the Command Center, Spatial Intelligence, Predictive Analytics, Public Voice, and Decision Support pages come from the saved analysis artifacts rather than from newly inferred values.
