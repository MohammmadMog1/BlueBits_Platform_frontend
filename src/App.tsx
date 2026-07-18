import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./features/auth/redux/hooks";
import { getMeThunk } from "./features/auth/redux/authThunk";
import AppRouter from "./app/routes/AppRouter";
import GlobalLoader from "./shared/components/GlobalLoader/GlobalLoader";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (token && !user && !isAuthenticated) {
      dispatch(getMeThunk());
    }
  }, [dispatch, token, user, isAuthenticated]);

  return (
    <div >
      <GlobalLoader />
      <AppRouter />
    </div>
  );
}

export default App;
