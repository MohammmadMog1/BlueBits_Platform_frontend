import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./features/auth/redux/hooks";
import { getMeThunk } from "./features/auth/redux/authThunk";
import AppRouter from "./app/routes/AppRouter";
import GlobalLoader from "./shared/components/GlobalLoader/GlobalLoader";

const ME_STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes

function App() {
  const dispatch = useAppDispatch();
  const { token, lastFetchedAt } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    const isStale =
      !lastFetchedAt || Date.now() - lastFetchedAt > ME_STALE_TIME_MS;

    if (isStale) {
      dispatch(getMeThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, token]);

  return (
    <div >
      <GlobalLoader />
      <AppRouter />
    </div>
  );
}

export default App;
