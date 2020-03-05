export const setValue = (req: any, res: any) => {
    console.log('Query : ', req.query)
    if (typeof(req.query.path) !== 'undefined') {
        global.mainThreadHandler.emberClientConnection.setValue(req.query.path, req.query.value)
        res.send('Value Changed')
    } 
}