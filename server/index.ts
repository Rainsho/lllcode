import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import laabr from 'laabr';
import CONFIG from './config.js';
import {
  checkUser,
  getSubmissions,
  getToday,
  getUserCheckout,
  updateUser,
  upsertUser,
} from './services/api.js';
import { db } from './utils/db.js';
import './schedule/index.js';

const init = async () => {
  const server = Hapi.server({ port: +process.env.PORT || 3333, host: '0.0.0.0' });

  await db.read();
  await server.register(Inert);
  await server.register({
    plugin: laabr,
    options: {
      formats: {
        response: ':time[iso] :method :ip :url :status (:responseTime ms)',
      },
      tokens: {
        ip: data => data.req.headers['x-real-ip'] || data.req.remoteAddress,
      },
    },
  });

  // inner use
  server.route({ method: 'GET', path: '/today', handler: getToday });
  server.route({ method: 'GET', path: '/submissions', handler: getSubmissions });

  // for common
  server.route({ method: 'GET', path: '/users', handler: () => Object.values(db.data.users) });
  server.route({ method: 'GET', path: '/checkout', handler: getUserCheckout });
  server.route({ method: 'PUT', path: '/users', handler: updateUser }); // this do not check `token`

  // for admin
  server.route({ method: 'POST', path: '/users', handler: upsertUser });
  server.route({ method: 'POST', path: '/check', handler: checkUser });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: { directory: { path: CONFIG.CLIENT_FOLDER, index: ['index.html'] } },
  });

  await server.start();

  console.log('Server running on %s', server.info.uri);
  console.log('With env:', process.env.NODE_ENV);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
