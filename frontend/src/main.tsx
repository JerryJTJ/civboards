import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@styles/globals.css";
import { Provider } from "./provider.tsx";
import App from "./App.tsx";

const queryClient = new QueryClient();

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN as string;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID as string;
const AUTH0_AUTHSCOPE = import.meta.env.VITE_AUTH0_AUTHSCOPE as string;

createRoot(document.getElementById("root") as Element).render(
	<StrictMode>
		<BrowserRouter>
			<Provider>
				<Auth0Provider
					authorizationParams={{
						redirect_uri: window.location.origin,
						audience: `https://${AUTH0_DOMAIN}/api/v2/`,
						scope: AUTH0_AUTHSCOPE,
					}}
					clientId={AUTH0_CLIENT_ID}
					domain={AUTH0_DOMAIN}
				>
					<QueryClientProvider client={queryClient}>
						<App />
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</Auth0Provider>
			</Provider>
		</BrowserRouter>
	</StrictMode>
);
