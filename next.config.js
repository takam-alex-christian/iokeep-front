/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites(){
        return [
            {
                "source": "/be/:path*", // the /be represents requests meant for the backend
                "destination": `${process.env.BE_URL}/:path*`

            }
        ]
    }
}

module.exports = nextConfig
