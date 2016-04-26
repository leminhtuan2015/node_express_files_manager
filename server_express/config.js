var config = {};

config.status = {};
config.redis = {};
config.web = {};

config.redis.host = 'hostname';
config.redis.port = 6379;
config.web.port = process.env.WEB_PORT || 9980;

config.database = '/home/leminhtuan/Nodejs/node_express_files_manager/server_express/public/files/';

config.status.ok = 'ok'
config.status.ng = 'ng'
config.status.no_file = 'no_file'

module.exports = config;
