const r = require('rethinkdb');
const io = require('socket.io')();


r.connect({
  host: 'localhost',
  port: 28015,
  db: 'awesome_whiteboard'
}).then((connection) => {
  io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
      return r.table('timers')
      .changes()
      .run(connection)
      .then((cursor) => {
        cursor.each((err, timerRow) => {
          client.emit('timer', timerRow.new_val.timestamp);
        });
      });
    });

  });
});


const port = 8000;
io.listen(port);
console.log('listening on port ', port);

