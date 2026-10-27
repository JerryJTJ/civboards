import { Button } from "@heroui/button";
import { useAuth0 } from "@auth0/auth0-react";
import getViewportSize from "@components/utils/getViewportSize";
import useWindowDimensions from "@hooks/useWindowDimensions";

const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();
	const { width } = useWindowDimensions();

	return (
		<Button
			className="border-fg"
			color="primary"
			size={getViewportSize(width) === "xs" ? "sm" : "md"}
			variant="shadow"
			onPress={() => {
				void loginWithRedirect({
					authorizationParams: {
						redirect_uri: window.location.origin,
						audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN as string}/api/v2/`,
						scope: import.meta.env.VITE_AUTH0_AUTHSCOPE as string,
					},
				});
			}}
		>
			Log In
		</Button>
	);
};

export default LoginButton;
