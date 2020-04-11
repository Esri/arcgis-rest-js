call rmdir/q/s node_modules
call rmdir/q/s packages\arcgis-rest-auth\node_modules
call rmdir/q/s packages\arcgis-rest-feature-layer\node_modules
call rmdir/q/s packages\arcgis-rest-geocoding\node_modules
call rmdir/q/s packages\arcgis-rest-portal\node_modules
call rmdir/q/s packages\arcgis-rest-request\node_modules
call rmdir/q/s packages\arcgis-rest-routing\node_modules
call rmdir/q/s packages\arcgis-rest-service-admin\node_modules

call npm install

call npm run test:all

if "%1%" EQU "" pause

