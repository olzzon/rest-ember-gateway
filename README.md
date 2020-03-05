# REST-EMBER GATEWAY
Node based Emberprovider with REST API

### Run as Docker: (On linux)
```
docker pull olzzon/rest-ember-gateway:develop

Run as Ember Client:
sudo docker run --mount source=rest-ember-vol,target=/opt/rest-ember-gateway/storage -e emberIp="192.168.9.9" -e emberPort="9000" -e loggerIp='0.0.0.0' -e loggerPort=9300 -e loggerFileLevel='error' --network="host" --restart always olzzon/rest-ember-gateway:develop

Run as Ember Server: (copy your treefile.json to /opt/rest-ember-gateway)
sudo docker run -v /opt/rest-ember-gateway:/opt/rest-ember-gateway/storage -e emberFile="vsm.json" -e emberPort="9000" -e loggerIp='0.0.0.0' -e loggerPort=9300 -e loggerFileLevel='error' --network="host" olzzon/rest-ember-gateway:develop

```

Running Docker with Elastic Search: 
Set env vars: loggerIp=xx.xx.xx.xx and loggerPort=xxxx and loggerLevel='info' 

if you wish to log to logfile instead of kibana:
Set env var: -e loggerFileLevel='info'
(no kibana args will default to: 0.0.0.0:9200 logger level='info')


### Run as Node locally on computer:
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
#### --fileName="embertree.json"
To create a test EmberTree run:
```
yarn ts-node createMocks.ts
```

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

