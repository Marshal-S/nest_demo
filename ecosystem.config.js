module.exports = {
  apps : [{
    name: 'nest-demo',
    script: 'dist/main.js',
    watch: true,
    ignore_watch: ['public', 'node_modules'],
    env: {
      APP_SECRET: '123456789',
      APP_HOST: 'localhost',
      APP_PORT: '3000',
      APP_PREFIX: 'api',
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USER: 'root',
      DB_PASSWORD: '12345678',
      DB_DATABASE: 'nest_demo',
      MINIO_POINT: 'localhost',
      MINIO_PORT: '9000',
      MINIO_ACCESSKEY: 'Hk1buzFpo6VhAKyRb2bl',
      MINIO_SECRETKEY: '37PQbVwfH9cFlhefdb2rdsctvlDqLdUbeKeQ0rf3',
      MINIO_BUCKETNAME: 'dev',
    }
  }]
};
