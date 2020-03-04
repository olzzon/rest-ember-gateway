# REST-EMBER GATEWAY
Node based Emberprovider with REST API

### Run:
```
yarn
yarn start --emberIp="192.168.9.9" --emperPort="9000"
```
## Arguments:
### --emberIP="192.168.2.2"
If added the program will run as client on another machines Ember Server
The EmberTree from the server will be store in "storage/clientembertree.json"

### if no --emberIp argument are add in runtime:
The program will run as an emberServer and the following file will be used as emberTree:
#### --fileName="servertembertree.json"
You need to copy serverembertree-copy-this-to-storage.json into the storage folder, unless you have created your own.


### Query:
Get the full ember tree and state:
```
/state GET full
```
Get a parameter:
```
/state GET path="R3LAYVRX4/Ex/GUI/FaderSlot_1/FaderPosition"
``` 

Set a value:
```
/setvalue POST path="R3LAYVRX4/Ex/GUI/FaderSlot_1/FaderPosition" value=12
```

