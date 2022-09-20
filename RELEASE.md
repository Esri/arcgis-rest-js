# Release system

As of v4, the ArcGIS REST JS packages are released automatically via Semantic Release. To run the release:

1. Temporarily disable the [branch protection rules](https://github.com/Esri/arcgis-rest-js/settings/branches) on the `main` branch.
2. Find the most recent failed [`Build, Test, Release` GitHub action workflow run](https://github.com/Esri/arcgis-rest-js/actions/workflows/release.yml), and re-run it.
3. After the release is complete, re-enable the branch protection rules from step 1.
