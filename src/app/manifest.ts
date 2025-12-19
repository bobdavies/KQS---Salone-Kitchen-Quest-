import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Salone Kitchen: Cyber-Experience',
        short_name: 'SaloneKitchen',
        description: 'An Afrofuturist culinary journey into West African cuisine.',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#39FF14',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
