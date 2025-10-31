import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@heroui/button";

import getViewportSize from "../utils/getViewportSize";

import useWindowDimensions from "@/hooks/useWindowDimensions";

const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();
	const { width } = useWindowDimensions();

	return (
		<Button
			className="border border-white/20"
			color="primary"
			size={getViewportSize(width) === "xs" ? "sm" : "md"}
			variant="shadow"
			onPress={async () => await loginWithRedirect()}
		>
			Log In
		</Button>
	);
};

export default LoginButton;
