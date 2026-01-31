const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-api/db.json');
const middlewares = jsonServer.defaults();

// Добавляем middleware
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Кастомные роуты для соответствия API

// GET /analytics/{playerId}/brawlers
server.get('/analytics/:playerId/brawlers', (req, res) => {
  const playerId = req.params.playerId;
  const db = router.db;
  const data = db.get('analytics').get(playerId).get('brawlers').value();
  
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      code: 404,
      error: 'Not Found',
      message: 'Player not found'
    });
  }
});

// GET /analytics/{playerId}/brawlers/{brawler}/winrate-history
server.get('/analytics/:playerId/brawlers/:brawler/winrate-history', (req, res) => {
  const playerId = req.params.playerId;
  const brawler = req.params.brawler;
  const days = req.query.days || 30;
  
  const db = router.db;
  const data = db.get('analytics')
    .get(playerId)
    .get('winrate_history')
    .get(brawler)
    .value();
  
  if (data) {
    // Обрезаем историю по количеству дней
    const history = data.history.slice(-days);
    res.json({
      ...data,
      days: parseInt(days),
      history: history
    });
  } else {
    res.status(404).json({
      code: 404,
      error: 'Not Found',
      message: 'Brawler history not found'
    });
  }
});

// GET /analytics/{playerId}/maps/{map}/brawlers
server.get('/analytics/:playerId/maps/:map/brawlers', (req, res) => {
  const playerId = req.params.playerId;
  const map = req.params.map;
  
  const db = router.db;
  const data = db.get('analytics')
    .get(playerId)
    .get('maps')
    .get(map)
    .value();
  
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({
      code: 404,
      error: 'Not Found',
      message: 'Map data not found'
    });
  }
});

// POST /admin/sync/{playerId}
server.post('/admin/sync/:playerId', (req, res) => {
  const playerId = req.params.playerId;
  const db = router.db;
  const data = db.get('admin').get('sync').get(playerId).value();
  
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({
      code: 500,
      error: 'Internal Server Error',
      message: 'Failed to sync player data'
    });
  }
});

// Использовать роутер по умолчанию
server.use(router);

// Запустить сервер
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Mock API Server запущен на http://localhost:${PORT}`);
  console.log('Доступные эндпоинты:');
  console.log('  GET  /analytics/:playerId/brawlers');
  console.log('  GET  /analytics/:playerId/brawlers/:brawler/winrate-history?days=30');
  console.log('  GET  /analytics/:playerId/maps/:map/brawlers');
  console.log('  POST /admin/sync/:playerId');
});
