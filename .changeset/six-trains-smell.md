---
"@esri/arcgis-rest-request": minor
---

Refactored internal request option normalization by moving `normalizeRequestOptions` into a shared utility, and updated `appendCustomParams` to normalize legacy `ILegacyRequestOptions` into `IRequestOptions` (`requestFlags`/`fetchOptions`) before returning.

Added a documented `IRequestFlags` interface and improved option documentation to clarify legacy options are in maintenance mode and being phased out.
