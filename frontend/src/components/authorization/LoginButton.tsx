import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@heroui/button";

const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();

	return (
		<Button
			className="border border-white/20"
			color="primary"
			variant="shadow"
			onPress={async () => await loginWithRedirect()}
		>
			Log In
		</Button>
	);
};

export default LoginButton;
