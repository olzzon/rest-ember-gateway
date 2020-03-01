# tv2-rest-based-ember-provider
Node based Emberprovider with REST API and a planned SocketIO for realtime support


### Run:
```
yarn
yarn start --emberIp="0.0.0.0" --emperPort="9000"
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

