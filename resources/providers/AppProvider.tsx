import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AppContextData {
  isLoggedIn: boolean;
  logout: () => void;
  theme: string | null;
  setTheme: Dispatch<SetStateAction<string>>;
  setToken: (token: string | null) => void;
  token: string | null;
}

interface AppContextProviderProps {
  children: ReactNode;
}

export enum AppTheme {
  DARK = 'dark',
  LIGHT = 'light',
}

const initialContext: AppContextData = {
  isLoggedIn: false,
  logout: () => undefined,
  theme: null,
  setTheme: () => undefined,
  setToken: () => undefined,
  token: null,
};

const AppContext = createContext<AppContextData>(initialContext);

export const useAppContext = (): AppContextData => useContext(AppContext);

export const AppContextProvider = ({
  children,
}: AppContextProviderProps): JSX.Element => {
  const [theme, setTheme] = useState(
    localStorage.getItem('flightLoggerTheme') ?? AppTheme.LIGHT,
  );
  const [token, setToken] = useState(localStorage.getItem('flightLoggerToken'));
  const logout = (): void => setToken(null);
  const isLoggedIn = useMemo(() => token !== null, [token]);

  useEffect(() => {
    if (token === null) {
      localStorage.removeItem('flightLoggerToken');
    } else {
      localStorage.setItem('flightLoggerToken', token);
    }
  }, [token]);

  useEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('data-theme', theme);
    window.localStorage.setItem('flightLoggerTheme', theme);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        logout,
        theme,
        setTheme,
        setToken,
        token,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
