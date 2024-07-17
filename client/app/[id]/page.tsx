import Profiles from "./profilebox"
import Loading from "./loading"
import { Suspense } from 'react';
import Sidebar from './sidebar';

export default function Profile() {
    return (
      <div>
        <Sidebar />
        <Suspense fallback={<Loading />}>
          <Profiles />
        </Suspense>
      </div>
    );
}