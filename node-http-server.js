const server = http.createServer((req, res) => {
  try {
    respond(req, res);
  } catch (err) {
    console.log(err.message, err.stack)
    empty(res, err.message + err.stack);
  }
});

server.listen(config.port, '0.0.0.0', () => {
  console.log(`Сервер запущен port: ${config.port}`);
});
