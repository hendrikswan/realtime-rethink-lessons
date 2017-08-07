import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';
import createSync from 'rxsync';

const port = parseInt(window.location.search.replace('?', ''), 10) || 8000;
const socket = openSocket(`http://localhost:${port}`);

function subscribeToDrawings(cb) {
  socket.on('drawing', drawing => cb(drawing));
  socket.emit('subscribeToDrawings');
}

function createDrawing(name) {
  socket.emit('createDrawing', { name });
}

const sync = createSync({
  maxRetries: 10,
  delayBetweenRetries: 1000,
  syncAction: line => new Promise((resolve, reject) => {
    let sent = false;

    socket.emit('publishLine', line, () => {
      sent = true;
      resolve();
    });

    setTimeout(() => {
      if (!sent) {
        reject();
      }
    }, 2000);
  }),
});

sync.failedItems.subscribe(x => console.error('failed line sync: ', x));
sync.syncedItems.subscribe(x => console.log('successful line sync: ', x));


function publishLine({ drawingId, line }) {
  sync.queue({ drawingId, ...line });
}

function subscribeToDrawingLines(drawingId, cb) {

  const lineStream = Rx.Observable.fromEventPattern(
    h => socket.on(`drawingLine:${drawingId}`, h),
    h => socket.off(`drawingLine:${drawingId}`, h),
  );

  const bufferedTimeStream = lineStream
  .bufferTime(100)
  .map(lines => ({ lines }));

  const reconnectStream = Rx.Observable.fromEventPattern(
    h => socket.on('connect', h),
    h => socket.off('connect', h),
  );

  const maxStream = lineStream.map(l => new Date(l.timestamp).getTime()).scan((a, b) => ((a > b) ? a : b), 0);

  reconnectStream
  .withLatestFrom(maxStream)
  .subscribe((joined) => {
    const lastReceivedTimestamp = joined[1];
    socket.emit('subscribeToDrawingLines', { drawingId, from: lastReceivedTimestamp });
  });




  bufferedTimeStream.subscribe(linesEvent => cb(linesEvent));
  socket.emit('subscribeToDrawingLines', { drawingId });
}


function subscribeToConnectionEvent(cb) {
  socket.on('connect', () => cb({ state: 'connected', port }));
  socket.on('disconnect', () => cb({ state: 'disconnected', port }));
  socket.on('connect_error', () => cb({ state: 'disconnected', port }));
}

export {
  publishLine,
  createDrawing,
  subscribeToDrawings,
  subscribeToDrawingLines,
  subscribeToConnectionEvent,
};