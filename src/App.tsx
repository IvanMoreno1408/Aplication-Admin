import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { UIProvider } from './context/UIContext';
import { AppRouter } from './routes/AppRouter';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <UIProvider>
          <AppRouter />
        </UIProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
