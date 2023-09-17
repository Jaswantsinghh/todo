/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'firebasestorage.googleapis.com',
              port: '',
              pathname: '/v0/b/todo-62fd1.appspot.com/o/**',
            },
          ],
    },
}

module.exports = nextConfig
