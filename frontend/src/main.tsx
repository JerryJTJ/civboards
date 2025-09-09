import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import "@/styles/globals.css";

const queryClient = new QueryClient();

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Provider>
				<Auth0Provider
					domain={AUTH0_DOMAIN}
					clientId={AUTH0_CLIENT_ID}
					authorizationParams={{
						redirect_uri: window.location.origin,
						audience: "https://civboards.ca.auth0.com/api/v2/",
						// scope: "read:current_user update:current_user_metadata",
					}}
				>
					<QueryClientProvider client={queryClient}>
						<App />
						<ReactQueryDevtools initialIsOpen={false} />
					</QueryClientProvider>
				</Auth0Provider>
			</Provider>
		</BrowserRouter>
	</React.StrictMode>
);
