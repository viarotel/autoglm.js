import { Route, Routes } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import { routes } from './routes'

export default function AppRouter() {
  return (
    <MainLayout>
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={<Component />}
          />
        ))}
      </Routes>
    </MainLayout>
  )
}
