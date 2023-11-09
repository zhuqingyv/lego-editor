import { createRoot } from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import Lego from './Lego';
import PageList from './PageList';
import './index.css';

const router = createHashRouter([
  {
    path: '/',
    element: <PageList />
  },
  {
    path: 'page/:pageId',
    element: <Lego />,
  }
])

createRoot(document.getElementById('app')!).render(<RouterProvider router={router} />);