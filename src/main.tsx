import { createRoot } from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

import Lego from './Lego';
import PageList from './PageList';
import XRender from './XRender';
import './index.css';

const router = createHashRouter([
  {
    path: '/',
    element: <PageList />
  },
  {
    path: 'page/:pageId',
    element: <Lego />,
  },
  {
    path: 'x-render',
    element: <XRender />
  }
])

createRoot(document.getElementById('app')!).render(<RouterProvider router={router} />);