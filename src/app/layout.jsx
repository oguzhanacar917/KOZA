import '../global.css';
import { AppProvider } from '../context/AppContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { UIProvider } from '../context/UIContext.jsx';
import { GlobalStateMachineProvider } from '../context/GlobalStateMachineContext.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export const metadata = {
    title: 'KOZA | Hikaye ve Dönüşüm Platformu',
    description: 'Zorbalığa karşı verdiğiniz mücadelede yalnız değilsiniz. Hikayenizi paylaşın, dönüşümü başlatın.',
    openGraph: {
        title: 'KOZA | Hikaye ve Dönüşüm',
        description: 'Hikayenizi paylaşın, gücünüzü keşfedin.',
        url: 'https://koza-app.vercel.app',
        siteName: 'KOZA.AI',
        locale: 'tr_TR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KOZA | Hikaye ve Dönüşüm',
        description: 'Hikayenizi paylaşın, gücünüzü keşfedin.',
    },
    robots: { index: true, follow: true },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
    themeColor: '#0f172a',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div id="root">
                    <ErrorBoundary>
                        <GlobalStateMachineProvider>
                            <AuthProvider>
                                <UIProvider>
                                    <AppProvider>
                                        {children}
                                    </AppProvider>
                                </UIProvider>
                            </AuthProvider>
                        </GlobalStateMachineProvider>
                    </ErrorBoundary>
                </div>
            </body>
        </html>
    );
}
