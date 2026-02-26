import '../index.css';
import { AppProvider } from '../context/AppContext.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { UIProvider } from '../context/UIContext.jsx';
import { GlobalStateMachineProvider } from '../context/GlobalStateMachineContext.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

export const metadata = {
    title: 'KOZA.AI – Transform Bullying Into Strength',
    description: 'KOZA.AI helps you turn bullying or traumatic experiences into empowering AI-generated stories and interactive games.',
    openGraph: {
        title: 'KOZA.AI – Transform Bullying Into Strength',
        description: 'Turn your challenges into empowering stories with AI.',
        url: 'https://koza-app.vercel.app',
        siteName: 'KOZA.AI',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KOZA.AI – Transform Bullying Into Strength',
        description: 'Turn your challenges into empowering stories with AI.',
    },
    robots: { index: true, follow: true },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
    themeColor: '#9333ea',
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
