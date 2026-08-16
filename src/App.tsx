import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./features/auth/redux/hooks";
import { getMeThunk } from "./features/auth/redux/authThunk";
import AppRouter from "./app/routes/AppRouter";
import GlobalLoader from "./shared/components/GlobalLoader/GlobalLoader";

function App() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMeThunk());
    }
  }, [dispatch, token]);

  return (
    <div >
      <GlobalLoader />
      <AppRouter />
    </div>
  );
}

export default App;
