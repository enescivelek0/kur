import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import About from './pages/About'
import AlertsPage from './pages/AlertsPage'
import Charts from './pages/Charts'
import Contact from './pages/Contact'
import ConverterPage from './pages/ConverterPage'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Rates from './pages/Rates'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="kurlar" element={<Rates />} />
        <Route path="cevirici" element={<ConverterPage />} />
        <Route path="grafikler" element={<Charts />} />
        <Route path="alarmlar" element={<AlertsPage />} />
        <Route path="hakkinda" element={<About />} />
        <Route path="iletisim" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
