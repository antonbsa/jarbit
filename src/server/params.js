function error(envName) {
  throw new Error(`Missing environment variable: ${envName}`);
}

function getEnvValue(name) {
  return process.env[name]?.trim();
}

function checkEnv(env) {
  const value = getEnvValue(env);
  return !!value ? value : error(env);
}

function getBooleanEnvValue(env) {
  const value = getEnvValue(env);
  return value == 'true' ? true : false;
}

function checkEnvironmentType() {
  const value = checkEnv('ENVIRONMENT');

  const availableTypes = ['dev', 'test', 'prod'];
  const environmentError = () => {
    throw new Error(`Wrong environment type. Allowed types: ${availableTypes.toString()}`);
  }

  return availableTypes?.some(e => e === value) ? value : environmentError();
}

const environment = checkEnvironmentType();
const dbPassword = checkEnv('DB_PASSWORD');

module.exports = exports = {
  environment,
  databaseUrl: `mongodb+srv://${environment}-user:${dbPassword}@cluster0.7es45.mongodb.net/${environment}-db?retryWrites=true&w=majority`,
  botApiToken: getEnvValue('BOT_API_TOKEN'),
  githubAuthClient: checkEnv('GITHUB_OAUTH_CLIENT'),
  githubAuthSecret: checkEnv('GITHUB_OAUTH_SECRET'),
  debugMode: getBooleanEnvValue('DEBUG_MODE'),
}