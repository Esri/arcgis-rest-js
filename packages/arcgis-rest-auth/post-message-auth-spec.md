# Post Message Authentication Specification

## Message Types

Messages send via `postMessage` can be any object, but by convention usually have a `type` property that describes what sort of message it is.

| Type                            | Description                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `arcgis:auth:requestCredential` | Request credential from host app. Request will be rejected if the `event.origin` is not in the `validOrigins` list |
| `arcgis:auth:credential`        | Returning the credential in `event.credential`                                                                     |
| `arcgis:auth:rejected`          | Returned if the host declines to send credentials. `event.message` will contain the reason                         |

# Message Details

## `arcgis:auth:requestCredential`

Sent from an embedded app, to the parent.

Message Object

```json
{
  "type": "arcgis:auth:requestCredential"
}
```

## `arcgis:auth:credential`

Send from the host app to the embedded app.

- Embedded application is responsible for calling `exchangeToken` or `validateAppAccess`

Message Object

```json
{
  "type": "arcgis:auth:credential",
  "credential": {
    "token": "thetoken",
    "userId": "jsmith",
    "server": "https://www.arcgis.com",
    "ssl": true,
    "expires": 1599831467093
  }
}
```

## `arcgis:auth:rejected`

Sent from an host app, to an embedded app, with an error indicating why

Message Object

```json
{
  "type": "arcgis:auth:rejected",
  "message": "Rejected authentication request."
}
```
